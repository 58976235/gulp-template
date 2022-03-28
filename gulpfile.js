const gulp = require('gulp')
const gulpif = require('gulp-if');
const minimist = require('minimist');
const gulpLess = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const del = require('del')
const webserver = require('gulp-webserver')
const pxtorem = require('gulp-pxtorem');
const rename = require('gulp-rename');
const resolvePath = require("gulp-resolve-path");
const through = require('through2')
const { projectName, baseUrl } = require("./config")
const options = {
  /*
   root: process.cwd(),
   ext: {
   template: ['html'],
   script: ['js'],
   style: ['css', 'less', 'sass']
   }
   */
};


const css = baseUrl + projectName + '/' + 'css/'
const js = baseUrl + projectName + '/' + 'js/'
const img = baseUrl + projectName + '/' + 'images/'
const font = baseUrl + projectName + '/' + 'fonts/'

const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

const gulpOptions = minimist(process.argv.slice(2), knownOptions);

const pxtoremOptions = {
  rootValue: 32,
  unitPrecision: 6,
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 2,
  exclude: /node_modules/i
}
const postcssOptions = {
  processors: [
    autoprefixer({ overrideBrowserslist: ['> 0.15% in CN'] })
  ]
}

const lessHandler = function () {
  return gulp
    .src(['./src/public/less/*.less', './src/pages/**/*.less', './src/components/**/*.less'])
    .pipe(gulpLess({
      javascriptEnabled: true
    }))
    .pipe(autoprefixer())
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(resolvePath(options))
    .pipe(through.obj(function (chunk, enc, cb) {
      let contents = chunk.contents.toString()
      let newContents = contents
      if (gulpOptions.env === 'production') {
        //newContents = contents.replace(/\/src\/static/g, '..')
        newContents = newContents.replace(/\\src\\static\\images\\/g, img)
        newContents = newContents.replace(/\\src\\static\\font\\/g, font)
      } else {
        //newContents = contents.replace(/\/src\/static/g, '..')
        newContents = newContents.replace(/\\src\\static\\images\\/g, '../images/')
        newContents = newContents.replace(/\\src\\static\\font\\/g, '../font/')
      }
      chunk.contents = Buffer.from(newContents)
      cb(null, chunk)
    }))
    .pipe(gulpif(gulpOptions.env === 'production', cssmin()))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./m/css'))
}

const cssHandler = function () {
  return gulp
    .src('./src/static/css/*.css')
    .pipe(gulpif(gulpOptions.env === 'production', cssmin()))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./m/css'))
}

const jsHandler = function () {
  return gulp
    .src(['./src/pages/**/*.js', './src/components/**/*.js'])
    .pipe(gulpif(gulpOptions.env === 'production', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(gulpOptions.env === 'production', uglify()))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./m/js'))
}

const publicJsHandler = function () {
  return gulp
    .src(['./src/public/js/*.js'])
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./m/js'))
}

const htmlHandler = function () {
  return gulp
    .src('./src/pages/**/*.html')
    .pipe(resolvePath(options))
    .pipe(through.obj(function (chunk, enc, cb) {
      let arr = chunk.relative.split('/').length > 1 ? chunk.relative.split('/') : chunk.relative.split('\\')
      let fileName = arr[0]
      let contents = chunk.contents.toString()
      let newContents = contents

      if (gulpOptions.env === 'production') {
        newContents = contents.replace('/src/pages/' + fileName + '/' + fileName + '.less', css + fileName + '.css')
        newContents = newContents.replace('\\src\\pages\\' + fileName + '\\' + fileName + '.less', css + fileName + '.css')
        newContents = newContents.replace('/src/static/css/', css)
        newContents = newContents.replace('\\src\\static\\css\\', css)
        newContents = newContents.replace(/\/src\/public\/js\//g, js)
        newContents = newContents.replace(/\\src\\public\\js\\/g, js)
        newContents = newContents.replace('/src/pages/' + fileName + '/' + fileName + '.js', js + fileName + '.js')
        newContents = newContents.replace('\\src\\pages\\' + fileName + '\\' + fileName + '.js', js + fileName + '.js')
        newContents = newContents.replace(/\/src\/static\/images\//g, img)
        newContents = newContents.replace(/\\src\\static\\images\\/g, img)
      } else {
        newContents = contents.replace('/src/pages/' + fileName + '/' + fileName + '.less', './css/' + fileName + '.css')
        newContents = newContents.replace('\\src\\pages\\' + fileName + '\\' + fileName + '.less', './css/' + fileName + '.css')
        newContents = newContents.replace('/src/static/css/', './css/')
        newContents = newContents.replace('\\src\\static\\css\\', './css/')
        newContents = newContents.replace(/\/src\/public\/js/g, './js')
        newContents = newContents.replace('/src/pages/' + fileName + '/' + fileName + '.js', './js/' + fileName + '.js')
        newContents = newContents.replace(/\/src\/static/g, '.')
        newContents = newContents.replace(/\\src\\public\\js\\/g, './js/')
        newContents = newContents.replace('\\src\\pages\\' + fileName + '\\' + fileName + '.js', './js/' + fileName + '.js')
        newContents = newContents.replace(/\\src\\static\\/g, './')
        newContents = newContents.replace('../../components/', '')
        newContents = newContents.replace('..\\..\\components\\', '')

      }
      chunk.contents = Buffer.from(newContents)
      cb(null, chunk)
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('./m'))
}

const imgHandler = function () {
  return gulp
    .src('./src/static/images/**')
    .pipe(gulp.dest('./m/images'))
}

const fontHandler = function () {
  return gulp
    .src('./src/static/font/**')
    .pipe(gulp.dest('./m/font'))
}

const delHandler = function () {
  return del(['./m'])
}

const webHandler = function () {
  return gulp
    .src('./m')
    .pipe(webserver({
      host: 'localhost',
      port: '8081',
      livereload: true,
      open: './index.html',
      /* proxies:[
          {
              source: '/api', target: 'http://localhost:3000'  //后端地址
          }
      ] */
    }))
}

const watchHandler = function () {
  gulp.watch('./src/public/less/*.less', lessHandler),
  gulp.watch('./src/pages/**/*.less', lessHandler),
  gulp.watch('./src/components/**/*.less', lessHandler),
  gulp.watch('./src/static/css/*.css', cssHandler),
  gulp.watch('./src/pages/**/*.js', jsHandler),
  gulp.watch('./src/public/js/*.js', publicJsHandler),
  gulp.watch('./src/components/**/*.js', jsHandler),
  gulp.watch('./src/pages/**/*.html', htmlHandler),
  gulp.watch('./src/components/**/*.html', htmlHandler)
}


exports.default = gulp.series(
  delHandler,
  gulp.parallel(lessHandler, publicJsHandler, jsHandler, htmlHandler, imgHandler, fontHandler, cssHandler),
  webHandler,
  watchHandler
)