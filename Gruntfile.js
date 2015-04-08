require("xunit-file");

module.exports = function (grunt) {
  grunt.initConfig({
    express: {
      test: {
        options: {
          script: "app.js"
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-express-server");
  grunt.loadNpmTasks("grunt-simple-mocha");
  grunt.registerTask("default", ["express:test"]);
};