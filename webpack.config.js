const path = require('path')
const HtmlWebpackPlgin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MinCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './dist')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlgin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlgin({
            filename: 'login.html',
            template: './src/login.html',
            chunks: ['login']
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CopyWebpackPlugin({
            patterns:[{
                from: path.resolve(__dirname, './src/img'),
                to: path.resolve(__dirname, './dist/img')
            }]
        }),
        new MinCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].chunk.css'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css/,
                use: [MinCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.ejs/,
                loader: "ejs-loader",
                options: {
                    esModule: false
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition:  {
                        maxSize: 8 * 1024
                    }
                },
                generator: {
                    filename: 'img/[name].[hash:6][ext]'
                }
            },
        ],
    },
    optimization:  {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin(),
            new CssMinimizerWebpackPlugin()
        ],
        splitChunks: {
            minSize: 30*1023,
            chunks: "all",
            name: 'common',
            cacheGroups: {
                jquery: {
                    name: 'jquery',
                    test: /jquery\.js/,
                    chunks: "all"
                }
            }
        }
    }
}