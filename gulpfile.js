const gulp = require('gulp'); // gulp

const pug = require('pug'); // pug
const gulpPug = require('gulp-pug'); // gulp-pug
const htmlminify = require("gulp-html-minify"); // html压缩

const sass = require('gulp-sass'); // sass
const prefixer = require('gulp-autoprefixer'); // 自动增加厂商前缀
const cssUglify = require('gulp-minify-css'); // css压缩

const sourcemaps = require('gulp-sourcemaps'); // js文件解压缩
const babel = require('gulp-babel'); // es6转换
const concat = require('gulp-concat'); // 压缩js文件为1个
const uglify = require('gulp-uglify'); // js压缩

const smushit = require('gulp-smushit'); // 图片压缩
const browserSync = require('browser-sync').create(); // 自动刷新

const fileinclude  = require('gulp-file-include'); // 引入公共文件


gulp.task('pug', function(){
  return gulp.src('./src/*.pug')
    .pipe(gulpPug({
      pug: pug,
      pretty: true
    }))
    .pipe(htmlminify())
    .pipe(gulp.dest('dist/'))
});

gulp.task('sass', function(){
  return gulp.src("./src/css/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(cssUglify())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task('img', function(){
	return gulp.src('src/img/*')
    .pipe(smushit({
      verbose: true
    }))
  	.pipe(gulp.dest('dist/img'))
});

gulp.task('es6', () => {
	return gulp.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
    .pipe(uglify({ mangle: false }))
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fileinclude', function() {
  gulp.src('src/**.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('dist'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'pug', 'es6', 'img'] , function(){
  browserSync.init({
    server: "./dist"
  });
  gulp.watch("./src/css/*.scss", ['sass']);
  gulp.watch("./src/img/*", ['img']).on('change', browserSync.reload);
  gulp.watch("./src/js/*.js", ['es6']).on('change', browserSync.reload);
  gulp.watch("./src/*.pug", ['pug']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
