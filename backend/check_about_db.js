const mongoose = require('mongoose');

async function checkAboutSections() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greenie_culture');
        console.log('Connected to MongoDB');

        const AboutSectionSchema = new mongoose.Schema({
            type: String,
            title: String,
            content: String,
            image: String,
            icon: String,
            author: String,
            order: Number
        }, { collection: 'aboutsections' });

        const AboutSection = mongoose.model('AboutSection', AboutSectionSchema);

        const sections = await AboutSection.find({});
        console.log('Found', sections.length, 'About Us sections:');
        sections.forEach(s => {
            console.log(`- [${s.type}] ${s.title} (Order: ${s.order})`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkAboutSections();
