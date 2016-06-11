const _ = require('underscore');

const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const MatchSchema = require('./match');
const LevelSchema = require('./level');
const StandingSchema = require('./standing');

const ChallengeSchema = new Schema({
    options: {
        baseScore: {
            type: Number,
            required: true,
            default: 20
        },
        matchPoints: {
            type: Number,
            required: true,
            default: 1
        }
    },
    initialLineUp: [
        LevelSchema
    ],
    rounds: [
        {
            number: {
                type: Number,
                min: 1,
                required: true
            },
            startDate: {
                type: Date,
                required: true,
                default: Date.now()
            },
            endDate: {
                type: Date,
                required: false
            },
            lineUp: [
                LevelSchema
            ],
            matches: [
                MatchSchema
            ],
            standings: [
                StandingSchema
            ]
        }
    ],
    overallStandings: [
        StandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

ChallengeSchema.virtual('countMatches').get(function () {
    var countMatches = 0;
    _.each(this.rounds, function(round) {
        countMatches += round.matches.length;
    });
    return countMatches;
});

Tournament.discriminator('Challenge', ChallengeSchema);