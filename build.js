/* eslint-disable no-console */

const path = require('path');
const browserSync = require('browser-sync').create();
const c = require('ansi-colors');
const fs = require('fs');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const terser = require('terser');
const postcss = require('postcss');
const postcssImport = require('postcss-easy-import');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier').minify;
const JSZip = require('jszip');

// Enabled/Disables browserSync live reloading rather than just building once
const DEVMODE = process.argv.slice(2).includes('--watch');

/**
 * Formats a duration number (ms) into a nice looking string with ansi-colors
 * @param  {number} duration Duration in milliseconds
 * @return {string}          Nicely formatted color string
 */
function formatMs(duration) {
  return c.magentaBright(`${duration.toString().padStart(4)} ms`);
}

/**
 * Console logs a duration (in milliseconds), a fancy arrow char, and a string
 * @param  {number} duration   [description]
 * @param  {string} outputFile [description]
 */
function logOutput(duration, outputFile) {
  console.log(`${formatMs(duration)} ↪ ${outputFile}`);
}

/**
 * Based off rollup-cli error printing
 * https://github.com/rollup/rollup/blob/master/cli/logging.ts
 * @param {object} error
 */
function printRollupError(error) {
  let description = error.message || error;

  if (error.name) {
    description = `${error.name}: ${description}`;
  }

  console.error(c.bold.red(`[!] ${description}`));

  if (error.loc) {
    const errorPath = error.loc.file.replace(process.cwd(), '');
    console.error(`${errorPath} ${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    console.error(c.gray(error.frame));
  }
}

/**
 * Minify the JS bundle. Includes using preprocess to remove debug messages.
 * @return {object} Output code from terser.minify
 */
async function minifyJs(compiledJs) {
  const startTime = Date.now();
  console.log('Minifying JS...');

  const minifyJsOptions = {
    compress: {
      passes: 2,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_comps: true,
      unsafe_math: true,
      // unsafe_proto: true,
      // booleans_as_integers: true
    },
    mangle: {
      properties: {
        keep_quoted: true,
        reserved: ['game'],
      },
    },
    module: true,
    sourceMap: DEVMODE ? {
      content: compiledJs.map,
      url: 'game.min.js.map',
    } : false,
  };

  const result = await terser.minify(compiledJs.code, minifyJsOptions);

  if (result.error) {
    console.error('Terser minify failed: ', result.error.message);
    return false;
  }

  fs.writeFile('dist/game.min.js', result.code, () => true);

  if (result.map) {
    fs.writeFile('dist/game.min.js.map', result.map, () => true);
  }

  logOutput(Date.now() - startTime, 'dist/game.min.js');

  return result.code;
}

/**
 * [inline description]
 * @param  {[type]} minifiedJS               [description]
 * @return {[type]}            [description]
 */
async function inline(css, js) {
  const startTime = Date.now();
  console.log('Inlining JS & CSS...');

  // Options: https://github.com/kangax/html-minifier#options-quick-reference
  const htmlMinifyConfig = {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
  };

  const html = fs.readFileSync('src/index.html', 'utf8');

  if (DEVMODE) {
    fs.writeFileSync('dist/index.dev.html', htmlMinify(html, htmlMinifyConfig));
  }

  let inlined = html;

  // Inline CSS
  inlined = inlined.replace(
    /<link rel="stylesheet"[^>]*>/,
    `<style>${css}</style>`,
  );

  // Inline JS
  inlined = inlined.replace(
    /<script[^>]*><\/script>/,
    `<script>${js}</script>`,
  );

  // Extra HTML hacks to reduce filesize
  // Remove <head>
  // htmlInline = htmlInline.replace(/<\/?head>/g, '');
  // Remove <body>
  // htmlInline = htmlInline.replace(/<\/?body>/g, '');

  fs.writeFileSync('dist/index.html', htmlMinify(inlined, htmlMinifyConfig));

  logOutput(Date.now() - startTime, 'dist/index.html');

  return true;
}

/**
 * Draw a fancy zip file size bar with KB and % values
 * @param  {number} used Size of zip file in bytes
 */
function drawSize(used) {
  const limit = 13312; // 13KiB or 'KB' (not kB!)
  const usedPercent = Math.round((100 / limit) * used);
  const barWidth = process.stdout.columns - 26;
  const usedBarWidth = Math.round((barWidth / 100) * usedPercent);
  const usedStr = (`${used} B`).padStart(7, ' ');
  const limitStr = (`${(limit / 1024).toFixed(0)} KB`).padEnd(5, ' ');
  let output = `${usedStr} / ${limitStr} [`;

  for (let i = 0; i < barWidth; i++) {
    output += `${i < usedBarWidth ? '#' : c.gray('-')}`;
  }
  output += '] ';
  output += usedPercent > 99 ? c.red(`${usedPercent}%`) : `${usedPercent}%`;

  console.log(output);
}

/**
 * [zip description]
 * @return {void}
 */
async function zip() {
  const startTime = Date.now();
  console.log('Zipping...');

  const jszip = new JSZip();
  const data = fs
    .readFileSync('dist/index.html', 'utf8')
    .replace('//# sourceMappingURL=game.min.js.map', '');

  jszip.file(
    'index.html',
    data,
    {
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    },
  );

  await new Promise((resolve) => {
    jszip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream('dist/game.zip'))
      .on('finish', resolve);
  });

  logOutput(Date.now() - startTime, 'dist/game.zip');
  drawSize(fs.statSync('dist/game.zip').size);
}

/**
 * Compile (transpile & minify) CSS, write it to a file, and return it
 * @return {[type]} [description]
 */
async function compileCss() {
  const mainCss = fs.readFileSync('src/css/main.css');

  const result = await postcss([postcssImport, cssnano])
    .process(mainCss, { from: 'src/css/main.css' });

  if (DEVMODE) {
    fs.writeFile('dist/game.css', result.css, () => true);
  } else {
    fs.writeFileSync('dist/game.css', result.css);
  }

  return result.css;
}

/**
 * Compile (rollup & minify) JS, write it to a file, and return it
 * @return {string} [description]
 */
async function compileJs() {
  const startTime = Date.now();
  console.log('Building JS from src/js/game.js...');

  const bundle = await rollup.rollup({
    input: 'src/js/game.js',
    plugins: [nodeResolve()],
  }).catch((error) => {
    printRollupError(error);
    return { error };
  });

  if (bundle.error) return '';

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: DEVMODE,
  });

  fs.writeFile('dist/game.js', output[0].code, () => true);

  logOutput(Date.now() - startTime, 'dist/game.js');

  const minifiedJs = await minifyJs(output[0]);

  return minifiedJs;
}

async function onFileEvent(event, file) {
  const isCss = path.extname(file) === '.css';
  const isJs = path.extname(file) === '.js';

  Promise.all([
    isCss ? compileCss() : fs.readFileSync('dist/game.css'),
    isJs ? compileJs() : fs.readFileSync('dist/game.min.js'),
  ]).then(async ([css, js]) => {
    await inline(css, js);
    if (!isCss) browserSync.reload();
    zip();
  });
}

// Create /dist if it doesn't already exist
fs.mkdirSync('dist');

// Generate CSS & JS at the same time
Promise.all([
  compileCss(),
  compileJs(),
]).then(async ([css, js]) => {
  // When both are finished, inline the CSS & JS into the HTML
  await inline(css, js);
  // Then create the zip file and print it's size (before browserSync init)
  await zip();

  if (DEVMODE) {
    browserSync.init({
      server: {
        baseDir: 'dist',
        index: 'index.dev.html',
      },
      files: [
        'dist/game.css',
        {
          match: ['src/**'],
          fn(event, file) {
            onFileEvent(event, file);
          },
        },
      ],
    });
  }
});
