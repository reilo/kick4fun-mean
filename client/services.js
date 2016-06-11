'use strict';

angular.module('kick4fun.services', ['ngResource'])

    .factory('ParticipantsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var tid = appConfig.TOURNAMENT_ID;

        const TOURNAMENT_URL = 'http://' + host + ':' + port + '/api/v1/tournaments/' + tid + '/';

        var ParticipantsFactory = {};

        ParticipantsFactory.all = function () {
            return $http.get(TOURNAMENT_URL + 'participants');
        };

        ParticipantsFactory.add = function (name) {
            var participant = {name: name};
            return $http.post(TOURNAMENT_URL + 'participants',
                JSON.stringify(participant));
        };

        return ParticipantsFactory;
    }])

    .factory('ChallengeFactory', ['$http', '$location', 'appConfig',
        function ($http, $location, appConfig) {

            var host = $location.$$host;
            var port = appConfig.REST_PORT;
            var tid = appConfig.TOURNAMENT_ID;

            const CHALLENGE_URL = 'http://' + host + ':' + port + '/api/v1/challenges/' + tid + '/';

            var ChallengeFactory = {};

            ChallengeFactory.all = function () {
                return $http.get(CHALLENGE_URL);
            };

            ChallengeFactory.stop = function () {
                return $http.put(CHALLENGE_URL + 'stop', {});
            };

            ChallengeFactory.start = function () {
                return $http.put(CHALLENGE_URL + 'start', {});
            };

            return ChallengeFactory;

        }])

    .factory('RoundsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var tid = appConfig.TOURNAMENT_ID;

        const CHALLENGE_URL = 'http://' + host + ':' + port + '/api/v1/challenges/' + tid + '/';

        var RoundsFactory = {};

        RoundsFactory.one = function (number) {
            return $http.get(CHALLENGE_URL + 'rounds/' + number);
        };

        return RoundsFactory;
    }])

    .factory('MatchesFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var tid = appConfig.TOURNAMENT_ID;

        const CHALLENGE_URL = 'http://' + host + ':' + port + '/api/v1/challenges/' + tid + '/';

        var MatchesFactory = {};

        MatchesFactory.all = function (players, rounds) {
            var filter = '?';
            if (players !== undefined && players.length > 0) {
                filter += ('players=' + players.join());
            }
            if (rounds !== undefined && rounds.length > 0) {
                if (filter.length > 1) {
                    filter += '&';
                }
                filter += ('rounds=' + rounds.join());
            }
            return $http.get(CHALLENGE_URL + 'matches' + filter);
        };

        MatchesFactory.add = function (match) {
            return $http.post(CHALLENGE_URL + 'matches', match);
        };

        return MatchesFactory;
    }])

    .factory('StatsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var tid = appConfig.TOURNAMENT_ID;

        const CHALLENGE_URL = 'http://' + host + ':' + port + '/api/v1/challenges/' + tid + '/';

        var StatsFactory = {};

        StatsFactory.challenge = function () {
            return $http.get(CHALLENGE_URL + 'stats/');
        };

        StatsFactory.participant = function (name) {
            return $http.get(CHALLENGE_URL + 'participants/' + name + '/stats');
        };

        return StatsFactory;
    }])

;
