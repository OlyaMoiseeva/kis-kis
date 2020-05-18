"use strict";

const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemap = require("gulp-sourcemaps");
const csso = require("gulp-csso");
const minify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');

function cleanDist () {
  return del(['dist/**', '!dist']);
}

function jsMinify () {
  return src('src/js/*.js')
    .pipe(sourcemap.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minify())
    .pipe(rename(function (path) {
      path.basename += (".min");
    }))
    .pipe(sourcemap.write("."))
    .pipe(dest('dist/js'));
}

function compileCss () {
	return src('src/scss/**/*.scss')
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(dest('dist/css'));
}

function imagesLoader () {
  return src('src/images/*.{jpg,svg,png}')
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

function fontsLoader () {
  return src('src/fonts/*.{woff,woff2}')
    .pipe(dest('dist/fonts'));
}

function htmlLoader () {
  return src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
      }))
    .pipe(dest('dist'));
}

exports.watch = function() {
	watch('src/scss/**/*.scss', compileCss);
	watch('src/js/*.js', jsMinify);
  watch('src/*.html', htmlLoader);
}

exports.build = series(
  cleanDist,
  compileCss,
  jsMinify,
  imagesLoader,
  fontsLoader,
  htmlLoader
);