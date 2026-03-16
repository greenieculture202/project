const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const fs = require('fs');

async function check() {
    await mongoose.connect('mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority');
    const notis = await Notification.find({ type: 'admin' }).sort({ createdAt: -1 });
    fs.writeFileSync('notis_dump.json', JSON.stringify(notis, null, 2));
    process.exit(0);
}

check();
