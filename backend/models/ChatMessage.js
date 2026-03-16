const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String, // Optional base64 or URL
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    recommendations: {
        type: [String],
        default: []
    },
    plantName: {
        type: String,
        default: 'Plant'
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
