'use strict';

angular.module('kick4fun.statisticsCtrl', ['ngRoute'])

    .controller('StatisticsCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'ParticipantsFactory', 'StatsFactory',
        function ($scope, $location, appConfig, Uri, ParticipantsFactory, StatsFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id || appConfig.TOURNAMENT_ID;

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

            $scope.getPStats = function () {

                var participant = $scope.pfilter;

                StatsFactory.participant(tid, participant).then(function (result) {
                    $scope.pstats = result.data;
                    $scope.showPMatches = function () {
                        Morris.Donut({
                            element: 'donut-pmatches',
                            resize: true,
                            data: [
                                {label: "Spiele", value: $scope.pstats.matches}
                            ]
                        });
                    };
                    $scope.showPMatches();
                    $scope.showPWinLoss = function () {
                        Morris.Donut({
                            element: 'donut-pwinloss',
                            resize: true,
                            data: [
                                {label: "Siege", value: $scope.pstats.wins},
                                {label: "Niederlagen", value: $scope.pstats.losses}
                            ]
                        });
                    };
                    $scope.showPWinLoss();
                    $scope.showPSets = function () {
                        Morris.Donut({
                            element: 'donut-psets',
                            resize: true,
                            data: [
                                {label: "Gewinnsätze", value: $scope.pstats.winSets},
                                {label: "Verlustsätze", value: $scope.pstats.lossSets}
                            ]
                        });
                    };
                    $scope.showPSets();
                    $scope.showPGoals = function () {
                        Morris.Donut({
                            element: 'donut-pgoals',
                            resize: true,
                            data: [
                                {label: "Tore erzielt", value: $scope.pstats.goalsScored},
                                {label: "Tore kassiert", value: $scope.pstats.goalsShipped}
                            ]
                        });
                    };
                    $scope.showPGoals();
                    $scope.showPActivity = function () {
                        var roundedValue = Math.round(100 * $scope.pstats.activity) / 100;
                        Morris.Donut({
                            element: 'donut-pactivity',
                            resize: true,
                            data: [
                                {label: "Spiele/Woche", value: roundedValue}
                            ]
                        });
                    };
                    $scope.showPActivity();
                    $scope.showPStrength = function () {
                        var sum = _.reduce($scope.pstats.strengthPerRound, function(memo, num){ return memo + num; }, 0);
                        var roundedValue =  Math.round(100 * (sum / $scope.stats.rounds)) / 100;
                        Morris.Donut({
                            element: 'donut-pstrength',
                            resize: true,
                            data: [
                                {label: "Spielstärke", value: roundedValue}
                            ]
                        });
                    };
                    $scope.showPStrength();
                    $scope.showPPositionPerRound = function () {
                        var data = [];
                        var round = 0;
                        _.each($scope.pstats.positionPerRound, function (count) {
                            data.push({round: round++, position: count});
                        });
                        Morris.Line({
                            element: 'line-pposition',
                            data: data,
                            xkey: 'round',
                            ykeys: ['position'],
                            ymax: 1,
                            ymin: $scope.participants.length - $scope.participants.length % 4 + 1,
                            labels: ['Platz'],
                            parseTime: false,
                            resize: true,
                            hoverCallback: function (index, options, content, row) {
                                return row.round == 0 ? content.replace("0</div>", "Aufstellung</div>") : content.replace("</div>", ". Runde</div>");
                            }
                        });
                    };
                    $scope.showPPositionPerRound();
                    $scope.showPScorePerRound = function () {
                        var data = [];
                        var round = 0;
                        var maxScore = 0;
                        _.each($scope.pstats.scorePerRound, function (count) {
                            data.push({round: round++, score: count});
                            if (count > maxScore) {
                                maxScore = count;
                            }
                        });
                        Morris.Line({
                            element: 'line-pscore',
                            data: data,
                            xkey: 'round',
                            ykeys: ['score'],
                            ymin: 0,
                            ymax: maxScore - maxScore % 4 + 4,
                            labels: ['Punkte'],
                            parseTime: false,
                            resize: true,
                            hoverCallback: function (index, options, content, row) {
                                return row.round == 0 ? content.replace("0</div>", "Aufstellung</div>") : content.replace("</div>", ". Runde</div>");
                            }
                        });
                    };
                    $scope.showPScorePerRound();
                    $scope.showPPartners = function() {
                        var data = [];
                        var maxNum = 0;
                        _.each($scope.pstats.partners, function(entry) {
                            data.push({partner: entry.name, matches: entry.counts[0], won: entry.counts[1], lost: entry.counts[2]});
                            if (entry.counts[0] > maxNum) {
                                maxNum = entry.counts[0];
                            }
                        });
                        Morris.Bar({
                            element: 'bar-ppartners',
                            data: data,
                            ymax: maxNum - maxNum % 4 + (maxNum % 4 > 0) ? 4 : 0,
                            xkey: 'partner',
                            ykeys: ['matches', 'won', 'lost'],
                            labels: ['Spiele', 'Siege', 'Niederlagen'],
                            barColors: ['blue', 'green', 'red']
                        });
                    };
                    $scope.showPPartners();
                    $scope.showPOpponents = function() {
                        var data = [];
                        var maxNum = 0;
                        _.each($scope.pstats.opponents, function(entry) {
                            data.push({opponent: entry.name, matches: entry.counts[0], won: entry.counts[1], lost: entry.counts[2]});
                            if (entry.counts[0] > maxNum) {
                                maxNum = entry.counts[0];
                            }
                        });
                        Morris.Bar({
                            element: 'bar-popponents',
                            data: data,
                            ymax: maxNum - maxNum % 4 + ((maxNum % 4 > 0) ? 4 : 0),
                            xkey: 'opponent',
                            ykeys: ['matches', 'won', 'lost'],
                            labels: ['Spiele', 'Siege', 'Niederlagen'],
                            barColors: ['blue', 'green', 'red']
                        });
                    };
                    $scope.showPOpponents();
                });

                $scope.resetPStats = function() {
                    $scope.pfilter = null;
                    
                }
            }
        }
    ]);