'use strict';

angular.module('myApp.matchesCtrl', ['ngRoute'])

    .controller('MatchesCtrl', ['$scope', 'MatchesFactory', 'ParticipantsFactory',
        function ($scope, MatchesFactory, ParticipantsFactory) {

            $scope.filter = ['', '', '', ''];

            $scope.getMatches = function () {
                var filter = [];
                for (var i = 0; i < $scope.filter.length; ++i) {
                    if ($scope.filter[i].length > 0) {
                        filter.push($scope.filter[i]);
                    }
                }
                MatchesFactory.all(filter).then(function (result) {
                    $scope.matches = result.data;
                });
            };

            $scope.getMatches();

            ParticipantsFactory.all().then(function (result) {
                $scope.participants = result.data.sort();
            });

        }]);