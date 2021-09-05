const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const BaseConfig = require("./webpack.config");

module.exports = merge(BaseConfig, {
    mode: "development",

    devtool: "eval-cheap-module-source-map",

    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        port: 8000,
        compress: true,
        open: true,
        historyApiFallback: true,
        hotOnly: true,
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),

        new ESLintPlugin({
            fix: true,
            extensions: ["js", "jsx"],
        }),

    ],
});
