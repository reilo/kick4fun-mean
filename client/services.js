'use strict';

angular.module('kick4fun.services', ['ngResource'])

    .factory('ParticipantsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT || 3000;
        var path = appConfig.APP_PATH || '/';

        const TOURNAMENT_URL = 'http://' + host + ':' + port + path + 'api/v1/tournaments/';

        var ParticipantsFactory = {};

        ParticipantsFactory.all = function (tid) {
            return $http.get(TOURNAMENT_URL + tid + '/participants');
        };

        ParticipantsFactory.add = function (tid, name) {
            var participant = {name: name};
            return $http.post(TOURNAMENT_URL + tid + '/participants',
                JSON.stringify(participant));
        };

        return ParticipantsFactory;
    }])

    .factory('ChallengeFactory', ['$http', '$location', 'appConfig',
        function ($http, $location, appConfig) {

            var host = $location.$$host;
            var port = appConfig.REST_PORT;
            var path = appConfig.APP_PATH;

            const CHALLENGE_URL = 'http://' + host + ':' + port + path + 'api/v1/challenges/';

            var ChallengeFactory = {};

            ChallengeFactory.all = function (tid) {
                return $http.get(CHALLENGE_URL  + tid);
            };

            ChallengeFactory.prepare = function (tid) {
                return $http.put(CHALLENGE_URL + tid + '/prepare', {});
            };

            ChallengeFactory.stop = function (tid) {
                return $http.put(CHALLENGE_URL + tid + '/stop', {});
            };

            ChallengeFactory.start = function (tid) {
                return $http.put(CHALLENGE_URL + tid + '/start', {});
            };

            return ChallengeFactory;

        }])

    .factory('RoundsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var path = appConfig.APP_PATH;

        const CHALLENGE_URL = 'http://' + host + ':' + port + path + 'api/v1/challenges/';

        var RoundsFactory = {};

        RoundsFactory.one = function (tid, number) {
            return $http.get(CHALLENGE_URL + tid + '/rounds/' + number);
        };

        return RoundsFactory;
    }])

    .factory('MatchesFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var path = appConfig.APP_PATH;

        const CHALLENGE_URL = 'http://' + host + ':' + port + path + 'api/v1/challenges/';

        var MatchesFactory = {};

        MatchesFactory.all = function (tid, players, rounds) {
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
            return $http.get(CHALLENGE_URL + tid + '/matches' + filter);
        };

        MatchesFactory.add = function (tid, match) {
            return $http.post(CHALLENGE_URL + tid + '/matches', match);
        };

        return MatchesFactory;
    }])

    .factory('StatsFactory', ['$http', '$location', 'appConfig', function ($http, $location, appConfig) {

        var host = $location.$$host;
        var port = appConfig.REST_PORT;
        var path = appConfig.APP_PATH;

        const CHALLENGE_URL = 'http://' + host + ':' + port + path + 'api/v1/challenges/';

        var StatsFactory = {};

        StatsFactory.challenge = function (tid) {
            return $http.get(CHALLENGE_URL + tid + '/stats');
        };

        StatsFactory.participant = function (tid, name) {
            return $http.get(CHALLENGE_URL + tid + '/participants/' + name + '/stats');
        };

        return StatsFactory;
    }])

;
