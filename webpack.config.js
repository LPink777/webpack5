const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");

const env = process.env.NODE_ENV !== "production";

const px2remLoader = path.resolve(__dirname, "loaders/px2rem-loader.js");

const cssLoader = [
    env
        ? "style-loader"
        : {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: "../../",
            },
        },
    {
        loader: "css-loader",
        options: {
            url: true,
            importLoaders: 1,
        },
    },
    {
        loader: px2remLoader,
        options: {
            remUnit: 75,
            remPrecision: 8,
            exclude: /antd\.css/,
        },
    },
    {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [["postcss-preset-env"]],
            },
        },
    },
];

module.exports = {
    entry: {
        app: "./src/index.js",
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[fullhash:8].js",
    },

    module: {
        /** 如果匹配到正则的话则不解析依赖项 require import */
        // noParse: /title.js/,
        rules: [
            {
                /** 只要匹配到其中的一个规则就结束匹配 */
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /[\\/]node_modules[\\/]/,
                        use: [
                            // 缓存其后loader结果
                            "cache-loader",
                            // 其后loader开启独立worker池
                            {
                                loader: "thread-loader",
                                options: {
                                    workers: 3,
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    /** 启动babel缓存 */
                                    cacheDirectory: true,
                                    presets: [
                                        [
                                            "@babel/preset-env",
                                            {
                                                useBuiltIns: "usage",
                                                corejs: "3",
                                                targets: {
                                                    ios: "9",
                                                    android: "4.4",
                                                },
                                            },
                                        ],
                                        "@babel/preset-react",
                                    ],
                                    plugins: [
                                        /** 适合开发工具类库，不污染全局环境 */
                                        // "@babel/plugin-transform-runtime",
                                        // {
                                        //     corejs: 3,
                                        //     /** 移除内联的babel helpers并自动引入babel-runtime/helpers */
                                        //     helpers: true,
                                        //     /** 是否开启generator函数转换成使用regenerator runtime来避免污染使用全局作用域 */
                                        //     regenerator: true
                                        // }
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ["cache-loader", ...cssLoader],
                        include: path.resolve(__dirname, "src"),
                    },
                    {
                        test: /\.less$/,
                        use: ["cache-loader", ...cssLoader, "less-loader"],
                        include: path.resolve(__dirname, "src"),
                    },
                    {
                        test: /\.(gif|png|svg|jpe?g)$/,
                        type: "asset",
                        include: path.resolve(__dirname, "src"),
                        generator: {
                            filename: "static/[hash:8][ext][query]",
                        },
                        /** 超过最大字节 自动区分resource ｜ source ｜ inline */
                        parser: {
                            dataUrlCondition: {
                                maxSize: 4*1024
                            }
                        }
                    },
                    {
                        test: /\.ico$/,
                        type: 'asset/inline'
                    },
                    {
                        test: /\.txt$/,
                        type: 'asset/source'
                    }
                ],
            }
        ],
    },

    plugins: [
        /** 进度条 */
        new WebpackBar(),

        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            minify: {
                /** 去空格 */
                collapseWhitespace: true,
                /** 去注释 */
                removeComments: true
            }
        }),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        extensions: [".js", ".jsx", "json"],
    },

    resolveLoader: {
        /** 配置loader别名 */
        // alias: {
        //     'px2rem-loader': px2remLoader,
        // },
        /** 先去找loaders文件夹， 再去node_modules里找 */
        // modules: ['loaders', 'node_modules']
    },

    /** 持久化缓存 */
    cache: {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack'),
        buildDependencies: {
            config: [__filename],
        },
    },

    target: "web",
};
