const mongoose = require('mongoose');
require('dotenv').config();
const PlantReminder = require('./models/PlantReminder');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function resetRadhaReminders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ fullName: /Radha/i });
        if (!user) {
            console.error('User Radha not found');
            return;
        }

        console.log(`Cleaning up data for user: ${user.fullName} (${user._id})`);

        // 1. Delete all previous reminders and notifications for this user
        await PlantReminder.deleteMany({ userId: user._id });
        await Notification.deleteMany({ userId: user._id });
        console.log('✅ Old reminders and notifications cleared.');

        // 2. Create exact set (2 sent, 3 pending)
        const plants = [
            { name: 'Money Plant', type: 'water', status: 'sent', problem: 'Check soil moisture' },
            { name: 'Snake Plant', type: 'fertilizer', status: 'sent', problem: 'Winter fertilization' },
            { name: 'Aloe Vera', type: 'sunlight', status: 'pending', problem: 'Check light exposure' },
            { name: 'Peace Lily', type: 'water', status: 'pending', problem: 'Check for drooping leaves' },
            { name: 'Spider Plant', type: 'general', status: 'pending', problem: 'Leaf trimming session' }
        ];

        for (const p of plants) {
            const reminder = new PlantReminder({
                userId: user._id,
                plantName: p.name,
                problemType: p.problem,
                reminderType: p.type,
                reminderDate: new Date(),
                notificationStatus: p.status,
                sequenceId: 'RADHA-FINAL-' + Math.random().toString(36).substr(2, 9)
            });
            const savedReminder = await reminder.save();
            console.log(`✅ Created ${p.status} reminder for ${p.name}`);

            if (p.status === 'sent') {
                const notification = new Notification({
                    userId: user._id,
                    type: 'Reminder',
                    reminderId: savedReminder._id,
                    title: `🌿 Care for your ${p.name}!`,
                    message: `Reminder: ${p.problem}. Your ${p.name} needs attention.`,
                    subType: p.type,
                    isRead: false
                });
                await notification.save();
            }
        }

        console.log('\n--- RESET COMPLETE ---');
        console.log('Total reminders for Radha: 5 (2 Sent / 3 Pending)');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

resetRadhaReminders();
