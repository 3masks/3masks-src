module.exports = function (grunt) {
    require('load-grunt-config')(grunt);

    grunt.registerTask('default', [
        'clean',
        'concurrent:dev'
    ]);

    grunt.registerTask('build', [
        'clean',
        'webpack:production'
    ]);
};
