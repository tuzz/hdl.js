/* jshint camelcase: false */
"use strict";

module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-browserify");

  grunt.initConfig({
    jshint: {
      all: [
        "Gruntfile.js",
        "lib/**/*.js",
        "spec/**/*.js"
      ],
      options: {
        jshintrc: true
      }
    },
    jasmine_node: {
      all: ["spec"],
      options: {
        useHelpers: true
      }
    },
    browserify: {
      build: {
        src: "lib/hdl.js",
        dest: "bin/hdl.js",
        options: {
          transform: ["brfs"]
        }
      }
    }
  });

  grunt.registerTask("default", ["jasmine_node", "jshint", "browserify"]);
};

