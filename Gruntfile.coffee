'use strict'

module.exports = (grunt) ->

  grunt.initConfig

    watch:
      test:
        files: 'src/**/*.coffee'
        tasks: 'test'

    coffee:
      compile:
        files:
          'moment-jalaali.js': 'src/moment-jalaali.coffee'

    uglify:
      min:
        files:
          'moment-jalaali-min.js': 'moment-jalaali.js'

    coffeelint:
      src: ['Gruntfile.coffee', 'src/**/*.coffee']

    shell:
      mocha:
        command: './node_modules/.bin/mocha' +
          ' -R spec' +
          ' -u bdd' +
          ' -c' +
          ' --check-leaks' +
          ' --compilers coffee:coffee-script' +
          ' src/test.coffee'
        options:
          stdout: yes
          stderr: yes

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-shell'

  grunt.registerTask 'default', [
    'test'
  ]

  grunt.registerTask 'build', [
    'coffeelint:src'
    'coffee:compile'
    'uglify:min'
  ]

  grunt.registerTask 'test', [
    'build'
    'shell:mocha'
  ]

  grunt.registerTask 'dev', [
    'test'
    'watch:test'
  ]
