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
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'],
        default: 'Pending'
    },
    courierName: {
        type: String,
        default: ''
    },
    assignedAt: {
        type: Date,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
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
    deliveryType: {
        type: String,
        default: 'Standard Delivery (7 Days)'
    },
    expectedDeliveryDate: {
        type: String,
        default: ''
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
    },
    deliveryPin: {
        type: String,
        default: ''
    },
    courierSettled: {
        type: Boolean,
        default: false
    },
    adminSettled: {
        type: Boolean,
        default: false
    },
    shippingDetails: {
        fullName: String,
        email: String,
        address: String,
        city: String,
        state: String,
        phone: String
    },
    returnDetails: {
        reason: String,
        additionalInfo: String,
        billImage: String,
        productImage1: String,
        productImage2: String,
        submittedAt: { type: Date, default: Date.now }
    },
    expectedReturnDate: {
        type: String,
        default: ''
    }
});

// Generate a random Order ID like #ORD-7742 and a 6-digit Delivery PIN
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
    }
    if (!this.deliveryPin) {
        this.deliveryPin = Math.floor(100000 + Math.random() * 900000).toString();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
