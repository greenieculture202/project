const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Testing connection to:', MONGODB_URI.split('@')[1] || MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected successfully to:', mongoose.connection.name);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });
