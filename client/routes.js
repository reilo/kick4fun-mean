'use strict';

angular.module('myApp.routes', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/round', {
                templateUrl: 'round/roundView.html',
                controller: 'RoundCtrl'
            })
            .when('/results', {
                templateUrl: 'results/resultsView.html',
                controller: 'ResultsCtrl'
            })
            .when('/statistics', {
                templateUrl: 'statistics/statisticsView.html',
                controller: 'StatisticsCtrl'
            })
            .when('/matches', {
                templateUrl: 'matches/matchesView.html',
                controller: 'MatchesCtrl'
            })
            .when('/admin', {
                templateUrl: 'admin/adminView.html',
                controller: 'AdminCtrl'
            })
            .when('/match', {
                templateUrl: 'match/matchView.html',
                controller: 'MatchCtrl'
            });
    }]);

