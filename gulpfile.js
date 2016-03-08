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
    imageop = require('gulp-image-optimization'),
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

//Images optimizer task
gulp.task('images', function(cb) {
    gulp.src(['src/img/**/*.png','src/img/**/*.jpg','src/img/**/*.gif','src/img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('./build/img')).on('end', cb).on('error', cb);
});

// Fonts task.
gulp.task('fonts', function() {
  return gulp.src(['src/fonts/*.ttf','src/fonts/*.woff','src/fonts/*.eot', 'src/fonts/*.woff2','src/fonts/*.svg','src/fonts/*.otf'])
    .pipe(gulp.dest('./build/fonts'));
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
  gulp.watch(['src/img/**/*.png','src/img/**/*.jpg','src/img/**/*.gif','src/img/**/*.jpeg'],[
    'images'
  ]);
  gulp.watch(['src/**/*.less'],[
    'styles'
  ]);
  gulp.watch(['src/fonts/**/*.{ttf,woff,woff2,eof,svg,otf}'],[
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