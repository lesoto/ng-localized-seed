"use strict";

angular.module('angularTemplate.routes', ['ngRoute'])

    // configure views; the authRequired parameter is used for specifying pages
    // which should only be available while logged in
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        });

        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
            controller: 'ChatCtrl'
        });

        $routeProvider.when('/account', {
            authRequired: true, // must authenticate before viewing this page
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/home'});
    }]);