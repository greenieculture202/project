const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional, null means it's an admin notification
    type: { type: String, default: 'Reply' }, // 'Reply', 'LowStock', 'NewOrder', 'Reminder' etc.
    reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlantReminder' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedInquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },

    // Store sub-type for specific notification categories (e.g. Water, Fertilizer)
    subType: { type: String },

    // Store product details for stock/order notifications
    product: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        stock: Number
    },

    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
