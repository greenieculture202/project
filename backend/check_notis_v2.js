const mongoose = require('mongoose');
const Notification = require('./models/Notification');

async function check() {
    await mongoose.connect('mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority');
    
    console.log('--- ALL RELEVANT ADMIN NOTIFICATIONS ---');
    const notis = await Notification.find({ 
        $or: [
            { userId: 'admin' },
            { type: 'admin' },
            { type: 'LowStock' }
        ] 
    }).sort({ createdAt: -1 }).limit(10);
    
    console.log(JSON.stringify(notis, null, 2));
    
    console.log('\n--- COUNT BY TYPE ---');
    const counts = await Notification.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    console.log(counts);
    
    process.exit(0);
}

check();
