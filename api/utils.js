module.exports = {

    // Normalize a port into a number, string, or false.
    normalizePort: function (val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val; // named pipe
        } else if (port >= 0) {
            return port; // port number
        }
        return false;
    },

    getMatchSets: function(match) {
        var s1 = 0, s2 = 0, i;
        for (i = 0; i < match.result.length; i += 2) {
            if (match.result[i] > match.result[i + 1]) {
                s1++;
            } else if (match.result[i] < match.result[i + 1]) {
                s2++;
            }
        }
        return [s1, s2];
    },

    getMatchGoals: function(match) {
        var g1 = 0, g2 = 0, i;
        for (i = 0; i < match.result.length; i += 2) {
            g1 += match.result[i];
            g2 += match.result[i + 1];
        }
        return [g1, g2];
    },

    getMatchWinners: function(match) {
        var sets = this.getMatchSets(match);
        if (sets[0] > sets[1]) {
            return match.team1;
        } else if (sets[0] < sets[1]) {
            return match.team2;
        } else {
            return [];
        }
    },

    getMatchLosers: function(match) {
        var sets = this.getMatchSets(match);
        if (sets[0] < sets[1]) {
            return match.team1;
        } else if (sets[0] > sets[1]) {
            return match.team2;
        } else {
            return [];
        }
    }
};