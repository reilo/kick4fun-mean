'use strict';

angular.module('kick4fun.roundCtrl', ['ngRoute'])

    .controller('RoundCtrl', ['$scope', '$location', 'appConfig', 'Uri', 'ChallengeFactory', 'RoundsFactory', 'MatchesFactory',
        function ($scope, $location, appConfig, Uri, ChallengeFactory, RoundsFactory, MatchesFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id;
            
            ChallengeFactory.all(tid).then(function (result) {
                var challenge = result.data;
                $scope.rounds = [];
                for (var i = 0; i < challenge.rounds.length; i++) {
                    var round = challenge.rounds[i];
                    var startDate = round.startDate && round.startDate.substr(8, 2) + '.' + round.startDate.substr(5, 2) + '.';
                    var endDate = round.endDate && round.endDate.substr(8, 2) + '.' + round.endDate.substr(5, 2) + '.' || '...';
                    $scope.rounds.push({
                        id: round.number,
                        name: (round.number == challenge.rounds.length ? 'Aktuelle' : round.number + '.') + ' Spielwoche (' + startDate + ' - ' + endDate + ')'
                    });
                    $scope.selectedRound = {id: challenge.rounds.length, name: 'Aktuelle Spielwoche'};
                }
                $scope.getRoundData();
            });

            $scope.getRoundData = function () {

                if ($scope.selectedRound) {
                    
                    RoundsFactory.one(tid, $scope.selectedRound.id).then(function (result) {
                        var round = result.data;
                        var i;

                        $scope.active = !round.endDate;

                        $scope.lineUp = [];
                        var maxLevel = round.lineUp[0].strength;

                        for (var level = maxLevel; level > 0; level--) {
                            var count = 0;
                            var item = {};
                            item.level = level;
                            item.players = [];
                            for (i = 1; i < level; i++) {
                                item.players.push({player: ''});
                                count++;
                            }
                            var emptyBefore = false;
                            for (i = 0; i < round.lineUp.length; i++) {
                                if (round.lineUp[i].strength == level) {
                                    if (emptyBefore) {
                                        item.players.push({player: ''});
                                        count++;
                                    } else {
                                        emptyBefore = true;
                                    }
                                    item.players.push({
                                        player: round.lineUp[i].player,
                                        score: round.lineUp[i].score,
                                        diff: _.findWhere(round.standings, {player: round.lineUp[i].player}).score - round.lineUp[i].score
                                    });
                                    count++;
                                }
                            }
                            for (i = count; i < 2 * maxLevel; i++) {
                                item.players.push({player: ''});
                            }
                            $scope.lineUp.push(item);
                        }

                        MatchesFactory.all(tid, '', [$scope.selectedRound.id]).then(function (result) {
                            $scope.matches = result.data;
                        });
                        
                        $scope.standings = round.standings;
                        for (i = 0; i < round.standings.length; i++) {
                            round.standings[i].diff = _.findIndex(round.lineUp, {player: round.standings[i].player}) - i;
                        }

                    });
                }
            };

            $scope.addMatch = function () {
                $location.path('/match')
            };

        }]);