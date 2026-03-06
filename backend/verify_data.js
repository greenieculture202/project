const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function verify() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to:', MONGO_URI);

        const Faq = mongoose.model('Faq', new mongoose.Schema({ question: String }, { collection: 'faqs' }));
        const AboutSection = mongoose.model('AboutSection', new mongoose.Schema({ title: String }, { collection: 'aboutsections' }));

        const faqCount = await Faq.countDocuments();
        const aboutCount = await AboutSection.countDocuments();

        console.log(`FAQs stored: ${faqCount}`);
        console.log(`About Sections stored: ${aboutCount}`);

        const faqs = await Faq.find().limit(2);
        console.log('Sample FAQs:');
        faqs.forEach(f => console.log(' -', f.question));

        const abouts = await AboutSection.find().limit(2);
        console.log('Sample About Sections:');
        abouts.forEach(a => console.log(' -', a.title));

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

verify();
