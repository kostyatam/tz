'use strict';
var angular = require('angular');
var app = angular.module('myApp');

app
    .directive('areaWithDraggables', areaWithDraggables)
    .directive('draggableStore', draggableStore)
    .directive('draggableItem', draggableItem);

function areaWithDraggables ($document) {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div ng-transclude></div>',
        transclude: true,
        scope: {
            onSuccess: '='
        },
        controller: ['$scope', function ($scope) {
            this.dragObject = null;
            this.success = $scope.onSuccess;
            this.getDragObject = getDragObject;
        }],
        link: function ($scope, $elem, $attrs, ctrl) {
            ctrl.area = $elem;
            $document.on('mousedown', function (e) {
                if (e.which != 1) {
                    return;
                };

                ctrl.dragObject = ctrl.getDragObject(e);
            });

            $document.on('mousemove', function (e) {
                var dragObject = ctrl.dragObject;

                if (!dragObject) return;
                if (!dragObject.isMoveEnough(e)) {
                    console.log('not enough')
                    return;
                }
                if (!dragObject.dragging) {
                    dragObject.startDrag();
                }

                dragObject.move(e);
            });

            $document.on('mouseup', function (e) {
                var dragObject = ctrl.dragObject;

                if (!dragObject) return;

                if (!dragObject.dragging) {
                    ctrl.dragObject = null;
                    return;
                }

                dragObject.hide();

                var store = getStore(e);

                if (!store || store.name === dragObject.from) {
                    dragObject.back();
                    ctrl.dragObject = null;
                    return;
                }

                ctrl.success(dragObject.from, store.name, dragObject.data.itemData);
                ctrl.dragObject = null;
            })
        }
    }
}

function draggableStore () {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div ng-transclude></div>',
        transclude: true,
        scope: {
            name: '='
        },
        require: '^areaWithDraggables',
        controller: function ($scope) {
            this.name = $scope.name;
        },
        link: function ($scope, $elem, $attrs, ctrl) {
            $elem
                .addClass('draggable-store')
                .data({
                    name: $scope.name
                });
        }
    }
}

function draggableItem () {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div ng-transclude></div>',
        transclude: true,
        scope: {
            itemData: '='
        },
        require: '^draggableStore',
        link: function ($scope, $elem, $attrs, ctrl) {
            var elem = $elem[0];
            var data = {
                data: $scope,
                from: ctrl.name,
                parent: elem.parentNode,
                position: elem.style.position,
                display: elem.style.display,
                left: elem.style.left,
                top: elem.style.top
            };
            $elem
                .addClass('draggable')
                .data(data)
        }
    }
}



function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}

function getStore (event) {
    var finded = document.elementFromPoint(event.clientX, event.clientY);
    if (!finded) {
        return;
    }
    while (finded != document.body && finded) {
        if (angular.element(finded).hasClass('draggable-store')) {
            return angular.element(finded).data();
        }
        finded = finded.parentNode;
    }
    return;
}

function getDragObject (e) {
    var target = e.target;
    var $elem;
    var data;

    while (target != this.area[0]) {
        $elem = angular.element(target);
        if ($elem.hasClass('draggable')) {
            data = $elem.data();
            break;
        }
        target = target.parentNode;
    };

    if (!data) return;

    var drag = angular.extend({},
        data, {
            elem: target,
            downX: e.pageX,
            downY: e.pageY,
            nextSibling: target.nextElementSibling,
            hide: function () {
                this.elem.style.display = 'none';
            },
            back: function () {
                var elem = this.elem;
                elem.style.display = this.display;
                elem.style.position = this.position;
                elem.style.left = this.left;
                elem.style.top = this.top;
                this.nextSibling ? this.parent.insertBefore(elem, this.nextSibling) : this.parent.appendChild(elem);
            },
            isMoveEnough: function (e) {
                var moveX = e.pageX - this.downX;
                var moveY = e.pageY - this.downY;
                if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
                    return false;
                }
                return true;
            },
            startDrag: function () {
                var elem = this.elem;
                var coords = getCoords(elem);

                elem.style.position = 'absolute';
                elem.style.zIndex = 1000;
                document.body.appendChild(elem);

                this.shiftX = this.downX - coords.left;
                this.shiftY = this.downY - coords.top;
                this.dragging = true;
            },
            move: function (e) {
                this.elem.style.left = e.pageX - this.shiftX + 'px';
                this.elem.style.top = e.pageY - this.shiftY + 'px';
            }
        });
    return drag;
}