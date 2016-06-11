const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const utils = require('../utils');

const MatchSchema = new Schema({
    number: { // assigned automatically
        type: Number,
        min: 1,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    team1: [{
        type: String,
        required: true
    }],
    team2: [{
        type: String,
        required: true
    }],
    result: [
        Number
    ],
    score: [
        Number
    ]
}, {
    _id: false
});

MatchSchema.path('result').validate(function (result, respond) {
    if (result.length % 2 !== 0) {
        respond(false);
    }
    var i;
    for (i = 0; i < result.length; i += 2) {
        if (result[i] === result[i + 1]) {
            respond(false);
        }
    }
    respond(true);
}, 'Result is inconsistent');

MatchSchema.path('team1').validate(function (result, respond) {
    respond(team1.length >= 0 && team1.length <= 2);
}, 'Team1 is inconsistent');

MatchSchema.path('team2').validate(function (result, respond) {
    respond(team2.length >= 0 && team2.length <= 2);
}, 'Team2 is inconsistent');

MatchSchema.virtual('matches').get(function(){
    return this.result.length / 2;
});

MatchSchema.virtual('sets').get(function () {
    return utils.getMatchSets(this);
});

MatchSchema.virtual('goals').get(function () {
    return utils.getMatchGoals(this);
});

MatchSchema.virtual('winners').get(function() {
    return utils.getMatchWinners(this);
});

MatchSchema.virtual('losers').get(function() {
    return utils.getMatchLosers(this);
});

mongoose.model('Match', MatchSchema);