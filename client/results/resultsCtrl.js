'use strict';

angular.module('kick4fun.resultsCtrl', ['ngRoute'])

    .controller('ResultsCtrl', ['$scope', 'ChallengeFactory',
        function ($scope, ChallengeFactory) {

            ChallengeFactory.all().then(function (result) {
                $scope.results = result.data.overallStandings;
            });

        }
    ]);