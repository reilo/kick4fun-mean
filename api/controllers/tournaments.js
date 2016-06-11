const fs = require('fs');
const mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

exports.list = function (request, response, next) {
    Tournament.find(function (error, tournaments) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(tournaments);
        }
    });
};

exports.listOne = function (request, response, next) {
    var tournamentId = request.params.id;
    Tournament.findById(tournamentId, function (error, tournament) {
        if (error) {
            next(new Error(error));
        } else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        } else {
            response.send(tournament);
        }
    });
};

exports.update = function (request, response, next) {
    var tournamentId = request.params.id;
    var data = request.body;
    Tournament.findById(tournamentId, function (error, tournament) {
        if (error) {
            next(new Error(error));
        } else if (tournament == null) {
            next({message: "Tournament does not exist", status: 400});
        } else {
            tournament.name = data.name || tournament.name;
            tournament.description = data.description || tournament.description;
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

exports.delete = function (request, response, next) {
    var tournamentId = request.params.id;
    Tournament.findOneAndRemove({'_id': tournamentId}, function (error, model) {
        if (error) {
            next(new Error(error));
        } else if (!model) {
            next({message: 'Tournament does not exist', status: 400});
        } else {
            response.sendStatus(204);
        }
    })
};
