const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function listFaqs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Faq = mongoose.model('Faq', new mongoose.Schema({}, { strict: false }));
        const faqs = await Faq.find({}).sort({ category: 1, createdAt: 1 });
        console.log(JSON.stringify(faqs, null, 2));
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listFaqs();
