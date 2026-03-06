const mongoose = require('mongoose');
async function checkGreenie() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greenie_culture');
        console.log('Connected to greenie_culture');

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

        const count = await AboutSection.countDocuments({});
        console.log('Count in greenie_culture:', count);

        const sections = await AboutSection.find({}).lean();
        sections.forEach(s => {
            console.log(`- [${s.type}] ${s.title}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
checkGreenie();
