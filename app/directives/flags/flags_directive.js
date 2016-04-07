'use strict';
var angular = require('angular');
var app = angular.module('myApp');

app
    .directive('displayFlags', flags);

function flags () {
    return {
        restrict: 'AE',
        replace: true,
        template: '<span ng-transclude></span>',
        transclude: true,
        scope: {
            flags: '&'
        },
        link: function ($scope, $elem) {
            var template = '';
            var flags = $scope.flags();
            if (!flags) return;
            flags.map(function (item) {
                template+= ['<span class="column__icon column__icon_', item,'"></span>'].join('');
            });
            $elem
                .append(template);
        }
    }
}