'use strict';

angular.module('kick4fun.resultsCtrl', ['ngRoute'])

    .controller('ResultsCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'ChallengeFactory',
        function ($scope, $location, appConfig, Uri, ChallengeFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id || appConfig.TOURNAMENT_ID;
            
            ChallengeFactory.all(tid).then(function (result) {
                $scope.results = result.data.overallStandings;
            });

        }
    ]);