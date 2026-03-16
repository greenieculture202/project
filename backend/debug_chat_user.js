const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUserAndChats() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        
        const user = await db.collection('users').findOne({ fullName: /radha/i });
        if (user) {
            console.log('FOUND USER:', user.fullName, '| ID:', user._id.toString());
            const chats = await db.collection('chatmessages').find({ userId: user._id }).toArray();
            console.log(`Found ${chats.length} chats for this user.`);
            if (chats.length > 0) {
                console.log('Last 5 messages:', JSON.stringify(chats.slice(-5), null, 2));
            }
        } else {
            console.log('User NOT FOUND matching "radha"');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUserAndChats();
