const browserSync = require('browser-sync').create();
const rollup = require('rollup');
const terser = require('terser');

const devMode = process.argv.slice(2).includes('--watch');

console.log("Dev mode: " + devMode);

const config = {
    input: 'src/js/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        sourcemap: devMode
    }
}

const compile = async () => {
    if (devMode) {
        // watch for changes in source files
        const watcher = rollup.watch({
            input: config.input,
            output: [ config.output ],
            watch: {
              include: 'src/**'
            },
        });

        watcher.on('event', event => {

            switch (event.code) {
                case 'START':
                    console.log('Building JS...');
                    break;
                case 'BUNDLE_END':
                    console.log(`${event.input} (${event.duration}ms)`);
                    break;
                    // when all bundles are done
                case 'END':
                    if (inlineMinified(devMode)) {
                        console.log('inlineMinified worked?');
                      //livereload();
                      //zipReport();
                    }
                    break;
                case 'ERROR':
                case 'FATAL':
                    console.error('rollup Error:', event.error.message);
                    break;
            }
        });
    } else {
        console.log('Building JS...');
        const bundle = await rollup.rollup({input: config.input});
        await bundle.write(config.output);

        if (inlineMinified(devMode)) {
            //zipReport();
        }
  }
}

const inlineMinified = (devMode) => {
  const options = {
    compress: {
      passes: 4,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_comps: true,
      unsafe_math: true,
    },
    mangle: true,
    module: true,
    sourceMap: devMode ? {
        filename: 'dist/main.js',
        url: 'dist/main.js.map'
    } : false
  };

  // optimize JS bundle
  console.log('Minifying JS...');
  const result = terser.minify(config.output.file, options);

  if (result.error) {
    console.error('Terser minification failed: ', result.error.message);
    return false;
  }

  // We need to write result.code and result.map to files?..

  return true;
};

let livereload = () => {
  // On first run, start a web server
  browserSync.init({
    server: ['dist', 'src']
  });

  // On future runs, reload the browser
  livereload = () => {
    browserSync.reload('dist/index.html');
  }
};

compile();
