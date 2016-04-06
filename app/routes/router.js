'use strict';
require('./index');

var angular = require('angular');
var app = angular.module('myApp');

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('');
    $stateProvider
        .state('main', {
            url: '',
            template: require('./main/main.html'),
            controller: 'MainController',
            controllerAs: 'model'
        })
});