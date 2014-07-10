'use strict';

angular.module('ngLocalizedStarterApp.filters', [])

    .filter('reverse', function () {
        function toArray(list) {
            var k, out = [];
            if (list) {
                if (angular.isArray(list)) {
                    out = list;
                }
                else if (typeof(list) === 'object') {
                    for (k in list) {
                        if (list.hasOwnProperty(k)) {
                            out.push(list[k]);
                        }
                    }
                }
            }
            return out;
        }

        return function (items) {
            return toArray(items).slice().reverse();
        };
    })
    .filter('capitalize', function () {
        return function (input) {
            if (input)
                return input[0].toUpperCase() + input.slice(1);
        }
    });
