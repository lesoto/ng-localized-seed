'use strict';

angular.module('angularTemplate.directives', [])
    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive("footer", function () {
        return {
            restrict: 'E',
            template: '<div id="sitefooter" class="row"><div class="col-lg-12"><hr><p class="center" data-i18n="_CopyrightText_"></p></div></div>',
            //templateUrl: 'views/footer.html',
            replace: true,
            transclude: true,
        }
    })
    .directive("languagebar", function () {
        return {
            restrict: 'E',
            template: '<div ng-controller="LanguageCtrl"><a href="#" ng-click="setEnglishLanguage()">English</a> | <a href="#" ng-click="setSpanishLanguage()">Spanish</a> | <a href="#" ng-click="setRussianLanguage()">Russian</a></div>',
            //templateUrl: 'views/footer.html',
            replace: true,
            transclude: true,
        }
    })
;
