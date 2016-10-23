'use strict';

angular.module('kick4fun.statisticsCtrl', ['ngRoute'])

    .controller('StatisticsCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'ParticipantsFactory', 'StatsFactory',
        function ($scope, $location, appConfig, Uri, ParticipantsFactory, StatsFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id;

            ParticipantsFactory.all(tid).then(function (result) {
                $scope.participants = result.data.sort();
            });

            StatsFactory.challenge(tid).then(function (result) {
                $scope.stats = result.data;
                if (!$scope.showRounds) {
                    $scope.showRounds = function () {
                        Morris.Donut({
                            element: 'donut-rounds',
                            resize: true,
                            data: [
                                {label: "Runden", value: $scope.stats.rounds}
                            ]
                        });
                    };
                    $scope.showRounds();
                }
                if (!$scope.showMatches) {
                    $scope.showMatches = function () {
                        Morris.Donut({
                            element: 'donut-matches',
                            resize: true,
                            data: [
                                {label: "Spiele", value: $scope.stats.matches}
                            ]
                        });
                    };
                    $scope.showMatches();
                }
                if (!$scope.showMatchesLowHigh) {
                    $scope.showMatchesLowHigh = function () {
                        Morris.Donut({
                            element: 'donut-lowhigh',
                            resize: true,
                            data: [
                                {label: "3:0", value: $scope.stats.highWins},
                                {label: "2:1", value: $scope.stats.lowWins}
                            ]
                        });
                    };
                    $scope.showMatchesLowHigh();
                }
                if (!$scope.showGoals) {
                    $scope.showGoals = function () {
                        Morris.Donut({
                            element: 'donut-goals',
                            resize: true,
                            data: [
                                {label: "Tore", value: $scope.stats.goals}
                            ]
                        });
                    };
                    $scope.showGoals();
                }
                if (!$scope.showMatchesPerRound) {
                    $scope.showMatchesPerRound = function () {
                        var data = [];
                        var round = 0;
                        _.each($scope.stats.matchesPerRound, function (count) {
                            data.push({round: ++round, matches: count});
                        });
                        Morris.Line({
                            element: 'line-matches',
                            data: data,
                            xkey: 'round',
                            ykeys: ['matches'],
                            ymin: 0,
                            ymax: 8,
                            labels: ['Anzahl Spiele'],
                            parseTime: false,
                            resize: true,
                            hoverCallback: function (index, options, content) {
                                return content.replace("</div>", ". Runde</div>");
                            }
                        });
                    };
                    $scope.showMatchesPerRound();
                }
                if (!$scope.showParticipantsPerRound) {
                    $scope.showParticipantsPerRound = function () {
                        var data = [];
                        var round = 0;
                        _.each($scope.stats.participantsPerRound, function (count) {
                            data.push({round: ++round, participants: count});
                        });
                        Morris.Line({
                            element: 'line-participants',
                            data: data,
                            xkey: 'round',
                            ykeys: ['participants'],
                            ymin: 0,
                            ymax: $scope.participants.length - $scope.participants.length % 4,
                            labels: ['Aktive Teilnehmer'],
                            parseTime: false,
                            resize: true,
                            hoverCallback: function (index, options, content) {
                                return content.replace("</div>", ". Runde</div>");
                            }
                        });
                    };
                    $scope.showParticipantsPerRound();
                }
            });

        }
    ]);