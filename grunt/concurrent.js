module.exports = {
    options: {
        logConcurrentOutput: true
    },
    dev: {
        tasks: [
            'watch',
            'webpack:main',
            'connect'
        ]
    }

};
