const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    courierName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    orderCount: {
        type: Number,
        required: true
    },
    orderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    processedBy: {
        type: String, // 'Courier' or 'Admin'
        default: 'Courier'
    },
    status: {
        type: String,
        default: 'Settled'
    }
}, { timestamps: true });

module.exports = mongoose.model('Settlement', settlementSchema);
