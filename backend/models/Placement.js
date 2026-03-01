const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    features: [String],
    badge: {
        type: String,
        required: true
    },
    categoryRoute: {
        type: String,
        required: true
    },
    isLocal: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Placement', PlacementSchema);
