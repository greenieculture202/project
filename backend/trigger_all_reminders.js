const mongoose = require('mongoose');
require('dotenv').config();

const ReminderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    plantName: String,
    reminderType: String,
    notificationStatus: String,
    reminderDate: Date
});

const NotificationSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.Mixed,
    type: { type: String, default: 'Reminder' },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', new mongoose.Schema({ fullName: String }));
const PlantReminder = mongoose.model('PlantReminder', ReminderSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

async function triggerReminders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const userIdStr = '69b0432993e8fc277983d59e';
        console.log(`Processing User ID: ${userIdStr}`);

        // Try both string and ObjectId to be safe
        const pending = await PlantReminder.find({ 
            userId: { $in: [userIdStr, new mongoose.Types.ObjectId(userIdStr)] },
            notificationStatus: 'pending' 
        });

        console.log(`Found ${pending.length} pending reminders`);

        for (const rem of pending) {
            const noti = new Notification({
                userId: user._id,
                type: 'Reminder',
                subType: rem.reminderType,
                title: `🌿 Plant Care: ${rem.plantName}`,
                message: `Hello! It's time to check your ${rem.plantName}. This is your ${rem.reminderType} reminder!`,
            });
            await noti.save();
            
            rem.notificationStatus = 'sent';
            await rem.save();
            console.log(`✅ Sent notification for ${rem.reminderType}`);
        }

        console.log('--- ALL REMINDERS TRIGGERED ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

triggerReminders();
