const mongoose = require('mongoose');

const plantReminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plantName: { type: String, required: true },
    problemType: { type: String, required: true },
    reminderType: { 
        type: String, 
        enum: ['water', 'fertilizer', 'sunlight', 'general', 'health'], 
        required: true 
    },
    reminderDate: { type: Date, required: true },
    notificationStatus: { 
        type: String, 
        enum: ['pending', 'sent', 'dismissed'], 
        default: 'pending' 
    },
    sequenceId: { type: String, required: true },
    userAction: { 
        type: String, 
        enum: ['none', 'continued', 'stopped'], 
        default: 'none' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlantReminder', plantReminderSchema);
