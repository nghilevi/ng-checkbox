/*
  Modify if you wanna use grunt instead of gulp
  Also add this in package.json's devDependencies

  Notice that this build process for Grunt has not been completed yet!
  
  "grunt-contrib-concat": "~0.5.1",
  "grunt-contrib-connect": "~0.11.2",
  "grunt-contrib-watch": "~0.6.1",
  "grunt-html2js": "~0.3.5",
*/

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    html2js: {
      ngCheckbox: {
        src: ['src/**/*.tpl.html'],
        dest: 'build/ngCheckboxTemplate.js'
      },
    },
    concat: {
      build: {
        files: [
          {src: ['src/**/*.js','!src/**/*.spec.js'], dest: 'build/ngCheckboxJs.js'},
          {src: ['build/ngCheckboxTemplate.js','build/ngCheckboxJs.js',], dest: 'build/ngCheckbox.js'}
        ]
      },
    },
    connect: {
      server: {
        options: {
          port: 9000,
          keepalive:true,
          base: [
            'demo',
            'build',
            'node_modules'
          ]
        }
      }
    },
    watch: {
      tasks: ['jshint']
    }
  });


  //grunt.loadNpmTasks('grunt-contrib-jshint'); //TODO
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch'); //TODO
  

  //TODO grunt tasks

  grunt.registerTask('build',function(){
    var jobs=['html2js','concat'];
    return grunt.task.run(jobs);
  })
  
  grunt.registerTask('default', ['build','connect']);
};