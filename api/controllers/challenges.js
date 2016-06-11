const _ = require('underscore');
const mongoose = require('mongoose');

const utils = require('../utils');

const Tournament = mongoose.model('Tournament');
const Challenge = mongoose.model('Challenge');
const Match = mongoose.model('Match');
const Level = mongoose.model('Level');
const Standing = mongoose.model('Standing');
const Stats = mongoose.model('Stats');
const ParticipantStats = mongoose.model('ParticipantStats');

exports.create = function (request, response, next) {
    var data = request.body;
    var challenge = new Challenge({
        name: data.name,
        description: data.description || ''
    });
    challenge.save(function (error, challenge) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(challenge);
        }
    });
};

exports.prepare = function (request, response, next) {
    var challengeId = request.params.id;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (challenge.status != 'build') {
                error = 'Challenge is not in build status';
            } else if (challenge.participants.length < 4) {
                error = 'Not enough participants';
            } else {
                // create initial line up from participants list
                _.each(challenge.participants, function (playerName) {
                    challenge.initialLineUp.push(new Level({
                        player: playerName,
                        score: challenge.options.baseScore
                    }));
                });
                setStrengths(challenge.initialLineUp);
                _.each(challenge.initialLineUp, function (level) {
                    level.score += level.strength;
                });

                // create initial standings from line up
                _.each(challenge.initialLineUp, function (level) {
                    var standing = new Standing({
                        player: level.player,
                        score: level.score
                    });
                    challenge.overallStandings.push(standing);
                });
                sortStandings(challenge, challenge.overallStandings);
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            challenge.status = 'paused';
            challenge.save(function (error, challenge) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(challenge);
                }
            });
        }
    });
};

exports.start = function (request, response, next) {
    var challengeId = request.params.id;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (challenge.status != 'paused') {
                error = 'Challenge is not in paused status';
            } else {
                var nextRoundNumber = challenge.rounds.length + 1;
                var nextRound = {
                    number: nextRoundNumber,
                    matches: [],
                    startDate: Date.now()
                };

                // add new participants to overall standings using minimum score
                var minScore = challenge.options.baseScore;
                var currentParticipants = [];
                _.each(challenge.overallStandings, function (standing) {
                    currentParticipants.push(standing.player);
                });
                _.each(challenge.participants, function (participant) {
                    if (!_.contains(currentParticipants, participant)) {
                        challenge.overallStandings.push(new Standing({
                            player: participant,
                            score: minScore
                        }));
                    }
                });
                sortStandings(challenge, challenge.overallStandings);

                // copy overall standings to next round
                nextRound.standings = JSON.parse(JSON.stringify(challenge.overallStandings));

                // create line-up for next round
                nextRound.lineUp = [];
                _.each(nextRound.standings, function (standing) {
                    nextRound.lineUp.push(new Level({
                        player: standing.player,
                        score: standing.score
                    }));
                });
                setStrengths(nextRound.lineUp);

                // next round is set up ready
                challenge.rounds.push(nextRound);
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            challenge.status = 'progress';
            challenge.save(function (error, challenge) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(challenge);
                }
            });
        }
    });
};

exports.stop = function (request, response, next) {
    var challengeId = request.params.id;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (challenge.status != 'progress') {
                error = 'Challenge is not in progress status';
            } else {
                challenge.rounds[challenge.rounds.length - 1].endDate = Date.now();
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            challenge.status = 'paused';
            challenge.save(function (error, challenge) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(challenge);
                }
            });
        }
    });
};

exports.addMatch = function (request, response, next) {
    var challengeId = request.params.id;
    var data = request.body;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (challenge.status != 'progress') {
                error = 'Challenge is not in progress status';
            } else {
                var match = new Match({
                    number: challenge.countMatches + 1,
                    date: data.date || Date.now(),
                    team1: data.team1,
                    team2: data.team2,
                    result: data.result
                });
                error = validateMatch(challenge, match);
                if (!error) {
                    var idx = challenge.rounds.length - 1;
                    challenge.rounds[idx].matches.push(match);
                    updateStandings(challenge.rounds[idx].standings, challenge.rounds[idx].lineUp, match, challenge.options);
                    sortStandings(challenge, challenge.rounds[idx].standings);
                    challenge.overallStandings = JSON.parse(JSON.stringify(challenge.rounds[idx].standings));
                }
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            challenge.save(function (error, challenge) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(challenge);
                }
            });
        }
    });
};

exports.getMatches = function (request, response, next) {
    var challengeId = request.params.id;
    var players = request.query.players ? request.query.players.split(',') : [];
    var rounds = request.query.rounds ? request.query.rounds.split(',') : [];
    Tournament.findById(challengeId, function (error, challenge) {
        var matches = [];
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else {
                _.each(challenge.rounds, function (round) {
                    if (rounds.length == 0 || _.contains(rounds, round.number.toString())) {
                        _.each(round.matches, function (match) {
                            if (_.difference(players, _.union(match.team1, match.team2)).length == 0) {
                                var m = new Match(match);
                                match.sets = m.sets;
                                match.strengths1 = [
                                    _.findWhere(round.lineUp, {player: match.team1[0]}).strength,
                                    _.findWhere(round.lineUp, {player: match.team1[1]}).strength
                                ];
                                match.strengths2 = [
                                    _.findWhere(round.lineUp, {player: match.team2[0]}).strength,
                                    _.findWhere(round.lineUp, {player: match.team2[1]}).strength
                                ];
                                matches.push(match);
                            }
                        });
                    }
                });
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            response.send(matches);
        }
    });
};

exports.getRound = function (request, response, next) {
    var challengeId = request.params.id;
    var roundNum = request.params.num;
    Tournament.findById(challengeId, function (error, challenge) {
        var maxRound = 0;
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else {
                maxRound = challenge.rounds.length;
                if (maxRound < roundNum) {
                    error = 'Round does not exist';
                }
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            response.send(challenge.rounds[roundNum == 0 ? maxRound - 1 : roundNum - 1]);
        }
    });
};

exports.finish = function (request, response, next) {
    var challengeId = request.params.id;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (challenge.status != 'paused') {
                error = 'Tournament is not in paused status';
            } else {
                error = 'Finish not yet implemented';
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            challenge.status = 'completed';
            challenge.save(function (error, challenge) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(challenge);
                }
            });
        }
    });
};

exports.getStats = function(request, response, next) {
    var challengeId = request.params.id;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            var stats = new Stats();
            stats.rounds = challenge.rounds.length;
            _.each(challenge.rounds, function (round) {
                stats.matches += round.matches.length;
                stats.matchesPerRound.push(round.matches.length);
                var participants = [];
                _.each(round.matches, function(match) {
                    stats.goals += _.reduce(match.result, function(sum, item) { return sum + item; }, 0);
                    var sets = utils.getMatchSets(match);
                    if (_.contains(sets, 0)) {
                        stats.highWins++;
                    } else {
                        stats.lowWins++;
                    }
                    participants = _.union(_.union(participants, match.team1), match.team2);
                });
                stats.participantsPerRound.push(participants.length);
            });
            response.send(stats);
        }
    });
};

exports.getStatsParticipant = function(request, response, next) {
    var challengeId = request.params.id;
    var participantName = request.params.name;
    Tournament.findById(challengeId, function (error, challenge) {
        if (!error) {
            if (challenge == null) {
                error = 'Challenge does not exist';
            } else if (!_.contains(challenge.participants, participantName)) {
                error = 'Player is not participant of challenge';
            }
        }
        if (error) {
            next(new Error(error));
        } else {
            var stats = new ParticipantStats();
            var record = _.findWhere(challenge.overallStandings, {player: participantName});
            if (record) {
                stats.matches = record.total;
                stats.wins = record.wins;
                stats.losses = record.losses;
                stats.goalsScored = record.goalsScored;
                stats.goalsShipped = record.goalsShipped;
                stats.activity = record.total / challenge.rounds.length;
            }
            var partners = {};
            var opponents = {};
            _.each(challenge.participants, function(participant) {
                partners[participant] = [0, 0, 0];
                opponents[participant] = [0, 0, 0];
            });
            var lineUp = _.findWhere(challenge.initialLineUp, {player: participantName});
            if (lineUp) {
                stats.scorePerRound.push(lineUp.score);
                stats.positionPerRound.push(1 + _.findIndex(challenge.initialLineUp, function (item) {
                        return item.player == participantName;
                    }));
                stats.strengthPerRound.push(lineUp.strength);
            }
            _.each(challenge.rounds, function(round) {
                var standing = _.findWhere(round.standings, {player: participantName});
                if (standing) {
                    stats.scorePerRound.push(standing.score);
                    stats.positionPerRound.push(1 + _.findIndex(round.standings, function(item) {
                            return item.player == participantName;
                        }));
                    stats.strengthPerRound.push(_.findWhere(round.lineUp, {player: participantName}).strength);
                    _.each(round.matches, function(match) {
                        var winners = utils.getMatchWinners(match);
                        var losers = utils.getMatchLosers(match);
                        var sets = utils.getMatchSets(match);
                        if (_.contains(winners, participantName)) {
                            partners[winners[0]][0]++;
                            partners[winners[0]][1]++;
                            partners[winners[1]][0]++;
                            partners[winners[1]][1]++;
                            opponents[losers[0]][0]++;
                            opponents[losers[0]][1]++;
                            opponents[losers[1]][0]++;
                            opponents[losers[1]][1]++;
                            if (_.contains(sets, 0)) {
                                stats.highWins++;
                                stats.winSets += 3;
                            } else {
                                stats.lowWins++;
                                stats.winSets += 2;
                                stats.lossSets++;
                            }
                        } else if (_.contains(losers, participantName)) {
                            partners[losers[0]][0]++;
                            partners[losers[0]][2]++;
                            partners[losers[1]][0]++;
                            partners[losers[1]][2]++;
                            opponents[winners[0]][0]++;
                            opponents[winners[0]][2]++;
                            opponents[winners[1]][0]++;
                            opponents[winners[1]][2]++;
                            if (_.contains(sets, 0)) {
                                stats.highLosses++;
                                stats.lossSets += 3;
                            } else {
                                stats.lowLosses++;
                                stats.lossSets += 2;
                                stats.winSets++;
                            }
                        }
                    });
                }
            });
            var name;
            for (name in partners) {
                if (partners[name][0] > 0 && name != participantName) {
                    stats.partners.push({ name: name, counts: partners[name] });
                }
            }
            for (name in opponents) {
                if (opponents[name][0] > 0 && name != participantName) {
                    stats.opponents.push({ name: name, counts: opponents[name] });
                }
            }
            response.send(stats);
        }
    });
};

function compareStanding(a, b) {
    if (a.score < b.score) {
        return 1;
    } else if (a.score > b.score) {
        return -1;
    } else if (a.goalsScored - a.goalsShipped < b.goalsScored - b.goalsShipped) {
        return 1;
    } else if (a.goalsScored - a.goalsShipped > b.goalsScored - b.goalsShipped) {
        return -1;
    } else if (a.goalsScored < b.goalsScored) {
        return 1;
    } else if (a.goalsScored > b.goalsScored) {
        return -1;
    } else if (a.playerNum > b.playerNum) {
        return 1;
    } else if (a.playerNum < b.playerNum) {
        return -1;
    } else if (a.player > b.player) {
        return 1;
    } else {
        return -1;
    }
}

function setStrengths(lineUp) {
    var ctr = 0, strength = 0;
    while (ctr < lineUp.length) {
        strength += 1;
        ctr += strength;
    }
    ctr = 1;
    var countDown = 1;
    for (var i = 0; i < lineUp.length; ++i) {
        if (countDown == 0) {
            ctr += 1;
            countDown = ctr;
            strength -= 1;
        }
        lineUp[i].strength = strength;
        countDown--;
    }
}

function updateStandings(standings, lineUp, match, options) {

    var strengths = {};
    strengths[match.winners[0]] = _.findWhere(lineUp, {player: match.winners[0]}).strength;
    strengths[match.winners[1]] = _.findWhere(lineUp, {player: match.winners[1]}).strength;
    strengths[match.losers[0]] = _.findWhere(lineUp, {player: match.losers[0]}).strength;
    strengths[match.losers[1]] = _.findWhere(lineUp, {player: match.losers[1]}).strength;

    var looserLevelAverage = (strengths[match.losers[0]] + strengths[match.losers[1]]) / 2;
    var scoreFraction = 1 - ( _.min(match.sets) / _.max(match.sets));

    var scores = {};
    scores[match.winners[0]] = looserLevelAverage * scoreFraction + options.matchPoints;
    scores[match.winners[1]] = looserLevelAverage * scoreFraction + options.matchPoints;
    scores[match.losers[0]] = -(strengths[match.losers[0]] * scoreFraction) + options.matchPoints;
    scores[match.losers[1]] = -(strengths[match.losers[1]] * scoreFraction) + options.matchPoints;

    match.score = [];
    match.score.push(scores[match.team1[0]]);
    match.score.push(scores[match.team1[1]]);
    match.score.push(scores[match.team2[0]]);
    match.score.push(scores[match.team2[1]]);

    var winnerIndex = match.sets[0] > match.sets[1] ? 0 : 1;
    var looserIndex = match.sets[0] > match.sets[1] ? 1 : 0;

    _.each(standings, function (standing) {
        if (_.contains(match.winners, standing.player)) {
            standing.wins += 1;
            standing.goalsScored += match.goals[winnerIndex]; //_.max(match.goals);
            standing.goalsShipped += match.goals[looserIndex]; //_.min(match.goals);
            standing.score += scores[standing.player];
            standing.total++;
        } else if (_.contains(match.losers, standing.player)) {
            standing.losses += 1;
            standing.goalsScored += match.goals[looserIndex]; //_.min(match.goals);
            standing.goalsShipped += match.goals[winnerIndex]; //_.max(match.goals);
            standing.score += scores[standing.player];
            standing.total++;
        }
    });
}

function findMatch(challenge, match) {
    var foundMatch = null;
    _.each(challenge.rounds, function (round) {
        _.each(round.matches, function (m) {
            if (_.intersection(match.team1, m.team1).length == 2 && _.intersection(match.team2, m.team2).length == 2 ||
                _.intersection(match.team1, m.team2).length == 2 && _.intersection(match.team2, m.team1).length == 2) {
                foundMatch = m;
            }
        })
    });
    return foundMatch;
}

function validateMatch(challenge, match) {
    if (match.team1.length != 2 || match.team2.length != 2) {
        return 'Teams must have 2 participants';
    } else if (_.union(match.team1, match.team2).length != 4) {
        return "One or more players are duplicate"
    } else if (_.difference(_.union(match.team1, match.team2), challenge.participants).length > 0) {
        return "One or more players are not participants"
    } else if (match.result[0] == match.result[1] || match.result[2] == match.result[3] || match.result[4] == match.result[5]) {
        return "Each set must have winner and looser"
    } else if (findMatch(challenge, match)) {
        return 'Match already played';
    } else {
        return null;
    }
}

function sortStandings(challenge, standings) {
    _.each(standings, function (standing) {
        standing.playerNum = challenge.participants.indexOf(standing.player);
    });
    standings.sort(compareStanding);
}
