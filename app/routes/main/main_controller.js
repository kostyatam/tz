'use strict';
require('./main.scss');

var angular = require('angular');
var app = angular.module('myApp');
var utils = require('utils');

app.controller('MainController', mainController);

function mainController ($scope, itemsService) {
    var vm = this;
    vm.types = itemsService.types.map(function (type) {
        return {
            name: type,
            selected: false
        }
    });
    vm.flags = [];
    vm.search = {};
    vm.order = false;
    vm.info = {};

    vm.right = {
        name: 'right',
        items: itemsService.getItems().map(function (item) {
            item.id = utils.guid();
            return item;
        })
    };

    vm.left = {
        name: 'left',
        items: itemsService.getItems().map(function (item) {
            item.id = utils.guid();
            return item;
        })
    };
    vm.success = success;
    vm.selectItem = selectItem;
    vm.flagChange = onChange;

    function onChange (flag) {
        var flags = vm.flags;
        var index = flags.indexOf(flag);
        (index === -1) ? flags.push(flag) : flags.splice(index, 1);
    }

    function selectItem (name, index) {
        var store = getStoreByName(name)
        var item = getItemById(index, store.items);
        vm.info.selected = false;
        item.selected = true;
        vm.info = item;
    }

    function success (nameFrom, nameTo, data) {
        var id = data;
        var from = getStoreByName(nameFrom).items;
        var to = getStoreByName(nameTo).items;
        if (!from || !to) {
            return;
        }
        $scope.$apply(function () {
            var item = getItemById(id, from);
            var index = getIndexById(id, from);
            to.push(item);
            from.splice(index, 1);
        });
    }

    function getStoreByName (name) {
        return vm[name];
    }

    function getItemById (index, store) {
        for(var i = 0; i < store.length; i++) {
            if (store[i].id === index) return store[i];
        }
    }
    function getIndexById (index, store) {
        for(var i = 0; i < store.length; i++) {
            if (store[i].id === index) return i;
        }
    }
}