const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');


const page = (target, src) => {
    const plugin = new ExtractTextPlugin(target);

    return {
        plugin,
        moduleLoader: {
            test: new RegExp(src + '\\.js$'),
            include: /pages/,
            loader: plugin.extract([], [])
        }
    }
};

const config = ({
    watch, keepalive,
    plugins = []
}) => {
    const cssETP = new ExtractTextPlugin('c.css');
    const pages = [
        ['index.html', 'index'],
        ['video/index.html', 'video'],
        ['photo/index.html', 'photo'],
        ['campaign/index.html', 'campaign'],
        ['price/index.html', 'price'],
        ['contacts/index.html', 'contacts'],
        ['bid-form/index.html', 'form']
    ].map(([target, src]) => page(target, src));
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
                ...pages.map(page => page.moduleLoader),
                {
                    test: /\.pug$/,
                    loader: 'pug'
                },
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015']
                    }
                }
            ]
        },
        resolve: {
            modulesDirectories: ['node_modules', 'src']
        },
        plugins: [
            cssETP,
            ...pages.map(page => page.plugin),
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
