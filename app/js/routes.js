"use strict";

angular.module('ngLocalizedStarterApp.routes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        });

        $routeProvider.when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'ContactCtrl'
        });

        $routeProvider.when('/sitemap', {
            templateUrl: 'views/sitemap.html'
        });

        $routeProvider.when('/404', {
            templateUrl: 'views/page404.html'
        });

        $routeProvider.when('/chat', {
            templateUrl: 'views/chat.html',
            controller: 'ChatCtrl'
        });

        $routeProvider.when('/account', {
            authRequired: true,
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/404'
        });

        $locationProvider.html5Mode(true);
    });
