const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderDisplayId: {
        type: String, // #ORD-XXXX
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if guest (though we filtered some before)
    },
    userName: String,
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String, // 'COD' or 'UPI/Online'
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Received', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
