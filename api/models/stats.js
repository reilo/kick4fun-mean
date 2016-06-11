const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const StatsSchema = new Schema({
    rounds: {
        type: Number,
        default: 0
    },
    matches: {
        type: Number,
        default: 0
    },
    goals: {
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
    participantsPerRound: [
        Number
    ],
    matchesPerRound: [
        Number
    ]
}, {
    _id: false
});

mongoose.model('Stats', StatsSchema);