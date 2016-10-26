module.exports = function (grunt) {
    require('load-grunt-config')(grunt);

    grunt.registerTask('default', [
        'clean',
        'concurrent:prebuild',
        'concurrent:dev'
    ]);

    grunt.registerTask('build', [
        'clean',
        'webpack:production',
        'pug'
    ]);
};
