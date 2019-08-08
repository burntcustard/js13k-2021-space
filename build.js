const browserSync = require('browser-sync').create();
const rollup = require('rollup');
const terser = require('terser');

const devMode = process.argv.slice(2).includes('--watch');
