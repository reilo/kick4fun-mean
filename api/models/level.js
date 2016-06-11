const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const LevelSchema = new Schema({
    player: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    strength: {
        type: Number,
        default: 0
    }
}, {
    _id: false
});

mongoose.model('Level', LevelSchema);