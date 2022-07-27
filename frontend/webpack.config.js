const fs = require("fs");
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.join(ROOT_DIR, "src");
const OUTPUT_DIR = path.resolve(path.join(ROOT_DIR, "..", "static"));

console.log(`OUTPUT_DIR: ${OUTPUT_DIR}`);


module.exports = {
    entry: { main: path.resolve(SRC_DIR, "index.jsx") },
    output: {
        filename: "js/[name].js",
        path: OUTPUT_DIR,
        publicPath: "/static/"
    },
    optimization: { splitChunks: { name: "vendor" } },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|__test__)/,
                options: { presets: ["@babel/preset-env", "@babel/preset-react"]}
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true } },
                    { loader: "sass-loader", options: { implementation: require("sass") } },
                ],
            },
        ],
    },

    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    watchOptions: { poll: true, ignored: "/node_modules/" },
    devtool: 'inline-source-map',
    devServer: {
        static: OUTPUT_DIR,
        watchFiles: ['src/*', 'src/**/*', 'public/*', 'public/**/*'],
        liveReload: true,
        hot: true,
        port: 9000,
        historyApiFallback: true
    },

    resolve: { extensions: [".jsx", ".js"] },
    plugins: [
        {
            apply: (compiler) => {
                const localCfgPath = process.env.TODO_APP_CONFIG_PATH;
                try {
                    if (fs.existsSync(localCfgPath))
                        fs.copyFileSync(localCfgPath, path.resolve(path.join(ROOT_DIR, "config", "app.conf.local.js")));
                } catch (e) {}
            }
        },
        new CopyPlugin({
            patterns: [{
                from: "./img",
                to: path.join(OUTPUT_DIR, "img"),
                context: "public"
            }],
            options: {}
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_DIR, "public", "index.html"),
            filename: 'index.html',
            title: "Output Management",
            inject: "body"
        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].css",
            chunkFilename: "styles/[id].css"
        })
    ],
};
