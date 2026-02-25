const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Completed', 'Cancelled', 'Shipped'],
        default: 'Processing'
    },
    orderDate: {
        type: Date,
        default: Date.now
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
