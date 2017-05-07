'use strict';

module.exports = function(grunt) {

	var config = {
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options:{
//				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
//				'<%= grunt.template.today("yyyy-mm-dd") %> */',
//				preserveComments: 'some'
			},
			dist: {
				options: {
					sourceMap: true,
					sourceMapName: 'maps/smart-picklist.map'
				},
				files: {
					'dist/smart-picklist.min.js': ['./dist/smart-picklist.js']
				}
			}
		},

		replace: {
			jquery : {
				src: ['dist/smart-picklist.js'],
				overwrite: true,
				replacements: [{
					from: 'var jQuery = require(\'jquery\');',
					to: ''
				}]
			}
		},

		browserify: {
			dist: {
				options: {
					external: ['jquery']
				},
				src: ['./app/scripts/**/*.js', '!./app/scripts/**/*.test.js'],
				dest: './dist/smart-picklist.js'
			}
		},

		less: {
			dist: {
				options: {
					//compress: true
				},
				files: {
					'dist/smart-picklist.css': 'app/vars/vars.less'
				}
			}
		},

		bump: {
			options: {
				files: ['bower.json', 'package.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: 35729
			},
			js: {
				files: ['./app/scripts/**/*.js'],
				tasks: ['browserify:dist', 'replace']
			},
			less: {
				files: ['app/vars/vars.less', 'app/styles/**/*.less'],
				tasks: 'less'
			}
		}

//		karma: {
//			all: require('./test/karma-config.js')
//		}
	};

	grunt.initConfig(config);

	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-text-replace");
	grunt.loadNpmTasks("grunt-bump");
	grunt.loadNpmTasks("grunt-contrib-watch");
	//grunt.loadNpmTasks("grunt-karma");

	grunt.registerTask('build', [
		'browserify:dist',
		'less',
		'replace',
		'uglify:dist'
	]);

	grunt.registerTask('serve', [
		'browserify:dist',
		'less',
		'replace',
		'watch'
	]);

//	grunt.registerTask('test', [
//		'browserify:dist',
//		'less',
//		'replace',
//		'karma:all'
//	]);

};
