const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Mixed, required: false }, // Can be ObjectId or 'admin' string
    type: { type: String, default: 'Reply' }, // 'Reply', 'LowStock', 'NewOrder', 'admin' etc.
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedInquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },

    // Store product details for stock/order notifications
    product: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        stock: Number
    },

    isRead: { type: Boolean, default: false },
    sender: { type: String },    // Name/ID of the sender
    courierName: { type: String }, // Optional: Name of courier for admin/courier messages
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
