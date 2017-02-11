'use strict';

angular.module('kick4fun.adminCtrl', ['ngRoute'])

    .controller('AdminCtrl', ['$scope', '$location', '$window', 'appConfig', 'Uri', 'ChallengeFactory', 'ParticipantsFactory',
        function ($scope, $location, $window, appConfig, Uri, ChallengeFactory, ParticipantsFactory) {

            var tid = Uri.parse($location.$$absUrl).queryKey.id;
            
            $scope.serverErrors = {};

            ChallengeFactory.all(tid).then(function (result) {
                $scope.status = result.data.status;
            });

            ParticipantsFactory.all(tid).then(function (result) {
                $scope.participants = result.data;
            });

            $scope.startChallenge = function() {
                ChallengeFactory.prepare(tid).then(function (result) {
                    $window.location.reload();
                })
            };

            $scope.closeRound = function () {
                ChallengeFactory.stop(tid).then(function (result) {
                    $window.location.reload();
                })
            };

            $scope.openRound = function () {
                ChallengeFactory.start(tid)
                    .success(function (result) {
                        $location.path('/round');
                    })
                    .error(function (result, status) {
                    });
            };

            $scope.addParticipant = function () {
                ParticipantsFactory.add(tid, $scope.participantName)
                    .success(function (result) {
                        $window.location.reload();
                    })
                    .error(function (result, status) {
                        $scope.serverErrors['internal'] = result.errors[0].internalMessage;
                    });
            }

        }]);