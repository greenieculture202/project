const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true,
        default: 'Guest Customer'
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false  // Optional - some products may not have a DB ID
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        weight: String,
        isGift: Boolean,
        planter: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    courierName: {
        type: String,
        default: ''
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    orderDate: {
        type: Date,
        default: Date.now,
        index: -1
    },
    paymentMethod: {
        type: String,
        default: 'UPI'
    },
    orderId: {
        type: String,
        unique: true
    },
    appliedOfferCode: {
        type: String,
        default: null
    },
    offerBenefit: {
        type: String,
        default: null
    }
});

// Generate a random Order ID like #ORD-7742
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
