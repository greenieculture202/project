const mongoose = require('mongoose');
require('dotenv').config();

async function trigger() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const userId = '699f2699692ea32488bb1b71';
    
    // Notification Model
    const Notification = mongoose.model('Notification', new mongoose.Schema({
      userId: mongoose.Schema.Types.Mixed,
      type: { type: String, default: 'Reminder' },
      title: String,
      message: String,
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }));

    const types = ['Watering', 'Fertilizing', 'Sunlight', 'General Health'];
    for (const t of types) {
      await new Notification({
        userId,
        type: 'Reminder',
        title: `🌿 Plant Care: Soil Scoop`,
        message: `Time for your ${t} check! Proper care ensures a happy plant.`,
        isRead: false
      }).save();
    }
    
    console.log('✅ Triggered 4 reminders for Nikita Tank');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

trigger();
