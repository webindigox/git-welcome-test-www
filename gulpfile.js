const gulp = require('gulp'); 
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');  
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps'); 
const notify = require('gulp-notify'); 
const plumber = require('gulp-plumber'); 
const gcmq = require('gulp-group-css-media-queries'); 
const fileinclude = require('gulp-file-include'); 


gulp.task('html', function(callback) {
	return gulp.src('./src/html/*.html')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'HTML include',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( fileinclude({ prefix: '@@' }) )
		.pipe( gulp.dest('./src/') )
	callback();
});


gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/main.scss')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass({
			indentType: "tab",    // настройки для удобной читаемости кода
			indentWidth: 1,
			outputStyle: 'expanded'
		}))
		.pipe(gcmq()) 
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./src/css/') )
	callback();
});


gulp.task('watch', function() {
	watch(['./src/*.html', './src/css/**/*.css'], gulp.parallel( browserSync.reload ));
	watch('./src/scss/**/*.scss', gulp.parallel('scss'));

	// watch('./src/scss/**/*.scss', function(){
	// 	setTimeout( gulp.parallel('scss'), 1000 )
	// })
	watch('./src/html/**/*.html', gulp.parallel('html'))

});


gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./src/"
		}
	})
});


gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'html'));
