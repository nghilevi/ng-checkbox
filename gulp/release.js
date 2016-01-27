/**
 * Created by Le on 1/26/2016.
 */
    // This task does not function atm, just ignore it
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var git = require('gulp-git');

var release_branch = 'master';

gulp.task('bump', ['dist'],function () {
    return gulp.src(['package.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});

gulp.task('tag',['bump'], function () {
    var pkg = require('../package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;

    return gulp.src('./')
        .pipe(git.commit(message))
        .pipe(git.tag(v, message))
        .pipe(git.push('origin', release_branch, '--tags'))
        .pipe(gulp.dest('./'));
});


/*
gulp.task('release',['tag'], function (done) {
    require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
});*/
