'use strict';

var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ['./app/app.js']
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ],
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "text"
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!sass')
        }, {
            test:   /\.(css|png|jpg|svg|ttf|eot|woff|woff2)$/,
            loader: 'file?name=[path][name].[ext]'
        }]
    }
};