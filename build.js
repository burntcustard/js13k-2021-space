const browserSync = require('browser-sync').create();
const fs = require('fs');
const rollup = require('rollup');
const JSZip = require('jszip');
const terser = require('terser');

const devMode = process.argv.slice(2).includes('--watch');

const config = {
    input: 'src/js/game.js',
    output: {
        file: 'dist/game.js',
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
                        livereload();
                        zipReport();
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
            zipReport();
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
            //filename: 'dist/game.js.map',
            content: fs.readFileSync('dist/game.js.map', 'utf8'),
            url: 'minified.js.map'
        } : false
    };

    // optimize JS bundle
    console.log('Minifying JS...');
    const code = fs.readFileSync('dist/game.js').toString();
    const result = terser.minify(code, options);

    if (result.error) {
        console.error('Terser minify failed: ', result.error.message);
        return false;
    }

    fs.writeFileSync('dist/game.min.js', result.code, 'utf8');
    fs.writeFileSync('dist/game.min.js.map', result.map, 'utf8');

    console.log('Inlining JS...');
    // NOTE:prepend <body> so browsersync can insert its livereload script (development mode only)
    const html = fs.readFileSync('src/index.html').toString();
    fs.writeFileSync('dist/index.html', `${devMode ? '<body>' : ''}${html}<script>${result.code}</script>`);

    return true;
};

const zipReport = () => {
    var zip = new JSZip();
    zip.file(
        'index.html',
        fs.readFileSync('src/index.html').toString(),
        { createFolders: false }
    );
    zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
       .pipe(fs.createWriteStream('dist/game.zip'))
       .on('finish', function() {
           console.log('created game.zip');
           var zipSize = fs.statSync('dist/game.zip').size / 1000;
           console.log(zipSize + ' KB');
       });
}

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
