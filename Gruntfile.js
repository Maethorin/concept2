module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      componentes: {
        src: [
          "bower_components/moment/moment.js",
          "bower_components/moment/locale/pt-br.js",
          "bower_components/lodash/dist/lodash.js",
          "bower_components/angular/angular.js",
          "bower_components/angular-ui-mask/dist/mask.js",
          "bower_components/angular-route/angular-route.js",
          "bower_components/angular-resource/angular-resource.js",
          "bower_components/angular-cookies/angular-cookies.js",
          "bower_components/angular-simple-logger/dist/angular-simple-logger.js",
          "bower_components/angular-recaptcha/release/angular-recaptcha.js",
          "bower_components/angular-google-maps/dist/angular-google-maps.js",
          "bower_components/ng-file-upload/ng-file-upload.js",
          "bower_components/jquery/dist/jquery.js",
          "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js"
        ],
        dest: 'app/static/js/componentes.js'
      },
      componentesAdmin: {
        src: [
          "bower_components/moment/moment.js",
          "bower_components/moment/locale/pt-br.js",
          "bower_components/lodash/dist/lodash.js",
          "bower_components/sweetalert/dist/sweetalert.min.js",
          "bower_components/jquery/dist/jquery.js",
          "bower_components/jquery-bridget/jquery.bridget.js",
          "bower_components/ev-emitter/ev-emitter.js",
          "bower_components/desandro-matches-selector/matches-selector.js",
          "bower_components/fizzy-ui-utils/utils.js",
          "bower_components/get-size/get-size.js",
          "bower_components/outlayer/item.js",
          "bower_components/outlayer/outlayer.js",
          "bower_components/masonry/dist/masonry.pkgd.js",
          "bower_components/imagesloaded/imagesloaded.js",
          "bower_components/bootstrap-sass/assets/javascripts/bootstrap.js",
          "bower_components/bootstrap-waitingfor/build/bootstrap-waitingfor.js",
          "bower_components/angular/angular.js",
          "bower_components/angular-route/angular-route.js",
          "bower_components/angular-resource/angular-resource.js",
          "bower_components/ng-file-upload/ng-file-upload.js",
          "bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js",
          "bower_components/angular-wysiwyg/dist/angular-wysiwyg.js",
          "bower_components/angular-masonry/angular-masonry.js",
          "bower_components/angular-sweetalert/SweetAlert.js",
          "bower_components/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.js",
          "bower_components/angular-input-masks/angular-input-masks-standalone.js"
        ],
        dest: 'app/static/admin/js/componentes-admin.js'
      },
      app: {
        src: [
          "app/static/js/common.js",
          "app/static/js/app/**/*.js"
        ],
        dest: 'app/static/js/app.js'
      },
      appAdmin: {
        src: [
          "app/static/js/common.js",
          "app/static/admin/js/app/**/*.js"
        ],
        dest: 'app/static/admin/js/app-admin.js'
      }
    },
    uglify: {
      options: {},
      componentes: {
        files: {
          'app/static/js/componentes.min.js': ['<%= concat.componentes.dest %>']
        }
      },
      componentesAdmin: {
        files: {
          'app/static/admin/js/componentes-admin.min.js': ['<%= concat.componentesAdmin.dest %>']
        }
      },
      app: {
        files: {
          'app/static/js/app.min.js': ['<%= concat.app.dest %>']
        }
      },
      appAdmin: {
        files: {
          'app/static/admin/js/app-admin.min.js': ['<%= concat.appAdmin.dest %>']
        }
      }
    },
    compass: {
      app: {
        options: {
          config: 'config.rb'
        }
      },
      appAdmin: {
        options: {
          config: 'config_admin.rb'
        }
      }
    },
    watch: {
      app: {
        files: '<%= concat.app.src %>',
        tasks: ['concat:app', 'uglify:app']
      },
      appAdmin: {
        files: '<%= concat.appAdmin.src %>',
        tasks: ['concat:appAdmin', 'uglify:appAdmin']
      },
      css: {
        files: 'sass/**/*.scss',
        tasks: ['compass:app']
      },
      cssAdmin: {
        files: 'sass-admin/**/*.scss',
        tasks: ['compass:appAdmin']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.registerTask('default', ['compass', 'concat', 'uglify', 'watch']);
  grunt.registerTask('admin', ['concat:appAdmin', 'uglify:appAdmin', 'concat:componentesAdmin', 'uglify:componentesAdmin', 'compass:appAdmin']);
  grunt.registerTask('heroku', ['concat:app', 'uglify:app', 'concat:componentes', 'uglify:componentes', 'compass:app', 'admin']);
};
