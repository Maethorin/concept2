module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            componentes: {
                src: [
                    "app/static/js/bower_components/moment/moment.js",
                    "app/static/js/bower_components/moment/locale/pt-br.js",
                    "app/static/js/bower_components/lodash/dist/lodash.js",
                    "app/static/js/bower_components/angular/angular.js",
                    "app/static/js/bower_components/angular-ui-mask/dist/mask.js",
                    "app/static/js/bower_components/angular-route/angular-route.js",
                    "app/static/js/bower_components/angular-resource/angular-resource.js",
                    "app/static/js/bower_components/angular-cookies/angular-cookies.js",
                    "app/static/js/bower_components/angular-simple-logger/dist/angular-simple-logger.js",
                    "app/static/js/bower_components/angular-google-maps/dist/angular-google-maps.js",
                    "app/static/js/bower_components/jquery/dist/jquery.js",
                    "app/static/js/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js"
                ],
                dest: 'app/static/js/componentes.js'
            },
            app: {
                src: [
                    "app/static/js/app/**/*.js"
                ],
                dest: 'app/static/js/app.js'
            }
        },
        uglify: {
            options: {},
            componentes: {
                files: {
                    'app/static/js/componentes.min.js': ['<%= concat.componentes.dest %>']
                }
            },
            app: {
                files: {
                    'app/static/js/app.min.js': ['<%= concat.app.dest %>']
                }
            }
        },
        compass: {
            app: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            scripts: {
                files: '<%= concat.app.src %>',
                tasks: ['concat:app', 'uglify:app']
            },
            css: {
                files: 'sass/**/*.scss',
                tasks: ['compass:app']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.registerTask('default', ['concat', 'uglify', 'watch', 'compass']);
    grunt.registerTask('heroku', ['concat:app', 'uglify:app', 'concat:componentes', 'uglify:componentes', 'compass:app']);
};
