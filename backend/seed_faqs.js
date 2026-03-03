
const mongoose = require('mongoose');
const Faq = require('./models/Faq');
require('dotenv').config();

const newFaqs = [
    { category: 'Orders', question: 'How do I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard.', order: 1 },
    { category: 'Orders', question: 'Can I change my delivery address after ordering?', answer: 'Address changes are only possible within 2 hours of placing the order. Please contact support immediately.', order: 2 },
    { category: 'Payment', question: 'Are there any hidden charges?', answer: 'No, the price you see at checkout is final. It includes all taxes.', order: 1 },
    { category: 'Payment', question: 'Do you offer Cash on Delivery (COD)?', answer: 'Yes, we offer COD for most pin codes across India.', order: 2 },
    { category: 'Delivery', question: 'What happens if my plant arrives damaged?', answer: 'We ensure safe packaging, but if a plant is damaged, send us a photo within 24 hours for a free replacement.', order: 1 },
    { category: 'Delivery', question: 'Do you deliver on Sundays?', answer: 'Standard delivery happens on business days, but some courier partners may deliver on Sundays depending on your location.', order: 2 },
    { category: 'Plants', question: 'How much sunlight does my indoor plant need?', answer: 'Most indoor plants prefer bright, indirect sunlight. Avoid direct afternoon sun as it can scorch the leaves.', order: 1 },
    { category: 'Plants', question: 'How often should I water my plants?', answer: 'Watering depends on the plant type. Generally, water when the top inch of soil feels dry.', order: 2 },
    { category: 'Returns', question: 'Can I return a plant if I don\'t like it?', answer: 'Since plants are live products, we only offer replacements for damaged items, not returns for change of mind.', order: 1 },
    { category: 'Account', question: 'How do I delete my account?', answer: 'To delete your account, please send a request to support@greenieculture.com.', order: 5 },
    { category: 'Account', question: 'Can I have multiple shipping addresses?', answer: 'Yes, you can save and manage multiple addresses in your account settings.', order: 6 }
];

async function seedFaqs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        // Check if there are already some of these to avoid duplicates
        for (const faq of newFaqs) {
            const exists = await Faq.findOne({ question: faq.question });
            if (!exists) {
                await Faq.create(faq);
                console.log(`Added: ${faq.question}`);
            } else {
                console.log(`Skipped (exists): ${faq.question}`);
            }
        }
        console.log('Done seeding FAQs.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedFaqs();
