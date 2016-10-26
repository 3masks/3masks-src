module.exports = {
    options: {
        livereload: true,
    },
    html: {
        files: ['src/pug/**/*.pug', 'docs/*.json'],
        tasks: 'pug'
    },
    css: {
        files: 'docs/**/*.css'
    }
};
