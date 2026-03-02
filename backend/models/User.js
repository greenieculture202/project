const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        default: 'Not provided',
        trim: true
    },
    address: {
        type: String,
        default: 'Not provided',
        trim: true
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cart: {
        type: Array,
        default: []
    },
    greenPoints: {
        type: Number,
        default: 0
    },
    method: {
        type: String,
        default: 'Website' // 'Website' or 'Google'
    },
    profilePic: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
