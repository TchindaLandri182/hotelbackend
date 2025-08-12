const mongoose = require('mongoose');
const { Schema } = mongoose;

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});

module.exports = mongoose.model('Point', PointModels)