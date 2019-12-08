const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ROOT_DIR = path.resolve(process.cwd(), './');
const USE_HOTRELOAD = true;

module.exports = {
    mode: 'development',
    devtool: 'eval',
    plugins: [
        new ProgressBarPlugin({
            format: 'Build [:bar] :percent (:elapsed seconds)',
            clear: false,
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        USE_HOTRELOAD ? new webpack.HotModuleReplacementPlugin() : null
    ],
    devServer: {
        host: require('node-local-ip'),
        hot: USE_HOTRELOAD,
        open: 'Google Chrome',
        publicPath: '',
        contentBase: path.resolve(ROOT_DIR, 'public'),
        watchContentBase: USE_HOTRELOAD
    },
    entry: ['./_dev/index.js'],
    stats: {
        colors: true,
        reasons: false
    },
    target: 'web',
    output: {
        filename: 'scripts/[name].js',
        path: __dirname + '/dist',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.vue', '.js', '.ts'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader',
                options: {}
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: [
                                    '>0.25% in JP',
                                    'not ie <= 10',
                                    'not op_mini all'
                                ],
                                useBuiltIns: 'usage',
                                corejs: 3 
                            }
                        ]
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './_dev/sample.html',
            inject: true,
            hash: true,
            minify: {
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ]
}