'use strict';

var angular = require('angular');
var faker = require('faker');
var app = angular.module('myApp');

app.service('itemsService', itemsService);

function itemsService () {
    this.getItems = getItems;

    function getItems (num) {
        var types = ['nature', 'shapes', 'summer', 'technology'];
        var items = [];
        for (var num = num || 100;num > 0; num--) {
            items.push({
                name: faker.name.findName(),
                flags: types.filter(function () {
                    return Math.random() > 0.5;
                })
            })
        }
        return items;
    }
}