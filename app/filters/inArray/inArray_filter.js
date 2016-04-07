'use strict';

var angular = require('angular');
var app = angular.module('myApp');

app.filter('inArray', function() {
    return function (list, arrayFilter, element) {
        if (!arrayFilter.length) return list;
        return list.filter(function (listItem) {
            return arrayFilter.every(function (item) {
                return listItem[element].indexOf(item) !== -1;
            });
        });
    };
})