"use strict";

module.exports = function( grunt ) {

	// Useful for showing time taken for Grunt tasks
	require("time-grunt")(grunt);

	// Automatically load libraries for Grunt tasks
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({

		clean: {
			dist: [ "dist" ]
		},

		copy: {
			dist: {
				files: [{
					src: [
						"fonts/**",
						"images/**",
						"favicon.ico"
					],
					dest: "dist/",
					cwd: "app/",
					expand: true
				}]
			}
		},

		compass: {
			dev: {
				options: {
					basePath: "app",
					sassDir: "styles",
					cssDir: "styles",
					environment: "development",
					imagesDir: "images",
					outputStyle: "expanded",
					noLineComments: true,
					relativeAssets: true,
					force: true
				}
			},
			dist: {
				options: {
					sassDir: "app/styles",
					cssDir: "dist/styles",
					environment: "production",
					imagesDir: "dist/images",
					outputStyle: "compressed",
					noLineComments: true,
					relativeAssets: true,
					force: true
				}
			}
		},
		
		coffee: {
			dev: {
				options: {
					bare: true,
					sourceMap: true
				},
				expand: true,
				cwd: "app/coffee/",
				src: [ "**/**.coffee" ],
				dest: "app/scripts/",
				ext: ".js"
			}
		},
		coffeelint: {
			app: {
				files: {
					src: [ "app/coffee/**/*.coffee" ]
				},
				options: {
					"max_line_length": {
						"level": "ignore"
					}
				}
			}
	    },
		
		requirejs: {
			dev: {
				options: {
					baseUrl: "app/scripts",
					out: "dist/scripts/main.js",
					optimize : "uglify",
					inlineText: true,
					preserveLicenseComments: false,
					include: "vendor/requirejs/require",
					name: "main",
					mainConfigFile: "app/scripts/main.js"
				}
			}
		},

		concat: {
			options: {
				stripBanners: true,
				banner: "/*\n* personal-canvas-asteroids\n" + 
					"*/\n\n"
			},
			home: {
				src: [ "dist/scripts/main.js" ],
				dest: "dist/scripts/main.js"
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: "app/images",
					src: "**/*.{png,jpg,jpeg}",
					dest: "dist/images"
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: false
				},
				files: [{
					"dist/index.html": "dist/index.html"
				}]
			}
		},

		watch: {
			compass: {
				files: [ "app/styles/**/*.{scss,sass}" ],
				tasks: "compass:dev",
				options: {
					debounceDelay: 200
				}
			},
			coffee: {
				files: [ "app/**/*.coffee" ],
				tasks: "coffee:dev",
				options: {
					debounceDelay: 200
				}
			}
			
		},

		targethtml: {
			dist: {
				files: [{
					"dist/index.html": "app/index.html"
				}]
			}
		},

		rsync: {
			development: {
				options: {
					src: "dist/",
					dest: "/srv/www/your-site-path",
					host: "soap@0.0.0.0",
					recursive: true,
					syncDest: true
				}
			}
		}

	} );

	// Build
	grunt.registerTask( "build", [ 
		"clean:dist", 
		"copy:dist", 
		"compass:dist", 
		"coffee:dev",
		"requirejs",
		"concat",
		"targethtml:dist",
		"htmlmin:dist"
	]);

	// Run compass, and start watch
	grunt.registerTask( "start", [ 
		"compass:dev",
		"coffee",
		"watch" 
	]); 

	// Build and deploy files to Soap development server
	grunt.registerTask( "deploy", [ 
		"build",
		"rsync:development"
	]);

	grunt.registerTask( "default", [ "build" ] );

};