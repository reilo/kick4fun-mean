'use strict';

angular.module('kick4fun.matchCtrl', ['ngRoute'])

    .controller('MatchCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'ParticipantsFactory', 'MatchesFactory',
        function ($scope, $location, appConfig, Uri, ParticipantsFactory, MatchesFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id || appConfig.TOURNAMENT_ID;

            $scope.date = new Date();

            $scope.goals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            $scope.team1 = [];
            $scope.team2 = [];
            $scope.sets = [];

            $scope.serverErrors = {};

            ParticipantsFactory.all(tid).then(function (result) {
                $scope.participants = result.data.sort();
            });

            $scope.cancel = function () {
                $location.path('/round');
            };

            $scope.save = function () {
                var match = {};
                match.team1 = $scope.team1;
                match.team2 = $scope.team2;
                match.result = $scope.sets;
                MatchesFactory.add(tid, match)
                    .success(function (result) {
                        $location.path('/round');
                    })
                    .error(function (result, status) {
                        $scope.serverErrors['internal'] = result.errors[0].internalMessage;
                    });
            }

        }]);