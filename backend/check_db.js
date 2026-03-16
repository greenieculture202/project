const mongoose = require('mongoose');
const Settlement = require('./models/Settlement');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenieculture');
    const ss = await Settlement.find();
    console.log(JSON.stringify(ss, null, 2));
    process.exit(0);
}
run();
