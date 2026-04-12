const gulp = require('gulp');
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const DIST_DIR = './dist';

// Clean task
async function clean() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
}

// Bundle task
async function bundle() {
    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Build unminified version
    await esbuild.build({
        entryPoints: ['lib/index.js'],
        bundle: true,
        format: 'iife',
        globalName: 'Spellchecker',
        outfile: path.join(DIST_DIR, 'hunspell-spellchecker.js'),
        minify: false,
    });

    // Build minified version
    await esbuild.build({
        entryPoints: ['lib/index.js'],
        bundle: true,
        format: 'iife',
        globalName: 'Spellchecker',
        outfile: path.join(DIST_DIR, 'hunspell-spellchecker.min.js'),
        minify: true,
    });
}

// Export gulp tasks
gulp.task('clean', clean);
gulp.task('bundle', bundle);
gulp.task('default', gulp.series('clean', 'bundle'));
