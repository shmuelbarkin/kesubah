'use strict';

var gulp                   = require('gulp'),
    sass                   = require('gulp-sass'),
    autoprefixer           = require('gulp-autoprefixer'),
    cleanCSS               = require('gulp-clean-css'),
    pump                   = require('pump'),
    rigger                 = require('gulp-rigger'),
    imagemin               = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminSvgo           = require('gulp-imagemin').svgo,
    imageminPngquant       = require('imagemin-pngquant'),
    browserSync            = require('browser-sync').create(),
    watch                  = require('gulp-watch'),
    del                    = require('del'),
    concat                 = require('gulp-concat'),
    uglify                 = require('gulp-uglify-es').default;

var task = {};

var path = {
  build: {
    html: 'dist/',
    stylesheets: 'dist/assets/stylesheets/',
    img: 'dist/assets/images/',
    javascript: 'dist/assets/javascript/',
    fonts: 'dist/assets/fonts/',
    favicon: 'dist/assets/favicon',
    pdf: 'dist/assets/pdf/'
  },
  src: {
    html: 'src/*.html',
    stylesheets: 'src/assets/stylesheets/*.scss',
    img: 'src/assets/images/**/*.*',
    javascript: 'src/assets/javascript/**/*.js',
    fonts: 'src/assets/fonts/**/*.*',
    favicon: 'src/assets/favicon/*.*',
    pdf: 'src/assets/pdf/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    stylesheets: 'src/assets/stylesheets/**/*.scss',
    img: 'src/assets/images/**/*.*',
    javascript: 'src/assets/javascript/**/*.js',
    fonts: 'src/assets/fonts/**/*.*',
    favicon: 'src/assets/favicon/*.*',
    pdf: 'src/assets/pdf/*.*'
  }
};

gulp.task('clean', function() {
  return del.sync([path.build.img]);
});

// HTML
gulp.task('html:build', task.html = function () {
  gulp.src(path.src.html)
  .pipe(rigger())
  .pipe(gulp.dest(path.build.html))
  .pipe(browserSync.reload({
    stream: true
  }));
});

//Stylesheets
gulp.task('sass:build', function () {
  return gulp.src(path.src.stylesheets)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions', 'Safari >= 7',],
    cascade: false
  }))
  .pipe(cleanCSS({compatibility: 'ie10', inline: ['none']}))
  .pipe(gulp.dest(path.build.stylesheets))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('javascript:build', task.javascript = function () {
  gulp.src(path.src.javascript)
  //.pipe(uglify())
  .pipe(gulp.dest(path.build.javascript))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// FONTS
gulp.task('fonts:build', task.fonts = function () {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// PDF
gulp.task('pdf:build', task.pdf = function () {
  gulp.src(path.src.pdf)
  .pipe(gulp.dest(path.build.pdf))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Favicon
gulp.task('favicon:build', task.favicon = function () {
  gulp.src(path.src.favicon)
  .pipe(gulp.dest(path.build.favicon))
  .pipe(browserSync.reload({
    stream: true
  }));
});

//Images
gulp.task('img:build', ['clean'], task.img = function () {
  gulp.src(path.src.img)
  .pipe(imagemin([
    imageminJpegRecompress({
      loops:6,
      min: 85,
      max: 95,
      quality:'high'
    }),
    imageminSvgo(),
    imageminPngquant({quality: [0.9,1]})
  ]))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest(path.build.img));
});

// Server
gulp.task('server:build', function() {
  browserSync.init({
    port : 3200,
    server: {
      baseDir: "dist"
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    },
    open: true
  });
});


gulp.task('build', [
  'clean',
  'html:build',
  'sass:build',
  'server:build',
  'img:build',
  'javascript:build',
  'fonts:build',
  'favicon:build',
  'pdf:build'
]);

gulp.task('watch', function () {
  watch([path.watch.stylesheets], function (event, cb) {
    gulp.start('sass:build');
  });
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start('img:build');
  });
  watch([path.watch.javascript], function (event, cb) {
    gulp.start('javascript:build');
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts:build');
  });
  watch([path.watch.favicon], function (event, cb) {
    gulp.start('favicon:build');
  });
  watch([path.watch.pdf], function (event, cb) {
    gulp.start('pdf:build');
  });
});

gulp.task('default', ['build', 'watch']);
