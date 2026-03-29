const mongoose = require('mongoose');
const Placement = require('./models/Placement');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function listPlacements() {
    try {
        await mongoose.connect(MONGODB_URI);
        const placements = await Placement.find({});
        console.log('Placements:', JSON.stringify(placements, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listPlacements();
