'use strict';
var angular = require('angular');
var uiRouter = require('ui-router');

var myApp = angular.module('myApp', ['ui.router']);

require('./routes/router');
require('./directives');
require('./services');