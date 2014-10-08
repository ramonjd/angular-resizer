module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            server: {
                livereload : true,
                options: {
                    bases: ['app']
                }
            }
        },
        open: {
            all: {
                path: 'http://localhost:3000'
            }
        },
        watch: {
            html: {
                files: ['app/index.html'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['app/**/*.js'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: 'app/css/*.css',
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-open');

    grunt.registerTask('default', ['express', 'open', 'watch']);

};