const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'],
        default: 'Processing'
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
