var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    htmlmin = require('gulp-htmlmin'),
    wrapper = require('gulp-wrapper'),
    browserify = require('browserify'),
    minifyCSS = require('gulp-minify-css'),
    source = require('vinyl-source-stream'),
	bundle = browserify('./src/app.js').bundle();

// Jade to html task.
gulp.task('jade', function(){
  return gulp.src(['src/**/*.jade', '!src/modules/**/*.jade'])
    .pipe(jade({pretty: true}).on('error', gutil.log))
    .pipe(gulp.dest('./build'));
});

// Jade to vue.js template.
gulp.task('jade2template', function(){
  return gulp.src('src/modules/**/*.jade')
    .pipe(jade({pretty: true}).on('error', gutil.log))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(wrapper({
       header: 'module.exports={template:\'',
       footer: '\'}'
    }))
    .pipe(rename({
      suffix: "-template",
      extname: ".js"
    }))
    .pipe(gulp.dest('./src/modules'));
});

// Style task.
gulp.task('styles', function() {
  return gulp.src('src/css/app.less')
    .pipe(less({compress: false}).on('error', gutil.log))
    .pipe(minifyCSS({keepBreaks: false}))
    .pipe(gulp.dest('./build/css/'));
});

// Fonts task.
gulp.task('fonts', function() {
  return gulp.src(['src/css/fonts/*.ttf','src/css/fonts/*.woff','src/css/fonts/*.eot'])
    .pipe(gulp.dest('./build/css/fonts'));
});

// JS task.
gulp.task('browserify', function() {
    return browserify('./src/app.js')
        .bundle().on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js'));
});

// Watch task.
gulp.task('watch', [], function() {
  gulp.watch(['src/**/*.less'],[
    'styles'
  ]);
  gulp.watch(['src/css/fonts/**/*.{ttf,woff,eof,svg}'],[
    'fonts'
  ]);
  gulp.watch(['src/**/*.js', 'build/modules/**/*.js'],[
    'browserify'
  ]);
  gulp.watch(['src/**/*.jade', '!src/modules/**/*.jade'],[
    'jade'
  ]);
  gulp.watch(['src/modules/**/*.jade'],[
    'jade2template'
  ]);
});

//Static server.
gulp.task('server', ['watch'], function() {
  require('./server');
});

// Use default task.
gulp.task('default', ['server']);