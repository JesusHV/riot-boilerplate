"use strict";

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('gulp-browserify');
const babelify = require('babelify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const del = require('del');
const riot = require('gulp-riot');
const concat = require('gulp-concat');

const LOWEST_BUILD_THRESHOLD = 90;

const threshold = (percent, socket) => {
  const str = 'Coverage is at: ' + percent + '%';

  if (percent >= LOWEST_BUILD_THRESHOLD) {
    console.log(str)
    gulp.start('build');
    socket.emit('build', '<span class="es-goodclass">was build</span>');

  } else {
    console.error(new Error(str));
    console.log('not building dist/');
    socket.emit('build', '<span class="es-badclass">was not build</span>');
  }
};

// Clean
gulp.task('clean', (cb) => {
  del(['server/src', 'dist']).then(() => {
    $.cache.clearAll(cb);
  });
});

// Run server
gulp.task('serve', () => {
  const instance = browserSync({
    notify: false,
    port: 9000,
    ui: {
      port: 9001,
    },
    server: {
      baseDir: ['server', 'node_modules', 'test'],
    },
  });

  instance.emitter.on('service:running', function() {
    instance.sockets.on('connection', function(socket) {
      socket.on('coverage', function (percent) {
        threshold(percent, socket);
      });
    });
  });

  gulp.watch([
    'test/**/*.js',
    'server/src/**/*.*',
    'server/index.html'
  ])
  .on('change', reload);
});

// Transpile tag files
gulp.task('transpile', () => {
  console.log('start transpiling');

  gulp.src('./src/**/**.tag')
  .pipe(riot({ 
      style: 'scss', 
  }))
  .pipe(browserify({
    debug: true,
    transform: [babelify],
  }))
  .pipe(concat('index.js'))
  .pipe(gulp.dest('./server/src'));
});

gulp.task('build', () => {
  gulp.src('server/src/index.js')
    .pipe($.uglify())
    .pipe($.rename('index.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.watch('./src/**/**.tag', ['transpile']);

// Start develop
gulp.task('default', ['clean'], () => {
  gulp.start(['transpile', 'serve']);
});
