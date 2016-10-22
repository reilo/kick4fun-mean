'use strict';

angular.module('kick4fun.matchesCtrl', ['ngRoute'])

    .controller('MatchesCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'MatchesFactory', 'ParticipantsFactory',
        function ($scope, $location, appConfig, Uri, MatchesFactory, ParticipantsFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id;

            $scope.filter = ['', '', '', ''];

            $scope.getMatches = function () {
                var filter = [];
                for (var i = 0; i < $scope.filter.length; ++i) {
                    if ($scope.filter[i].length > 0) {
                        filter.push($scope.filter[i]);
                    }
                }
                MatchesFactory.all(tid, filter).then(function (result) {
                    $scope.matches = result.data;
                });
            };

            $scope.getMatches();

            ParticipantsFactory.all(tid).then(function (result) {
                $scope.participants = result.data.sort();
            });

        }]);