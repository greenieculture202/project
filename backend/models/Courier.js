const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    states: [{
        type: String
    }],
    fee: { type: Number, default: 50 },
    icon: { type: String, default: 'fa-truck' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    certificate: { type: String, default: '' } // Base64 or path for PDF/PPT
}, { timestamps: true });

module.exports = mongoose.model('Courier', courierSchema);
