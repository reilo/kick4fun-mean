const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const CounterSchema = require('./counter');

const ParticipantStatsSchema = new Schema({
    matches: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    highWins: {
        type: Number,
        default: 0
    },
    lowWins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    highLosses: {
        type: Number,
        default: 0
    },
    lowLosses: {
        type: Number,
        default: 0
    },
    winSets: {
        type: Number,
        default: 0
    },
    lossSets: {
        type: Number,
        default: 0
    },
    goalsScored: {
        type: Number,
        default: 0
    },
    goalsShipped: {
        type: Number,
        default: 0
    },
    activity: {
        type: Number,
        default: 0
    },
    partners: [
        CounterSchema
    ],
    opponents: [
        CounterSchema
    ],
    positionPerRound: [
        Number
    ],
    strengthPerRound: [
        Number
    ],
    scorePerRound: [
        Number
    ]
}, {
    _id: false
});

mongoose.model('ParticipantStats', ParticipantStatsSchema);