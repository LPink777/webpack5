const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BaseConfig = require('./webpack.config');
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

const analyzer = process.env.analyzer;

module.exports = merge(BaseConfig, {

    mode: 'production',

    optimization: {
        /** 开始最小化 */
        minimize: true,
        minimizer: [
            /** 压缩html */
            new HtmlMinimizerPlugin({
                test: /index\.html/i,
            }),
            // 压缩js
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    toplevel: true,
                    ie8: true,
                    safari10: true,
                    format: {
                        comments: false,
                    }
                },
            }),
            // 压缩css
            new CssMinimizerPlugin({
                exclude: /[\\/]node_modules[\\/]/,
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
                minify: CssMinimizerPlugin.cleanCssMinify,
            }),
        ],
        splitChunks: {
            /** 默认提取的分割的类型 选项： all、async、initial 默认：async */
            chunks: 'all',
            /** 最大提取字节， 单位 bytes */
            maxSize: 150000,
            /** 最小提取字节，如果模块的大小大于多少的话才需要提取 单位 bytes */
            minSize: 30000,
            maxAsyncSize: 50000,
            minChunks: 1,
            automaticNameDelimiter: '~',

            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'initial',
                    maxSize: 150000,
                    priority: -10,
                    /** 是否可以复用现有的模块 */
                    reuseExistingChunk: true,
                },
                common: {
                    chunks: 'initial',
                    name: "common",
                    /** 优先级 */
                    priority: -20,
                    minChunks: 2,
                    minSize: 0,
                },
                styles: {
                    name: 'styles',
                    type: "css/mini-extract",
                    test: /\.less$/,
                    priority: 20,
                    enforce: true,
                }
            }
        },
        runtimeChunk: {
            name: 'runtime',
        },
    },

    module: {
        rules: []
    },

    plugins: [

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),

        new CleanWebpackPlugin(),

        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets/other'), to: "static" },
            ],
        }),

        /** 提取公共css */
        new MiniCssExtractPlugin({
            filename: 'style/[name].[contenthash:8].css',
            chunkFilename: 'style/[id].[contenthash:8].css',
        }),

        /** 移除无用的内容 */
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
        }),

        /** 图片压缩 */
        new ImageMinimizerPlugin({
            test: /.(jpe?g|png|gif|tif|webp|svg|avif)$/i,
            include: path.resolve(__dirname, 'src'),
            minimizerOptions: {
                plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["mozjpeg", {
                        quality: 50,
                        progressive: false
                    }],
                    ["pngquant", {
                        quality: [0.6, 0.8],
                        optimizationLevel: 5
                    }],
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    [
                        "svgo",
                        {
                            plugins: extendDefaultPlugins([
                                {
                                    name: "removeViewBox",
                                    active: false,
                                },
                                {
                                    name: "addAttributesToSVGElement",
                                    params: {
                                        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                                    },
                                },
                            ]),
                        },
                    ],
                ],
            }
        }),

    ].concat(analyzer == 1 ? [
        new BundleAnalyzerPlugin({
            analyzerPort: 7777,
        })
    ] : [])

})
