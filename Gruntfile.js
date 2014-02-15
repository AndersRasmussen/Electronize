module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [
					// copy  server files to build directory
					{expand: true, cwd: 'src/shared/', src: ['**'], dest: 'build/server/'}, // makes all src relative to cwd
					{expand: true, cwd: 'src/server/', src: ['**'], dest: 'build/server/'}, // makes all src relative to cwd
					{expand: true, cwd: 'src/test/', src: ['**'], dest: 'build/test/'}, // makes all src relative to cwd
					// copy  client files to build directory
					{expand: true, cwd: 'src/client/clientFiles/', src: ['**'], dest: 'build/client/'} // makes all src relative to cwd
					// {expand: true, flatten: true, src: ['src/client/**'], dest: 'build/client', filter: 'isFile'} # flattens results to a single level	
					// {src: ['path/**'], dest: 'dest/'} # includes files in path and its subdirs
				]
			}
		},
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			},
			dist: {
				src: ['src/shared/*.js','src/client/js/*.js'],
				dest: 'build/client/<%= pkg.name %>.min.js',
			},
		},
		mochaTest: {
			test: {
				options: {reporter: 'spec'},
				src: ['build/server/test/**/*Test.js']
			}
		},
		watch: {
			scripts: {
				files: ['src/**/*.js','src/**/*.html','src/**/*.css'],
				tasks: ['default']
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['Gruntfile.js', 'src/shared/**/*.js', 'src/server/**/*.js', 'src/client/js/**/*.js', 'test/**/*.js']
		}
	});

	//Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');

	//Default task(s).
	grunt.registerTask('default', ['copy', 'concat']);
	//other tasks
	grunt.registerTask('test', ['jshint','mochaTest']);
	grunt.registerTask('jslint', ['jshint']);
	//grunt.registerTask('watch', ['watch'])
};
