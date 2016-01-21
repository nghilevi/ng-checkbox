var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ngHtml2Js = require('gulp-ng-html2js');

var build = 'demo/build';

gulp.task('clean-build',function(){
	return gulp.src(build,{read:false}).pipe($.clean());
});

gulp.task('html2js',['clean-build'],function(){
	return 	gulp.src('src/**/**.tpl.html')
				.pipe(ngHtml2Js({
					moduleName:'templates.ngCheckbox'
				}))
				.pipe(gulp.dest(build+'/tpl'));
});

gulp.task('concat:src',['html2js'],function(){
	return 	gulp.src(['src/**/*.js','!src/**/*.spec.js'])
				.pipe($.concat('ngCheckboxJs.js'))
				.pipe(gulp.dest(build));
});

gulp.task('concat:build',['concat:src'],function(){
	return 	gulp.src(build+'/**/*.js')
				.pipe($.concat('ngCheckbox.js'))
				.pipe(gulp.dest(build));
});

gulp.task('watch',['concat:build'],function(){
	gulp.watch('src/**/*.js',['concat:build']);
	gulp.watch('src/**/*.html',['concat:build']);
});

gulp.task('default',['watch'],function(){
	gulp.src(['demo','node_modules'])
		.pipe($.webserver({
			livereload:true,
			port:8000,
			open:true
		}));
});