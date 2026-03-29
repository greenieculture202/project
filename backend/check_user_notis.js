const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const NotificationSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', NotificationSchema);

async function checkNotifications() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({ fullName: String, email: String }));
        const user = await User.findOne({ fullName: /Nikita/i });
        
        if (!user) {
            console.log('User Nikita not found');
            return;
        }

        console.log(`Found User: ${user.fullName} (${user._id})`);

        const notifications = await Notification.find({ userId: user._id });
        console.log(`Total notifications for user: ${notifications.length}`);
        notifications.forEach(n => {
            console.log(`- [${n.isRead ? 'READ' : 'UNREAD'}] ${n.title}: ${n.message} (${n.createdAt})`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkNotifications();
