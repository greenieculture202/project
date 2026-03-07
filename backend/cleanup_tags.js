const mongoose = require('mongoose');
require('dotenv').config();

// Codes and their corresponding offer landing pages
const MAPPING = [
    { code: 'G-BOGO-6-SECTION', category: 'Bestsellers', ctaLink: '/bogo-offer' },
    { code: 'G-INDOOR-6-SEC', category: 'Indoor Plants', ctaLink: '/indoor-offer' },
    { code: 'G-GARDEN-6-SEC', category: 'Gardening Tools', ctaLink: '/garden-offer' },
    { code: 'G-FLOWER-6-SEC', category: 'Flowering Plants', ctaLink: '/flowering-offer' }
];

const CODES = MAPPING.map(m => m.code);

async function cleanupAndSeed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const productsCollection = mongoose.connection.collection('products');
        const offersCollection = mongoose.connection.collection('offers');

        console.log('--- Step 1: Cleaning existing offer data ---');
        // Clear tags from products
        await productsCollection.updateMany(
            { tags: { $in: CODES } },
            { $pull: { tags: { $in: CODES } } }
        );
        // Clear products field from offers
        await offersCollection.updateMany({}, { $set: { products: [] } });

        console.log('--- Step 2: Seeding 4 products per offer ---');
        for (const item of MAPPING) {
            // Find 4 products in this category
            const products = await productsCollection
                .find({ category: { $regex: new RegExp(item.category, 'i') } })
                .limit(4)
                .toArray();

            if (products.length > 0) {
                const ids = products.map(p => p._id);
                // 1. Tag the products in the products collection
                await productsCollection.updateMany(
                    { _id: { $in: ids } },
                    { $addToSet: { tags: item.code } }
                );

                // 2. Store the product list in the offer document (so it's visible in Compass)
                // Simplify product objects to avoid massive documents
                const simplifiedProducts = products.map(p => ({
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    tags: p.tags
                }));

                const offerUpdateResult = await offersCollection.updateOne(
                    { ctaLink: item.ctaLink },
                    { $set: { products: simplifiedProducts } }
                );

                console.log(`[${item.code}]: Tagged ${products.length} products. Offer updated: ${offerUpdateResult.matchedCount > 0}`);
            } else {
                console.log(`[${item.code}]: No products found for category ${item.category}`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupAndSeed();
