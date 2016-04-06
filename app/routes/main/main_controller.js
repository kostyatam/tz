'use strict';
require('./main.scss');

var angular = require('angular');
var app = angular.module('myApp');

app.controller('MainController', mainController);

function mainController ($scope, itemsService) {
    var vm = this;
    vm.stores = [{
        name: 'left',
        items: itemsService.getItems(5),
        filter: {
            name: ''
        },
        order: '',
        showInput: true
    },{
        name: 'right',
        items: itemsService.getItems(7),
        filter: [],
    }];
    vm.success = success;
    vm.selectItem = selectItem;
    vm.info = {};
    vm.search = {};

    function selectItem (name, index) {
        var item = getStoreByName(name).items[index];
        item.selected = true;
        vm.info.selected = false;
        vm.info = item;
    }

    function success (nameFrom, nameTo, data) {
        var index = data;
        var from = getStoreByName(nameFrom).items;
        var to = getStoreByName(nameTo).items;
        if (!from || !to) {
            return;
        }
        $scope.$apply(function () {
            to.push(from[index]);
            from.splice(index, 1);
        });
    }

    function getStoreByName (name) {
        for (var i=0; i < vm.stores.length; i++) {
            if (vm.stores[i].name === name) {
                return vm.stores[i];
            }
        }
    }
}