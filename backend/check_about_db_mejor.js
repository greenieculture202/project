const mongoose = require('mongoose');

async function checkAboutSections() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB (mejor)');

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
            console.log(`- [${s.type}] ${s.title} (Order: ${s.order}) - ID: ${s._id}`);
            console.log(`  Content: ${s.content.substring(0, 50)}...`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkAboutSections();
