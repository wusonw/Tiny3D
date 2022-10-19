//import path from 'path'
//import  { CleanWebpackPlugin } from 'clean-webpack-plugin';
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    optimization: {
        minimize: false
    },
    mode: "development",
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        environment: {
            arrowFunction: false
        }
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader"
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
}
