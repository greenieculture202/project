const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        const user = await User.findOne({ fullName: /radha Ganesh/i });
        if (user) {
            console.log('USER_ID:', user._id.toString());
        } else {
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log('USER_ID:', anyUser._id.toString());
            } else {
                console.log('NO_USER_FOUND');
            }
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
