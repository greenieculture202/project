const mongoose = require('mongoose');

const adminChatMessageSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admins are also in the User table with role 'admin'
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
    timestamp: {
        type: Date,
        default: Date.now
    },
    isFallback: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('AdminChatMessage', adminChatMessageSchema);
