'use strict';

angular.module('myApp.adminCtrl', ['ngRoute'])

    .controller('AdminCtrl', ['$scope', '$location', '$window', 'ChallengeFactory', 'ParticipantsFactory',
        function ($scope, $location, $window, ChallengeFactory, ParticipantsFactory) {

            $scope.serverErrors = {};

            ChallengeFactory.all().then(function (result) {
                $scope.status = result.data.status;
            });

            ParticipantsFactory.all().then(function (result) {
                $scope.participants = result.data;
            });

            $scope.closeRound = function () {
                ChallengeFactory.stop().then(function (result) {
                    $window.location.reload();
                })
            };

            $scope.openRound = function () {
                ChallengeFactory.start()
                    .success(function (result) {
                        $location.path('/round');
                    })
                    .error(function (result, status) {
                    });
            };

            $scope.addParticipant = function () {
                ParticipantsFactory.add($scope.participantName)
                    .success(function (result) {
                        $window.location.reload();
                    })
                    .error(function (result, status) {
                        $scope.serverErrors['internal'] = result.errors[0].internalMessage;
                    });
            }

        }]);