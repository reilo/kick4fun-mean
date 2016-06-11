const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const CounterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    counts: [
        Number
    ]
}, {
    _id: false
});

mongoose.model('Counter', CounterSchema);