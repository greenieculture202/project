const mongoose = require('mongoose');
require('dotenv').config();
const PlantReminder = require('./models/PlantReminder');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function createReminders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ fullName: /Radha/i });
        if (!user) {
            console.error('User Radha not found');
            return;
        }

        console.log(`Found user: ${user.fullName} (${user._id})`);

        // Clear existing demo reminders for a fresh start if needed, 
        // but here we just add to the list as requested.

        const plants = [
            { name: 'Money Plant', type: 'water', status: 'sent', problem: 'Leaves turning yellow' },
            { name: 'Snake Plant', type: 'fertilizer', status: 'sent', problem: 'Slow growth' },
            { name: 'Aloe Vera', type: 'sunlight', status: 'pending', problem: 'Check sunlight exposure' },
            { name: 'Peace Lily', type: 'water', status: 'pending', problem: 'Soil is dry' },
            { name: 'Spider Plant', type: 'general', status: 'pending', problem: 'Routine health check' }
        ];

        for (const p of plants) {
            const reminder = new PlantReminder({
                userId: user._id,
                plantName: p.name,
                problemType: p.problem,
                reminderType: p.type,
                reminderDate: new Date(),
                notificationStatus: p.status,
                sequenceId: 'RADHA-DEMO-' + Math.random().toString(36).substr(2, 9)
            });
            const savedReminder = await reminder.save();
            console.log(`✅ Reminder created for ${p.name} (Status: ${p.status})`);

            if (p.status === 'sent') {
                const notification = new Notification({
                    userId: user._id,
                    type: 'Reminder',
                    reminderId: savedReminder._id,
                    title: `🌿 Care for your ${p.name}!`,
                    message: `Important: ${p.problem}. Please check your ${p.name} soon.`,
                    subType: p.type,
                    isRead: false
                });
                await notification.save();
                console.log(`🔔 Notification created for ${p.name}`);
            }
        }

        console.log('\n--- DATA GENERATION COMPLETE ---');
        console.log('Radha now has 2 sent and 3 pending reminders.');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

createReminders();
