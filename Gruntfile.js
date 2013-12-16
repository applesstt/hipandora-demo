module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    template: {
      dev: {
        engine: 'jade',
        cwd: 'views/',
        partials: ['views/*.jade'],
        data: '',
        //data: 'test/fixtures/data/data.json',
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,     // Enable dynamic expansion.
            cwd: 'views/',      // Src matches are relative to this path.
            src: '*.jade', // Actual pattern(s) to match.
            dest: 'demo/',   // Destination path prefix.
            ext: '.html'  // Dest filepaths will have this extension.
          }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-template-html');

  // Default task(s).
  grunt.registerTask('default', ['template']);

};