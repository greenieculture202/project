const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const navbarData = {
    'Indoor': [
        'Snake Plant', 'Money Plant', 'Areca Palm', 'Aloe Vera', 'Peace Lily',
        'Spider Plant', 'Rubber Plant', 'ZZ Plant', 'Jade Plant', 'Lucky Bamboo',
        'Chinese Evergreen', 'Dracaena', 'Anthurium', 'Boston Fern', 'Calathea',
        'Philodendron', 'Croton', 'Fiddle Leaf Fig', 'English Ivy', 'Orchid'
    ],
    'Outdoor': [
        'Ashoka Tree', 'Neem Tree', 'Mango Tree', 'Guava Plant', 'Coconut Tree',
        'Banyan Tree', 'Peepal Tree', 'Palm Tree', 'Bamboo Plant', 'Tulsi Plant',
        'Curry Leaf Plant', 'Lemon Plant', 'Papaya Plant', 'Banana Plant', 'Aloe Vera',
        'Snake Plant', 'Hibiscus', 'Bougainvillea', 'Areca Palm', 'Croton'
    ],
    'Flowering': [
        'Peace Lily', 'Anthurium', 'Orchid', 'Kalanchoe', 'Begonia',
        'Geranium', 'African Violet', 'Jasmine (Indoor Variety)', 'Bromeliad', 'Amaryllis',
        'Christmas Cactus', 'Crown of Thorns', 'Clivia', 'Gloxinia', 'Flamingo Flower',
        'Cyclamen', 'Impatiens', 'Lipstick Plant', 'Hoya', 'Anthurium Lily'
    ],
    'Gardening': [
        'Rose (Gulab)', 'Marigold (Genda)', 'Jasmine (Mogra)', 'Petunia', 'Sunflower',
        'Tulsi (Holy Basil)', 'Curry Leaves (Kadi Patta)', 'Aloe Vera', 'Lemon Plant', 'Mint (Pudina)',
        'Areca Palm', 'Ferns', 'Bamboo Palm', 'Croton', 'Cypress',
        'Bougainvillea', 'Hibiscus (Gudhal)', 'Coleus', 'Golden Pothos', 'Song of India'
    ]
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected to MongoDB. Finding products missing required tags...");
    let updatedCount = 0;

    for (const [category, plants] of Object.entries(navbarData)) {
        // Find products whose names match exactly any item in this category's array
        // and add the target category to their 'tags' array if not already present.
        const targetTag = category === 'Gardening' ? 'Gardening' : `${category} Plants`;

        for (const plantName of plants) {
            // Check if product exists
            let p = await Product.findOne({ name: plantName });
            if (p && !p.tags.includes(targetTag)) {
                // Not using category to overwrite since it might break 'Bestsellers' logic etc
                // Just inserting in tags which the API uses for finding the items
                p.tags.push(targetTag);
                await p.save();
                updatedCount++;
                console.log(`Added tag "${targetTag}" to ${plantName}`);
            }
        }
    }

    console.log(`\nAll done! Updated ${updatedCount} products.`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
