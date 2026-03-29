const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const Product = require('./models/Product');
const Faq = require('./models/Faq');
const AboutSection = require('./models/AboutSection');

async function syncAtlas() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in .env');

        console.log('Connecting to Atlas...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB Atlas');

        // 1. Sync Products from all_products_dump.json
        console.log('\n📦 Syncing Products...');
        const productsDump = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));
        console.log(`- Loaded ${productsDump.length} products from dump.`);
        
        await Product.deleteMany({});
        await Product.insertMany(productsDump);
        console.log('- Successfully re-populated all products.');

        // 2. Sync FAQs (Full 30 from project source)
        console.log('\n❓ Syncing FAQs...');
        const bulkFaqs = [
            { category: 'Orders', question: 'How do I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard.' },
            { category: 'Orders', question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 2 hours of placement. After that, please contact support for assistance.' },
            { category: 'Orders', question: 'How do I change my delivery address?', answer: 'Address changes are possible only if the order has not been dispatched. Contact support within 1 hour.' },
            { category: 'Orders', question: 'Do you offer bulk discounts?', answer: 'Yes, for orders of 10+ items, please email bulk@greenieculture.com for special pricing.' },
            { category: 'Orders', question: 'Where is my invoice?', answer: 'An invoice is emailed to you after confirmation and is also available in your User Dashboard.' },
            { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, and Cash on Delivery.' },
            { category: 'Payment', question: 'Is my payment secure?', answer: 'Yes, we use industry-standard SSL encryption and never store your card details.' },
            { category: 'Payment', question: 'My payment failed but amount was deducted.', answer: 'Refunds for failed transactions are usually processed within 5-7 business days by your bank.' },
            { category: 'Payment', question: 'Are there any hidden charges?', answer: 'No, the price at checkout includes all taxes. Shipping is free on orders above ₹499.' },
            { category: 'Payment', question: 'Do you offer EMI options?', answer: 'Currently, we do not offer EMI, but we are working on adding it soon.' },
            { category: 'Delivery', question: 'How long does delivery take?', answer: 'Standard delivery takes 3-7 business days. Metro cities may receive orders sooner.' },
            { category: 'Delivery', question: 'Which courier partners do you use?', answer: 'We work with BlueDart, Delhivery, and Ecom Express to ensure safe plant delivery.' },
            { category: 'Delivery', question: 'What if my plant arrives damaged?', answer: 'Send us a photo of the damaged plant within 24 hours for a free replacement.' },
            { category: 'Delivery', question: 'Do you deliver on holidays?', answer: 'Deliveries usually happen on business days, but some partners may deliver on weekends.' },
            { category: 'Delivery', question: 'Can I schedule a delivery time?', answer: 'Currently, we cannot guarantee specific time slots, but the courier will call before arrival.' },
            { category: 'Plants', question: 'How much sunlight do indoor plants need?', answer: 'Most prefer bright, indirect light. Avoid harsh direct sun which can burn leaves.' },
            { category: 'Plants', question: 'How often should I water my plants?', answer: 'Check the soil moisture; water when the top inch feels dry. Frequency varies by plant type.' },
            { category: 'Plants', question: 'Are these plants safe for pets?', answer: 'Check the "Pet Safe" badge on product pages. Some like Areca Palm are safe, others like Lily are not.' },
            { category: 'Plants', question: 'Do plants come with pots?', answer: 'Most are shipped in nursery pots. Premium planters can be purchased separately.' },
            { category: 'Plants', question: 'Why are my plant leaves turning yellow?', answer: 'This could be due to overwatering or light changes. Give it 2 weeks to adjust to new spots.' },
            { category: 'Returns', question: 'What is your return policy?', answer: 'We offer replacements for damaged plants within 7 days. Returns for healthy plants are not accepted.' },
            { category: 'Returns', question: 'How do I report a damaged item?', answer: 'Go to My Orders -> Report Issue and upload a photo of the damaged product.' },
            { category: 'Returns', question: 'Can I exchange a planter?', answer: 'Yes, unused planters can be exchanged within 7 days. Shipping charges may apply.' },
            { category: 'Returns', question: 'How long do refunds take?', answer: 'Once approved, refunds reflect in your original payment method within 5-7 business days.' },
            { category: 'Returns', question: 'Do i need to return the nursery pot?', answer: 'No, if a replacement is sent, you can keep the original nursery pot.' },
            { category: 'Account', question: 'How do I create an account?', answer: 'Click the Profile icon -> Register. Use your email or Google account to sign up.' },
            { category: 'Account', question: 'I forgot my password.', answer: 'Use the "Forgot Password" link on the login page to receive a reset link.' },
            { category: 'Account', question: 'How do I update my address?', answer: 'Log in and go to User Dashboard -> Saved Addresses to manage your locations.' },
            { category: 'Account', question: 'Can I delete my account?', answer: 'Yes, contact support@greenieculture.com to request account deactivation.' },
            { category: 'Account', question: 'How do I track my rewards?', answer: 'Your loyalty points are visible in the "Rewards" section of your User Dashboard.' }
        ];

        await Faq.deleteMany({});
        await Faq.insertMany(bulkFaqs);
        console.log(`- Successfully added ${bulkFaqs.length} FAQs.`);

        // 3. Sync About Sections
        console.log('\n📖 Syncing About Sections...');
        const aboutSections = [
            { type: 'journey', title: 'Rooted in Passion, Growing with Purpose', content: 'Greenie Culture was born out of a simple realization: in our fast-paced digital world, we are losing our connection to the living, breathing world around us. Our journey began in 2024 with a mission to bridge this gap.', image: '/images/rooted_passion.png', order: 1 },
            { type: 'value', title: 'Sustainable Sourcing', content: 'We work directly with local nurseries to ensure every plant is raised with love and environmental responsibility.', icon: 'fa-leaf', order: 2 },
            { type: 'value', title: 'Quality Care', content: 'Each product is rigorously tested to meet our high standards of durability and botanical health.', icon: 'fa-hand-holding-heart', order: 3 },
            { type: 'value', title: 'Community First', content: 'More than just a store, we are a community of plant lovers sharing knowledge and growth together.', icon: 'fa-users', order: 4 },
            { type: 'stat', title: 'Happy Planters', content: '5k+', icon: 'fa-users-viewfinder', order: 5 },
            { type: 'stat', title: 'Plant Varieties', content: '200+', icon: 'fa-seedling', order: 6 },
            { type: 'stat', title: 'Gardening Tools', content: '1k+', icon: 'fa-tools', order: 7 },
            { type: 'stat', title: 'User Rating', content: '4.8★', icon: 'fa-star', order: 8 },
            { type: 'founder', title: 'HAN, Visionary & Founder', content: 'Our goal at Greenie Culture is not just to sell plants, but to help you build a sanctuary for your soul. Nature is the best therapy, and we are here to bring it right to your doorstep.', image: '/images/founder_han.png', author: 'HAN', order: 9 },
            { type: 'quote', title: 'Audrey Hepburn', content: 'To plant a garden is to believe in tomorrow.', author: 'Audrey Hepburn', order: 10 }
        ];
        
        await AboutSection.deleteMany({});
        await AboutSection.insertMany(aboutSections);
        console.log(`- Successfully added ${aboutSections.length} About sections.`);

        // 4. Offer Tags (CRITICAL)
        console.log('\n🏷️  Applying Offer Tags (Standardizing for 6 Plants)...');
        const offerCodes = ['G-BOGO-6-SECTION', 'G-INDOOR-6-SEC', 'G-GARDEN-6-SEC', 'G-FLOWER-6-SEC'];
        await Product.updateMany({}, { $pull: { tags: { $in: offerCodes } } });

        const targets = [
            { code: 'G-INDOOR-6-SEC', names: ['Peace Lily', 'Snake Plant', 'Areca Palm', 'Rubber Plant', 'Money Plant', 'ZZ Plant'] },
            { code: 'G-BOGO-6-SECTION', names: ['Fiddle Leaf Fig', 'Monstera Deliciosa', 'ZZ Plant', 'Rubber Plant', 'Areca Palm', 'Boston Fern'] },
            { code: 'G-GARDEN-6-SEC', names: ['Hand Trowel', 'Garden Fork', 'Pruning Shears', 'Garden Scissors', 'Soil Scoop', 'Dibber', 'Spade'] },
            { code: 'G-FLOWER-6-SEC', names: ['Marigold', 'Sunflower', 'Zinnia', 'Petunia', 'Rose', 'Hibiscus'] }
        ];

        for (const target of targets) {
            let countTotal = 0;
            for (const name of target.names) {
                const p = await Product.findOne({ name: new RegExp('^' + name, 'i'), tags: { $ne: target.code } });
                if (p) {
                    await Product.findByIdAndUpdate(p._id, { $addToSet: { tags: target.code } });
                    countTotal++;
                    if (countTotal >= 6) break;
                }
            }
            console.log(`- Tagged ${countTotal} products for ${target.code}`);
        }

        console.log('\n✅ ATLAS SYNCHRONIZATION COMPLETE!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Sync Error:', err);
        process.exit(1);
    }
}

syncAtlas();
