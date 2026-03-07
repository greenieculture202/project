const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });

async function setFaqOrder() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Faq = mongoose.model('Faq', new mongoose.Schema({}, { strict: false }));

        // Find all FAQs sorted by category then by creation date
        const faqs = await Faq.find({}).sort({ category: 1, createdAt: 1 });

        console.log(`Found ${faqs.length} FAQs. Setting order...`);

        // Update each FAQ with a sequential order
        for (let i = 0; i < faqs.length; i++) {
            const faq = faqs[i];
            const newOrder = i + 1;
            await Faq.findByIdAndUpdate(faq._id, { $set: { order: newOrder } });
            console.log(`[Order: ${newOrder}] [${faq.category}] ${faq.question.substring(0, 50)}...`);
        }

        console.log('✅ Successfully updated all FAQ orders.');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

setFaqOrder();
