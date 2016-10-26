module.exports = {
    options: {
        logConcurrentOutput: true
    },
    prebuild: {
        tasks: [
            'pug',
            'sass'
        ]
    },
    dev: {
        tasks: [
            'watch',
            'webpack:main',
            'connect'
        ]
    }

};
