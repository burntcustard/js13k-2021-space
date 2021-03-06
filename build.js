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
const { Packer } = require('roadroller');

// Enabled/Disables browserSync live reloading rather than just building once
const DEVMODE = process.argv.slice(2).includes('--watch');
const DEBUG = process.argv.slice(2).includes('--debug');
const PACK = process.argv.slice(2).includes('--pack');

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
function printCompileError(error) {
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
    mangle: !DEBUG ? { properties: 'true' } : false,
    module: true,
    sourceMap: DEVMODE ? {
      content: compiledJs.map,
      url: 'main.min.js.map',
    } : false,
  };

  let { code } = compiledJs;

  // Replace some "terser reserved words" from source before minifying
  // These are VERY LIKELY to break things
  code = code.replace(/acceleration/g, '_acceleration');
  code = code.replace(/detail/g, '_detail');
  code = code.replace(/parent/g, '_parent');
  code = code.replace(/update/g, '_update');
  code = code.replace(/upgrde/g, '_upgrade');
  code = code.replace(/level/g, '_level');
  // code = code.replace(/\.rx/g, '._rx'); // Rotation ones break constructors
  // code = code.replace(/\.ry/g, '._ry');
  // code = code.replace(/\.rz/g, '._rz');
  // code = code.replace(/direction/g, '_direction'); // Adds 1B ???
  // code = code.replace(/position/g, '_position'); // Breaks things
  // code = code.replace(/rotation/g, '_rotation'); // Breaks things
  // code = code.replace(/color/g, '_color'); // Breaks new color swatches

  const result = await terser.minify(code, minifyJsOptions);

  if (result.error) {
    console.error('Terser minify failed: ', result.error.message);
    return false;
  }

  fs.writeFile('dist/main.min.js', result.code, () => true);

  if (result.map) {
    fs.writeFile('dist/main.min.js.map', result.map, () => true);
  }

  logOutput(Date.now() - startTime, 'dist/main.min.js');

  return result.code;
}

/**
 * Put JS & CSS into minified HTML files
 * @param  {string} css
 * @param  {string} js
 */
async function bundleIntoHtml(css, js) {
  const startTime = Date.now();
  console.log('Inlining JS & CSS...');

  // Options: https://github.com/kangax/html-minifier#options-quick-reference
  const htmlMinifyConfig = {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
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
  // (First replace $ with $$$ so we don't trigger special regex parameters)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
  inlined = inlined.replace(
    /<script[^>]*><\/script>/,
    `<script>${js.toString().replace(/\$/g, '$$$')}</script>`,
  );

  // Extra HTML hacks to reduce filesize
  // Remove <head>
  // htmlInline = htmlInline.replace(/<\/?head>/g, '');
  // Remove <body>
  // htmlInline = htmlInline.replace(/<\/?body>/g, '');

  fs.writeFileSync('dist/index.html', htmlMinify(inlined, htmlMinifyConfig));

  logOutput(Date.now() - startTime, 'dist/index.html');
}

/**
 * Put JS & CSS into minified HTML files, with roadroller!
 * @param  {string} css
 * @param  {string} js
 */
async function bundleIntoHtmlWithRoadRoller(css, js) {
  const startTime = Date.now();
  console.log('Inlining JS & CSS with Roadroller (may take some time)...');

  // Options: https://github.com/kangax/html-minifier#options-quick-reference
  const htmlMinifyConfig = {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
  };

  const html = fs.readFileSync('src/index.html', 'utf8');

  let htmlNoScriptNoStyle = html;

  htmlNoScriptNoStyle = htmlNoScriptNoStyle.replace(
    /<script[^>]*><\/script>/,
    '',
  );
  htmlNoScriptNoStyle = htmlNoScriptNoStyle.replace(
    /<link rel="stylesheet"[^>]*>/,
    '',
  );

  htmlNoScriptNoStyle = htmlMinify(htmlNoScriptNoStyle, htmlMinifyConfig);

  let htmlForRoadroller = `document.write(\`<style>${css}</style>${htmlNoScriptNoStyle}\`);${js.toString()}`;

  htmlForRoadroller = htmlForRoadroller.replace(/--color-primary/g, '--p');
  htmlForRoadroller = htmlForRoadroller.replace(/--color-secondary/g, '--s');
  htmlForRoadroller = htmlForRoadroller.replace(/--color-accent/g, '--a');
  htmlForRoadroller = htmlForRoadroller.replace(/ui-panel/g, 'uip');

  fs.writeFileSync('dist/index.pre-rr.html', htmlForRoadroller);

  const packer = new Packer([{
    data: htmlForRoadroller,
    type: 'js',
    action: 'eval',
  }], {});

  await packer.optimize();

  const { firstLine, secondLine } = packer.makeDecoder();

  fs.writeFileSync('dist/index.html', `<script>${firstLine} ${secondLine}</script>`);

  logOutput(Date.now() - startTime, 'dist/index.html');
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
    .replace('//# sourceMappingURL=main.min.js.map', '');

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
    .process(mainCss, { from: 'src/css/main.css' })
    .catch((error) => {
      printCompileError(error);
      return { error };
    });

  if (result.error) return '';

  if (DEVMODE) {
    fs.writeFile('dist/main.css', result.css, () => true);
  } else {
    fs.writeFileSync('dist/main.css', result.css);
  }

  return result.css;
}

/**
 * Compile (rollup & minify) JS, write it to a file, and return it
 * @return {string} [description]
 */
async function compileJs() {
  const startTime = Date.now();
  console.log('Building JS from src/js/main.js...');

  const bundle = await rollup.rollup({
    input: 'src/js/main.js',
    plugins: [nodeResolve()],
  }).catch((error) => {
    printCompileError(error);
    return { error };
  });

  if (bundle.error) return '';

  const { output } = await bundle.generate({
    format: 'iife',
    sourcemap: DEVMODE,
  });

  fs.writeFile('dist/main.js', output[0].code, () => true);

  logOutput(Date.now() - startTime, 'dist/main.js');

  const minifiedJs = await minifyJs(output[0]);

  return minifiedJs;
}

async function onFileEvent(event, file) {
  const isCss = path.extname(file) === '.css';
  const isJs = path.extname(file) === '.js';

  Promise.all([
    isCss ? compileCss() : fs.readFileSync('dist/main.css'),
    isJs ? compileJs() : fs.readFileSync('dist/main.min.js'),
  ]).then(async ([css, js]) => {
    await bundleIntoHtml(css, js);
    if (!isCss) browserSync.reload();
    zip();
  });
}

// Create /dist if it doesn't already exist
fs.mkdirSync('dist', { recursive: true });

// Generate CSS & JS at the same time
Promise.all([
  compileCss(),
  compileJs(),
]).then(async ([css, js]) => {
  // When both are finished, inline the CSS & JS into the HTML
  if (PACK) {
    await bundleIntoHtmlWithRoadRoller(css, js);
  } else {
    await bundleIntoHtml(css, js);
  }
  // Then create the zip file and print it's size (before browserSync init)
  await zip();

  if (DEVMODE) {
    browserSync.init({
      server: {
        baseDir: 'dist',
        index: 'index.dev.html',
      },
      files: [
        'dist/main.css',
        {
          match: ['src/**'],
          fn(event, file) {
            onFileEvent(event, file);
          },
        },
      ],
      open: false,
    });
  }
});
