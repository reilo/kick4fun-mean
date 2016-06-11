'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.config',
        'myApp.services',
        'myApp.routes',
        'myApp.directives',
        'myApp.roundCtrl',
        'myApp.statisticsCtrl',
        'myApp.matchesCtrl',
        'myApp.resultsCtrl',
        'myApp.matchCtrl',
        'myApp.adminCtrl',
        'myApp.version'
    ])

    .config(['$httpProvider', function ($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/round'})
    }]);
