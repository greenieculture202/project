const mongoose = require('mongoose');
const AboutSection = require('./models/AboutSection');

async function checkModelCollection() {
    try {
        console.log('Collection name from model:', AboutSection.collection.name);
        await mongoose.connect('mongodb://localhost:27017/mejor');
        const count = await AboutSection.countDocuments({});
        console.log('Count from model.countDocuments:', count);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
checkModelCollection();
