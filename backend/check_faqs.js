
const mongoose = require('mongoose');
const Faq = require('./models/Faq');
require('dotenv').config();

async function checkFaqs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Faq.countDocuments();
        const faqs = await Faq.find().lean();
        console.log(`Total FAQs: ${count}`);
        console.log(JSON.stringify(faqs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkFaqs();
