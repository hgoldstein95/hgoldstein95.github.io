var gulp        = require('gulp');

var browserSync = require('browser-sync').create();
var sass        = require('gulp-ruby-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');
var plumber     = require('gulp-plumber');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function (done) {
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'jade', 'jekyll-build'], function() {
    browserSync.init({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
});

gulp.task('sass', function () {
    return sass('assets/css/main.scss')
        .on('error', sass.logError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('assets/css'))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('jade', function(){
  return gulp.src('_jadefiles/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('_includes'));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload browserSync
 */
gulp.task('watch', function () {
    gulp.watch(['assets/css/**/*.scss', 'assets/css/**/*.sass'], ['sass']);
    gulp.watch('assets/js/**', ['jekyll-rebuild']);
    gulp.watch(['index.html', '_layouts/*.html', '_includes/*'], ['jekyll-rebuild']);
    gulp.watch('_jadefiles/**', ['jade']);
});




/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
