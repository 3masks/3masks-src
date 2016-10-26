const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const config = ({
    watch, keepalive,
    plugins = []
}) => {
    const cssETP = new ExtractTextPlugin('c.css');
    const teachersETP = new ExtractTextPlugin('teachers.json');
    return {
        context: path.resolve(__dirname, '../src'),
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, '../docs'),
            publicPath: '/',
            filename: 'j.js'
        },
        module: {
            loaders: [
                {
                    test: /\.sass$/,
                    loader: cssETP.extract(
                        'style',
                        'css!postcss!sass'
                    )
                },
                {
                    test: /\.(png|jpg|jpeg|svg)$/,
                    loaders: [
                        'file?name=i/[hash:4].[ext]',
                        'image-webpack?bypassOnDebug'
                    ]
                },
                {
                    test: /fonts/,
                    loaders: [
                        'file?name=f/[hash:4].[ext]'
                    ]
                },
                {
                    test: /teachers\.js$/,
                    loader: teachersETP.extract(
                        'babel'
                    )
                },
                {
                    test: /\.pug$/,
                    loader: 'pug'
                }
            ]
        },
        resolve: {
            modulesDirectories: ['node_modules', 'src']
        },
        plugins: [
            cssETP,
            teachersETP,
            ...plugins
        ],
        postcss: [autoprefixer()],
        watch,
        keepalive
    };
}

module.exports = {
    main: config({
        watch: true,
        keepalive: true,
        plugins: [new webpack.NoErrorsPlugin()]
    }),
    production: config({
        plugins: [new webpack.optimize.UglifyJsPlugin()]
    })
};
