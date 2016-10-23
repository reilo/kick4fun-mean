'use strict';

// Declare app level module which depends on views, and components
angular.module('kick4fun', [
        'ngRoute',
        'kick4fun.config',
        'kick4fun.services',
        'kick4fun.routes',
        'kick4fun.directives',
        'kick4fun.helpers',
        'kick4fun.roundCtrl',
        'kick4fun.statisticsCtrl',
        'kick4fun.pstatisticsCtrl',
        'kick4fun.matchesCtrl',
        'kick4fun.resultsCtrl',
        'kick4fun.matchCtrl',
        'kick4fun.adminCtrl',
        'kick4fun.version'
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
