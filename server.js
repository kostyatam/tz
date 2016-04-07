var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var open = require('open');

var config = require("./webpack.config.js");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var server = new WebpackDevServer(webpack(config));

server.listen(8080);
open("http://localhost:8080");

