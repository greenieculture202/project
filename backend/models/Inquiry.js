const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    reply: {
        content: { type: String },
        repliedAt: { type: Date },
        adminId: { type: String }
    },
    status: { type: String, enum: ['Pending', 'Replied'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
