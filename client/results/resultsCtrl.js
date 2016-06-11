'use strict';

angular.module('myApp.resultsCtrl', ['ngRoute'])

    .controller('ResultsCtrl', ['$scope', 'ChallengeFactory',
        function ($scope, ChallengeFactory) {

            ChallengeFactory.all().then(function (result) {
                $scope.results = result.data.overallStandings;
            });

        }
    ]);