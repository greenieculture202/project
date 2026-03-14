const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to:', uri.replace(/\/\/.*@/, '//***@'));

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Fast timeout for testing
})
    .then(() => {
        console.log('✅ Connection successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:');
        console.error(err.message);
        if (err.reason) {
            console.error('Reason:', JSON.stringify(err.reason, null, 2));
        }
        process.exit(1);
    });
