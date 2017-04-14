// Requirements
var gulp = require('gulp');

	/* TASKS SUMMARY
		1- Init : plugins and config paths
        2- Generate : skeletons, templates & snippets
		3- Copy/Rename : static files to the output folder
		4- Control rules : Hint syntax validator
		5- Compile : less or sass files to css
		6- Optimize : Concat, Minify and bundle
        7- Inject : codes in files 
		8- Clean : remove files from the output and build folders
        9- Connect : on localhost
        10- Test : unit & e2e tests
		11- Watch : scan event files and rerun some tasks when update codes
		12- Register :  tasks sequences
	*/


    /*----------------------------------------------
                INIT 
    -----------------------------------------------*/

// Requirements from package.json
var plugins = require('gulp-load-plugins')(); 
var bowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');
var del = require('del');
// load config
var app_config = require('./config.json');

// UTILS FUNCTIONS
function handleError(err) {
	console.log(err.toString());
	this.emit('end');
} 

// Clean build folder function:
function cleanBuildFn() {
    return del.sync(app_config.paths.build);
}

function cleanReleaseFn() {
    return del.sync(app_config.paths.release);
}

    /*----------------------------------------------
                GENERATE 
    -----------------------------------------------*/
    // TODO


		/*----------------------------------------------
		        COPY / RENAME
		 -----------------------------------------------*/

// COPY CSS
gulp.task('copy-css', function () {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.css',
		app_config.paths.app + '/styles/' + app_config.theme + '/**/*.css'
	])
    .pipe(gulp.dest(app_config.paths.release + '/styles'));
});


// COPY JS
gulp.task('copy-js', function () {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.js',
		app_config.paths.app + '/scripts/**/*.js',
		app_config.paths.app + '/app.js'
	])
    .pipe(gulp.dest(app_config.paths.release + '/scripts'));
});
 
// COPY CSS TO BUILD
gulp.task('copy-css-to-build', function () {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.css',
		app_config.paths.app + '/styles/' + app_config.theme + '**/*.css',
		'!' + app_config.paths.app + '/styles/' + app_config.theme + '/**/bootstrap.css'
	])
    .pipe(gulp.dest(app_config.paths.build + '/styles'));
});

// COPY JS TO BUILD
gulp.task('copy-js-to-build', function () {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.js',
		app_config.paths.app + '/scripts/**/*.js',
		app_config.paths.app + '/app.js'
	])
    .pipe(gulp.dest(app_config.paths.build + '/scripts'));
});

// COPY HTML
gulp.task('copy-html', function () {
	return gulp.src(app_config.paths.app + '/**/*.html')
    .pipe(gulp.dest(app_config.paths.release));
});


// COPY LOCALIZATION
gulp.task('copy-localization', function () {
	return gulp.src([
		app_config.paths.app + '/localization/**/*',
		app_config.paths.root + '/bower_components/angular-i18n/angular-local_*.js'
	])
    .pipe(gulp.dest(app_config.paths.release + '/localization'));
});

// COPY FONTS
gulp.task('copy-fonts', function () {
	return gulp.src([
		app_config.paths.app + '/fonts/**/*',
		// app_config.paths.root + '/bower_components/font-awesome/fonts/**/*',
		app_config.paths.root + '/bower_components/bootstrap/fonts/**/*'
	])
    .pipe(gulp.dest(app_config.paths.release + '/fonts'));
});


// COPY IMAGES
gulp.task('copy-images', function () {
	return gulp.src([
		// app_config.paths.app + '/images/**/*',
		app_config.paths.app + '/**/*.{jpg, jpeg,gif,svg,png,ico}'
	])
    .pipe(gulp.dest(app_config.paths.release));
});


// COPY LIB
gulp.task('copy-lib', function () {
	return gulp.src('bower_components/**/*')
    .pipe(gulp.dest(app_config.paths.release + '/bower_components'));
});

		/*----------------------------------------------
		        CONTROL RULES
		 -----------------------------------------------*/

// TODO


		/*----------------------------------------------
                COMPILE
		 -----------------------------------------------*/

// SASS
gulp.task('sass', ['copy-css-to-build'], function() {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.scss',
		app_config.paths.app + '/styles/' + app_config.theme + '/**/*.scss', 
		app_config.paths.app + '/styles/base.scss'])
	.pipe(plugins.sass())
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest(app_config.paths.build + '/styles'));
  
});

// LESS
gulp.task('less', ['copy-css-to-build'], function() {
	return gulp.src([
		app_config.paths.app + '/modules/**/*.less',
		app_config.paths.app + '/styles/' + app_config.theme + '/**/app.less'
	])
	.pipe(plugins.less())
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest(app_config.paths.build + '/styles'));
  
});



		/*----------------------------------------------
		        OPTIMIZE
		 -----------------------------------------------*/


// MINIFY CSS
gulp.task('minify-css', function() {
	var opts = {advanced: false,comments:true,spare:true};
	return gulp.src([
		app_config.paths.build + '/styles/**/*.css',
		app_config.paths.build + '/styles/base.css'
	])
    .pipe(plugins.minifyCss(opts))
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	.pipe(plugins.concat('app.css'))
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	.pipe(plugins.rename({suffix: '.min'}))
	.pipe(gulp.dest(app_config.paths.release + '/styles'));
});



// MINIFY JS
gulp.task('minify-js', function() {
	/*
	var opts = {
    	// inSourceMap:
       // outSourceMap: "app.js.map"
    };
	*/
	return gulp.src([
		app_config.paths.build + '/scripts/**/*.js',
		app_config.paths.build + '/scripts/*.js'
	])
    .pipe(plugins.uglify())
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	.pipe(plugins.concat('app.js'))
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError)
	.pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(app_config.paths.release + '/scripts'));
});


		/*----------------------------------------------
		        INJECT
		 -----------------------------------------------*/

// Tâche "inject" = Injection JS et CSS (app -> release)
gulp.task('inject', function(){
    return gulp.src(app_config.paths.app + '/index.html')
        
		// vendors			
		.pipe(plugins.inject(
			gulp.src(bowerFiles(), 
				{read: false}), {name: 'bower'}))
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release))
		
		// main css
        .pipe(plugins.inject(
            gulp.src(app_config.paths.release + "/styles/app.min.css",
				{read: false}), {relative: true}))
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release))
		
		// main js
		.pipe(plugins.inject(
            gulp.src(app_config.paths.release + "/scripts/app.min.js",
                {read: false}), {relative: true}))
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release));
 });
 
gulp.task('inject-dev', function(){
    return gulp.src(app_config.paths.app + '/index.html')
	
		// vendors			
		.pipe(plugins.inject(
			gulp.src(bowerFiles(), 
				{read: false}), {name: 'bower'}))
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release))
	
		// all js
        .pipe(plugins.inject(
            gulp.src([
					app_config.paths.release + '/scripts/**/*.js',
					app_config.paths.release + '/scripts/app.js'
					],
					{read: false}), {relative: true}
				)
			)
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release))
		
		// all css
        .pipe(plugins.inject(
            gulp.src([
					app_config.paths.release + '/styles/**/*.css',
					app_config.paths.release + '/styles/app.css'
					],
					{read: false}), {relative: true}
				)
			)
		.on('error', plugins.notify.onError("Error: <%= error.message %>"))
		.on('error', handleError)
        .pipe(gulp.dest(app_config.paths.release));
 }); 
 


		/*----------------------------------------------
		            CLEAN
		  -----------------------------------------------*/



gulp.task('clean:build', cleanBuildFn);
gulp.task('clean:release', cleanReleaseFn);


	/*----------------------------------------------
	            CONNECT
	 -----------------------------------------------*/

gulp.task('connect', function () {
	return plugins.connect.server({
		root: app_config.paths.release + '/',
		port: app_config.environments[app_config.environments.default].port,
		host: app_config.environments[app_config.environments.default].host,
		fallback: app_config.paths.release + '/index.html',
      	livereload: true
	});
});

gulp.task('reload', function () {
	return plugins.connect.reload();
});




	/*----------------------------------------------
	                TEST
	 -----------------------------------------------*/
	 // TODO

		/*----------------------------------------------
		                WATCH
		  -----------------------------------------------*/

gulp.task('watch', function () {  
	gulp.watch([app_config.paths.app + '/**/*.less', app_config.paths.app + '/**/*.css',app_config.paths.app + '/**/*.js', app_config.paths.app + '/**/*.html', app_config.paths.app + '/**/*.json' ], ['update']).on('change', function(event) {
		plugins.util.log('File ' + event.path + ' was ' + event.type);
	})
	.on('error', plugins.notify.onError("Error: <%= error.message %>"))
	.on('error', handleError);
});


	/*----------------------------------------------
	            REGISTER
	 -----------------------------------------------*/


gulp.task('dev', 
    ['less', 'copy-css', 'copy-js', 'copy-html', 'copy-fonts', 'copy-images', 'copy-lib', 'inject-dev', 'connect', 'watch']
  );


gulp.task('prod',['clean:build', 'clean:release'],  function() {
    return runSequence( ['copy-js-to-build', 'less'], ['minify-js', 'minify-css'], ['copy-html', 'copy-localization', 'copy-images', 'copy-fonts', 'copy-lib'], 'inject', 'connect', 'watch', function() {
		
    });
});

gulp.task('update',['clean:build', 'clean:release'],  function() {
    return runSequence( ['copy-js-to-build', 'less'], ['minify-js', 'minify-css'], ['copy-html', 'copy-localization', 'copy-images', 'copy-fonts', 'copy-lib'], 'inject', 'reload', function() {
		
    });
});



// Default task
gulp.task('default', ['prod']);