
const mongoose = require('mongoose');
const Faq = require('./models/Faq');
require('dotenv').config();

const bulkFaqs = [
    // Orders
    { category: 'Orders', question: 'How do I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard.' },
    { category: 'Orders', question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 2 hours of placement. After that, please contact support for assistance.' },
    { category: 'Orders', question: 'How do I change my delivery address?', answer: 'Address changes are possible only if the order has not been dispatched. Contact support within 1 hour.' },
    { category: 'Orders', question: 'Do you offer bulk discounts?', answer: 'Yes, for orders of 10+ items, please email bulk@greenieculture.com for special pricing.' },
    { category: 'Orders', question: 'Where is my invoice?', answer: 'An invoice is emailed to you after confirmation and is also available in your User Dashboard.' },

    // Payment
    { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, and Cash on Delivery.' },
    { category: 'Payment', question: 'Is my payment secure?', answer: 'Yes, we use industry-standard SSL encryption and never store your card details.' },
    { category: 'Payment', question: 'My payment failed but amount was deducted.', answer: 'Refunds for failed transactions are usually processed within 5-7 business days by your bank.' },
    { category: 'Payment', question: 'Are there any hidden charges?', answer: 'No, the price at checkout includes all taxes. Shipping is free on orders above ₹499.' },
    { category: 'Payment', question: 'Do you offer EMI options?', answer: 'Currently, we do not offer EMI, but we are working on adding it soon.' },

    // Delivery
    { category: 'Delivery', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-7 business days. Metro cities may receive orders sooner.' },
    { category: 'Delivery', question: 'Which courier partners do you use?', answer: 'We work with BlueDart, Delhivery, and Ecom Express to ensure safe plant delivery.' },
    { category: 'Delivery', question: 'What if my plant arrives damaged?', answer: 'Send us a photo of the damaged plant within 24 hours for a free replacement.' },
    { category: 'Delivery', question: 'Do you deliver on holidays?', answer: 'Deliveries usually happen on business days, but some partners may deliver on weekends.' },
    { category: 'Delivery', question: 'Can I schedule a delivery time?', answer: 'Currently, we cannot guarantee specific time slots, but the courier will call before arrival.' },

    // Plants
    { category: 'Plants', question: 'How much sunlight do indoor plants need?', answer: 'Most prefer bright, indirect light. Avoid harsh direct sun which can burn leaves.' },
    { category: 'Plants', question: 'How often should I water my plants?', answer: 'Check the soil moisture; water when the top inch feels dry. Frequency varies by plant type.' },
    { category: 'Plants', question: 'Are these plants safe for pets?', answer: 'Check the "Pet Safe" badge on product pages. Some like Areca Palm are safe, others like Lily are not.' },
    { category: 'Plants', question: 'Do plants come with pots?', answer: 'Most are shipped in nursery pots. Premium planters can be purchased separately.' },
    { category: 'Plants', question: 'Why are my plant leaves turning yellow?', answer: 'This could be due to overwatering or light changes. Give it 2 weeks to adjust to new spots.' },

    // Returns
    { category: 'Returns', question: 'What is your return policy?', answer: 'We offer replacements for damaged plants within 7 days. Returns for healthy plants are not accepted.' },
    { category: 'Returns', question: 'How do I report a damaged item?', answer: 'Go to My Orders -> Report Issue and upload a photo of the damaged product.' },
    { category: 'Returns', question: 'Can I exchange a planter?', answer: 'Yes, unused planters can be exchanged within 7 days. Shipping charges may apply.' },
    { category: 'Returns', question: 'How long do refunds take?', answer: 'Once approved, refunds reflect in your original payment method within 5-7 business days.' },
    { category: 'Returns', question: 'Do I need to return the nursery pot?', answer: 'No, if a replacement is sent, you can keep the original nursery pot.' },

    // Account
    { category: 'Account', question: 'How do I create an account?', answer: 'Click the Profile icon -> Register. Use your email or Google account to sign up.' },
    { category: 'Account', question: 'I forgot my password.', answer: 'Use the "Forgot Password" link on the login page to receive a reset link.' },
    { category: 'Account', question: 'How do I update my address?', answer: 'Log in and go to User Dashboard -> Saved Addresses to manage your locations.' },
    { category: 'Account', question: 'Can I delete my account?', answer: 'Yes, contact support@greenieculture.com to request account deactivation.' },
    { category: 'Account', question: 'How do I track my rewards?', answer: 'Your loyalty points are visible in the "Rewards" section of your User Dashboard.' }
];

async function seedFaqs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing to ensure exactly 5 per category
        await Faq.deleteMany({});
        console.log('Cleared existing FAQs.');

        await Faq.insertMany(bulkFaqs);
        console.log(`Successfully added ${bulkFaqs.length} FAQs!`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedFaqs();
