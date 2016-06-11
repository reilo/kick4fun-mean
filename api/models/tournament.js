const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

TournamentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 'build',
        enum: [
            'build',        // setup phase
            'progress',     // started, with partial results
            'paused',       // paused for intermediate setup
            'completed'     // finished, no more results
        ]
    },
    participants: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true,
    discriminatorKey: 'kind'
});

mongoose.model('Tournament', TournamentSchema);
