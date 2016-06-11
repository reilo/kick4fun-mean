const fs = require('fs');
const _ = require('underscore');
const mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

exports.list = function (request, response, next) {
    var tournamentId = request.params.id;
    Tournament.findById(tournamentId, function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next({message: 'Tournament does not exist', status: 400});
        } else {
            response.send(tournament.participants || []);
        }
    });
};

exports.add = function (request, response, next) {
    var tournamentId = request.params.id;
    var participantName = request.body.name;
    Tournament.findById(tournamentId, function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist';
            } else if (_.contains(tournament.participants, participantName)) {
                error = 'Player is already participant';
            } else if (tournament.status != 'build' && tournament.status != 'paused') {
                error = 'Participant can only added in build or stopped status';
            } else {
                tournament.participants.push(participantName);
            }
        }
        if (error) {
            next({message: error, status: 400});
        } else {
            tournament.save(function (error, tournament) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(tournament);
                }
            });
        }
    });
};

exports.remove = function (request, response, next) {
    var tournamentId = request.params.id;
    var participantName = request.params.name;
    Tournament.findById(tournamentId, function (error, tournament) {
        if (!error) {
            if (tournament == null) {
                error = 'Tournament does not exist';
            } else if (tournament.status != 'build' && tournament.status != 'paused') {
                error = 'Participant can only added in build or stopped status';
            } else if (!_.contains(tournament.participants, participantName)) {
                error = 'Player is not participant of tournament';
            } else {
                tournament.participants.remove(participantName);
            }
        }
        if (error) {
            next({message: error, status: 400});
        } else {
            tournament.save(function (error, tournament) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.sendStatus(204);
                }
            });
        }
    });
};