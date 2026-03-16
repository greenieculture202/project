const mongoose = require('mongoose');
require('dotenv').config();
const PlantReminder = require('./models/PlantReminder');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function sendDemo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ fullName: /Radha/i });
        if (!user) {
            console.error('User Radha not found');
            return;
        }

        console.log(`Found user: ${user.fullName} (${user._id})`);

        // 1. Create Plant Reminder
        const reminder = new PlantReminder({
            userId: user._id,
            plantName: 'Snake Plant',
            problemType: 'Maintenance',
            reminderType: 'water',
            reminderDate: new Date(),
            notificationStatus: 'sent',
            sequenceId: 'DEMO-' + Date.now()
        });
        const savedReminder = await reminder.save();
        console.log('✅ PlantReminder created:', savedReminder._id);

        // 2. Create Notification
        const notification = new Notification({
            userId: user._id,
            type: 'Reminder',
            reminderId: savedReminder._id,
            title: '🌿 Water your Snake Plant!',
            message: 'Your Snake Plant is thirsty. Time for a quick watering session!',
            subType: 'water',
            isRead: false
        });
        await notification.save();
        console.log('✅ Notification created');

        console.log('\n--- DEMO COMPLETE ---');
        console.log('Radha will now see this reminder in her notifications/dashboard.');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

sendDemo();
