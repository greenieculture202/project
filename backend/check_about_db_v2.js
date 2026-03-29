const mongoose = require('mongoose');
const AboutSection = require('./models/AboutSection');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mejor';

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const sections = await AboutSection.find({ type: 'founder' });
        console.log(JSON.stringify(sections, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

check();
