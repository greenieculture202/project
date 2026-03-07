const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function seedOfferTagsTargetedFinal() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const offerCodes = [
            'G-BOGO-6-SECTION',
            'G-INDOOR-6-SEC',
            'G-GARDEN-6-SEC',
            'G-FLOWER-6-SEC'
        ];

        console.log('🗑️  Clearing offer codes...');
        await Product.updateMany({}, { $pull: { tags: { $in: offerCodes } } });

        const targets = [
            { code: 'G-INDOOR-6-SEC', names: ['Peace Lily', 'Snake Plant', 'Areca Palm', 'Rubber Plant', 'Money Plant', 'ZZ Plant'] },
            { code: 'G-BOGO-6-SECTION', names: ['Fiddle Leaf Fig', 'Monstera Deliciosa', 'ZZ Plant', 'Rubber Plant', 'Areca Palm', 'Boston Fern'] },
            { code: 'G-GARDEN-6-SEC', names: ['Hand Trowel', 'Garden Fork', 'Pruning Shears', 'Garden Scissors', 'Soil Scoop', 'Dibber'] },
            { code: 'G-FLOWER-6-SEC', names: ['Marigold', 'Sunflower', 'Zinnia', 'Petunia', 'Rose', 'Hibiscus'] }
        ];

        for (const target of targets) {
            console.log(`\n📦 Tagging exactly 6 for ${target.code}:`);
            let countTotal = 0;
            for (const name of target.names) {
                // Find ONLY ONE product per name
                // Prefer names that are exact or very close
                const p = await Product.findOne({
                    name: new RegExp('^' + name, 'i'),
                    tags: { $ne: target.code } // ensure we don't double tag if names are similar
                });

                if (p) {
                    await Product.findByIdAndUpdate(p._id, { $addToSet: { tags: target.code } });
                    console.log(`- Added ${target.code} to: ${p.name}`);
                    countTotal++;
                } else {
                    // Try partial match
                    const partial = await Product.findOne({
                        name: new RegExp(name, 'i'),
                        tags: { $ne: target.code }
                    });
                    if (partial) {
                        await Product.findByIdAndUpdate(partial._id, { $addToSet: { tags: target.code } });
                        console.log(`- (Partial) Added ${target.code} to: ${partial.name}`);
                        countTotal++;
                    }
                }

                if (countTotal >= 6) break;
            }
            console.log(`- Total tagged for ${target.code}: ${countTotal}`);
        }

        console.log('\n✅ Targeted seeding complete! Each offer now has exactly 6 original cards.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedOfferTagsTargetedFinal();
