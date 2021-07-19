const gulp = require('gulp')
const gulpLess = require('gulp-less');
const autoprefixer=require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const uglify=require('gulp-uglify')
const babel=require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const del=require('del')
const webserver =require('gulp-webserver')
const include=require('gulp-file-include')
const pxtorem = require('gulp-pxtorem');
const pxtoremOptions = {
    rootValue: 10,
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

const cssHandler=function(){
    return gulp
    .src('./src/less/*/*.less')
    .pipe(gulpLess({
        javascriptEnabled: true
    }))
    .pipe(autoprefixer())
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
}

const jsHandler=function(){
    return gulp
    .src('./src/js/*/*.js')
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
}

const htmlHandler=function(){
    return gulp
    .src('./src/html/*.html')
    .pipe(include({
        prefix:"@-@",
        basepath:'./src/components'
    }))
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true, //删除注释
        collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,  //压缩页面JS
        minifyCSS: true  //压缩页面CSS
    }))
    .pipe(gulp.dest('./dist/html'))
}

const imgHandler=function(){
    return gulp
    .src('./src/images/**')
    .pipe(gulp.dest('./dist/images'))
}

const delHandler=function(){
    return del(['./dist'])
}

const webHandler=function(){
    return gulp
    .src('./dist')
    .pipe(webserver({
        host:'localhost',
        port:'8080',
        livereload:true,  
        open:'./html/index.html',
        proxies:[]
    }))
}

const watchHandler=function(){
    gulp.watch('./src/less/*.less',cssHandler),
    gulp.watch('./src/js/*.js',jsHandler),
    gulp.watch('./src/html/*.html',htmlHandler),
    gulp.watch('./src/components/*.html',htmlHandler)
}
module.exports.default=gulp.series(
    delHandler,
    gulp.parallel(cssHandler,jsHandler,htmlHandler,imgHandler),
    webHandler,
    watchHandler
)