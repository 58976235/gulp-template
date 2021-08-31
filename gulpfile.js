const gulp = require('gulp')
const gulpLess = require('gulp-less');
const autoprefixer=require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const uglify=require('gulp-uglify')
const babel=require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const del=require('del')
const webserver =require('gulp-webserver')
const pxtorem = require('gulp-pxtorem');
const rename = require('gulp-rename'); 
const htmltpl = require('gulp-html-tpl')
const artTemplate = require('art-template')
const resolvePath = require("gulp-resolve-path");
const through = require('through2')
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

const lessHandler=function(){
    return gulp
    .src(['./src/public/less/*.less','./src/pages/**/*.less','./src/components/**/*.less'])
    .pipe(resolvePath(options))
    .pipe(through.obj(function (chunk, enc, cb) {
        let contents=chunk.contents.toString()
        let newContents=contents.replace(/\/src\/static/g,'../')
        chunk.contents=Buffer.from(newContents)
        /* let fileName=chunk.relative.split('/')[0]
        let contents=chunk.contents.toString()
        let newContents=contents.replace('/src/pages/'+fileName+'/'+fileName+'.less','./css/'+fileName+'.css')
        newContents=newContents.replace(/\/src\/public\/js/g,'./js')
        newContents=newContents.replace('/src/pages/'+fileName+'/'+fileName+'.js','./js/'+fileName+'.js')
        newContents=newContents.replace(/\/src\/static/g,'.')
        chunk.contents=Buffer.from(newContents) */
        cb(null,chunk)
      }))
    .pipe(gulpLess({
        javascriptEnabled: true
    }))
    .pipe(autoprefixer())
    .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(cssmin())
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest('./m/css'))
}

const cssHandler=function(){
    return gulp
        .src('./src/static/css/*.css')
        .pipe(cssmin())
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest('./m/css'))
}

const jsHandler=function(){
    return gulp
    .src(['./src/public/js/*.js','./src/pages/**/*.js'])
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest('./m/js'))
}

const htmlHandler=function(){
    return gulp
    .src('./src/pages/**/*.html')
    .pipe(resolvePath(options))
    .pipe(through.obj(function (chunk, enc, cb) {
        let fileName=chunk.relative.split('/')[0]
        let contents=chunk.contents.toString()
        let newContents=contents.replace('/src/pages/'+fileName+'/'+fileName+'.less','./css/'+fileName+'.css')
        newContents=newContents.replace(/\/src\/public\/js/g,'./js')
        newContents=newContents.replace('/src/pages/'+fileName+'/'+fileName+'.js','./js/'+fileName+'.js')
        newContents=newContents.replace(/\/src\/static/g,'.')
        chunk.contents=Buffer.from(newContents)
        cb(null,chunk)
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
    .pipe(htmltpl({
        tag:'template',
        paths:['./src/components'],
        engine:function(template,data){
            return template && artTemplate.compile(template)(data)
        },
        data:{
            header:false,
            footer:false
        }
    }))
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest('./m'))
}

const imgHandler=function(){
    return gulp
    .src('./src/static/images/**')
    .pipe(gulp.dest('./m/images'))
}

const fontHandler=function(){
    return gulp
    .src('./src/static/font/**')
    .pipe(gulp.dest('./m/font'))
}

const delHandler=function(){
    return del(['./m'])
}

const webHandler=function(){
    return gulp
    .src('./m')
    .pipe(webserver({
        host:'localhost',
        port:'8080',
        livereload:true,  
        open:'./index.html',
        proxies:[]
    }))
}

const watchHandler=function(){
    gulp.watch('./src/public/less/*.less',lessHandler),
    gulp.watch('./src/pages/**/*.less',lessHandler),
    gulp.watch('./src/components/**/*.less',lessHandler),
    gulp.watch('./src/static/css/*.css',cssHandler),
    gulp.watch('./src/public/js/*.js',jsHandler),
    gulp.watch('./src/pages/**/*.js',jsHandler),
    gulp.watch('./src/pages/**/*.html',htmlHandler),
    gulp.watch('./src/components/**/*.html',htmlHandler)
}
module.exports.default=gulp.series(
    delHandler,
    gulp.parallel(lessHandler,jsHandler,htmlHandler,imgHandler,fontHandler,cssHandler),
    webHandler,
    watchHandler
)