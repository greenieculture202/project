const mongoose = require('mongoose');
async function checkGreenieShort() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greenie');
        console.log('Connected to greenie');

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
        console.log('Count in greenie:', count);

        const sections = await AboutSection.find({}).lean();
        sections.forEach(s => {
            console.log(`- [${s.type}] ${s.title}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
checkGreenieShort();
