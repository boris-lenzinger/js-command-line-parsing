module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		jasmine_node: {
			task_name: {
				options: {
					forceExit: true,
					coverage: {
						reportFile: 'coverage.json',
						relativize: true,
						thresholds: {
							statements: 0,
							branches: 0,
							lines: 0,
							functions: 0
						},
						watermarks: {
							statements: [50, 80],
							lines: [50, 80],
							functions: [50, 80],
							branches: [50, 80]
						},
						includeAllSources: true,
						reportDir: 'coverage',
						report: [
							'lcov',
							'text-summary'
						],
						collect: [
							'*coverage.json'
						],
						excludes: []
					},
					jasmine: {
						spec_dir: 'spec',
						spec_files: [
							'**/*[sS]pec.js'
						],
						reporters: {
							savePath: "reports",
							consolidateAll: true
						}
					}
				},
				src: ['src/lib-parsing.js']
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jasmine-node-coverage');

	// Default task(s).
	grunt.registerTask('default', ['uglify', 'jasmine_node']);

};
