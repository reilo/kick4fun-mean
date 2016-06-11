const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const StandingSchema = new Schema({
    player: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    draws: {
        type: Number,
        default: 0
    },
    losses: {
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
    }
}, {
    _id: false
});

mongoose.model('Standing', StandingSchema);