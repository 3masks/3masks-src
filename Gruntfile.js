module.exports = function (grunt) {
    require('load-grunt-config')(grunt);

    grunt.registerTask('default', [
        'clean',
        'webpack:main'
    ]);

    grunt.registerTask('build', [
        'clean',
        'webpack:production'
    ]);
};
