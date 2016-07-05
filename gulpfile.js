const gulp = require('gulp');

const jade = require('jade'); // jade
const gulpJade = require('gulp-jade'); // gulp-jade

const sass = require('gulp-sass'); // sass
const prefixer = require('gulp-autoprefixer'); // 代码不压缩

const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel'); // es6转换
const concat = require('gulp-concat'); // 压缩js文件为1个

const imagemin = require('gulp-imagemin'); // 图片压缩
const browserSync = require('browser-sync').create(); // 自动刷新

gulp.task('jade', () => {
  return gulp.src('./src/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('sass', () => {
  return gulp.src("./src/css/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

gulp.task('img', () => {
	return gulp.src('src/img/*')
    .pipe(imagemin())
  	.pipe(gulp.dest('dist/img'))
});

gulp.task('es6', () => {
	return gulp.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'jade', 'es6', 'img'] , () => {
  browserSync.init({
    server: "./dist"
  });
  gulp.watch("./src/css/*.scss", ['sass']);
  gulp.watch("./src/img/*", ['img']).on('change', browserSync.reload);
  gulp.watch("./src/js/*.js", ['es6']).on('change', browserSync.reload);
  gulp.watch("./src/*.jade", ['jade']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
