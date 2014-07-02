'use strict';

angular.module('angularTemplate',
    ['angularTemplate.config', 'angularTemplate.routes', 'angularTemplate.filters', 'angularTemplate.services', 'angularTemplate.directives', 'angularTemplate.controllers',
        'waitForAuth', 'routeSecurity', 'localization', 'ui.bootstrap', 'google-maps', 'placeholders']
)

    .run(['loginService', '$rootScope', 'FBURL', function (loginService, $rootScope, FBURL) {
        if (FBURL === 'https://INSTANCE.firebaseio.com') {
            // double-check that the app has been configured
            angular.element(document.body).html('<h1>Please configure app/js/script.js before running!</h1>');
            setTimeout(function () {
                angular.element(document.body).removeClass('hide');
            }, 250);
        }
        else {
            // establish authentication
            $rootScope.auth = loginService.init('/login');
            $rootScope.FBURL = FBURL;
        }
    }]);
