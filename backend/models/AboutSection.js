const mongoose = require('mongoose');

const AboutSectionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['journey', 'value', 'stat', 'quote', 'founder', 'vision', 'mission', 'accolade']
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AboutSection', AboutSectionSchema);
