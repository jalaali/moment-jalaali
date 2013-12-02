'use strict';

module.exports = function (grunt) {

  grunt.initConfig(
    { pkg: grunt.file.readJSON('package.json')

    , watch:
      { test:
        { files:  [ 'Gruntfile.js'
                  , 'test.js'
                  , 'moment-jalaali.js'
                  ]
        , tasks: 'test'
        , options:
          { atBegin: true
          }
        }
      }

    , uglify:
      { min:
        { files:
          { 'moment-jalaali-min.js': 'moment-jalaali.js'
          }
        }
      }

    , jshint:
      { options: '<%= pkg.jshintConfig %>'

      , grunt: { files: { src: 'Gruntfile.js' } }

      , test:
        { files: { src: 'test.js' }
        , options:
          { expr: true
          , globals:
            { describe: false
            , it: false
            }
          }
        }

      , source: { files: { src: 'moment-jalaali.js' } }
      }

    , shell:
      { mocha:
        { command: './node_modules/.bin/mocha'
                 + ' -R spec'
                 + ' -u bdd'
                 + ' -c'
                 + ' --check-leaks'
                 + ' test.js'
        , options:
          { stdout: true
          , stderr: true
          , failOnError: true
          }
        }
      }
    }
  )

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-shell')

  grunt.registerTask('default', [ 'test' ] )

  grunt.registerTask('build', [ 'jshint'
                              , 'uglify:min'
                              ]
  )

  grunt.registerTask('test',  [ 'build'
                              , 'shell:mocha'
                              ]
  )

  grunt.registerTask('dev', [ 'watch:test' ] )

}
