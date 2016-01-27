var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ngHtml2Js = require('gulp-ng-html2js');
var mergeStream = require('merge-stream');
var build = 'demo/build';
require('gulp-release-it')(gulp);
var requireDir = require('require-dir');
requireDir('gulp',{recurse:true});

gulp.task('clean:build',function(){
	return gulp.src(build,{read:false}).pipe($.clean());
});

gulp.task('clean:dist',function(){
	return gulp.src('dist',{read:false}).pipe($.clean());
});

gulp.task('concat',['clean:build'],function(){
	var src = gulp.src(['src/_ngCheckbox.js','src/**/*.js','!src/**/*.spec.js']);
	var tpl = gulp.src('src/**/**.tpl.html')
			.pipe(ngHtml2Js({
				moduleName:'templates.ngCheckbox'
			}));

	return mergeStream(src,tpl)
			.pipe($.concat('ngCheckbox.js'))
			.pipe(gulp.dest(build));
});

gulp.task('copy:build',function(){
	var vendorCssStream = gulp.src([
		'node_modules/foundation-sites/dist/foundation.css',
		'node_modules/foundation-sites/dist/foundation-flex.css'
	]);
	vendorCssStream.pipe(gulp.dest('demo/css'));

	var vendorJSStream = gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/foundation-sites/dist/foundation.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-ui-router/release/angular-ui-router.min.js',
		'node_modules/lodash/index.js'
	]);
	return vendorJSStream.pipe(gulp.dest('demo/js'));
});

gulp.task('dist',['clean:dist'],function(){
	return gulp.src('demo/build/ngCheckbox.js')
		.pipe($.ngAnnotate())
		.pipe($.uglify())
		.pipe($.concat('ngCheckbox.min.js'))
		.pipe(gulp.dest('dist'));
});


gulp.task('watch',['concat'],function(){
	gulp.watch(['src/**/*.js','src/**/*.html'],['concat']);
});

gulp.task('default',['copy:build','watch'],function(){
	gulp.src(['demo'])
		.pipe($.webserver({
			livereload:true,
			port:8000,
			open:true
		}));
});