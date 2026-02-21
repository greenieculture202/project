require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

// Read the old service file to get original products (bestsellers, etc)
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, 'old_service.ts'), 'utf8');
const match = content.match(/private allProducts.*?=\s*{([\s\S]*?)};[\s\S]*?getProducts/);

if (!match) {
    console.log('Could not find products data');
    process.exit(1);
}

// Write to a temporary file for processing
const productsData = `const allProducts = {${match[1]}};
module.exports = allProducts;`;

fs.writeFileSync('temp_products.js', productsData);

// Load the original products
const allProducts = require('./temp_products.js');

// Flatten all original products
const productsToSeed = [];
Object.keys(allProducts).forEach(category => {
    allProducts[category].forEach(product => {
        // We keep original products as they are (Bestsellers, etc)
        productsToSeed.push(product);
    });
});

console.log(`Original products loaded: ${productsToSeed.length}`);

// Helper function to create product
const createProduct = (name, category, price, originalPrice, image, hoverImage, tags = []) => ({
    name,
    category,
    price: price.toString(),
    originalPrice: originalPrice.toString(),
    discount: `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`,
    discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
    image,
    hoverImage,
    tags
});

// Comprehensive image library
const productImages = {
    pots: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
    ]
};

// --- MEGA MENU ITEMS (EXACT NAMES) ---

// ACCESSORIES
const accessories = {
    'Accessories Plants': [
        // Pots & Planters
        'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots',
        'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters',
        'Decorative Planters', 'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters',
        // Watering
        'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit',
        'Sprinkler', 'Water Pump', 'Mist Sprayer', 'Automatic Water Timer', 'Soaker Hose',
        'Water Pipe', 'Hose Connector', 'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer',
        // Support
        'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net',
        'Frost Cover', 'Plant Cover Bag', 'Tree Guard', 'Bamboo Stakes', 'Wire Support Ring',
        'Plant Tie', 'Mulching Sheet', 'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen',
        // Lighting
        'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
        'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel',
        'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light',
        'Smart Grow Light', 'Light Controller', 'Heat Lamp',
        // Decorative
        'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue',
        'Decorative Stones', 'Pebbles', 'Plant Tray', 'Moss Decoration', 'Terrarium Glass',
        'Garden Lights', 'Balcony Stand', 'Vertical Frame', 'Garden Border Fence', 'Plant Labels'
    ]
};

Object.keys(accessories).forEach(cat => {
    accessories[cat].forEach((item, idx) => {
        productsToSeed.push(createProduct(item, cat, 149 + (idx * 20), 249 + (idx * 30), productImages.pots[idx % 4], productImages.pots[(idx + 1) % 4], ['Premium', 'Durable']));
    });
});

// SEEDS (EXACT NAMES)
const seeds = {
    'Vegetable Seeds': ['Spinach (Palak)', 'Fenugreek (Methi)', 'Coriander (Dhaniya)', 'Lettuce', 'Mustard Greens (Sarson)', 'Tomato (Tamatar)', 'Chilli (Mirch)', 'Capsicum (Shimla Mirch)', 'Brinjal (Baingan)', 'Cucumber (Kheera)'],
    'Fruit Seeds': ['Mango (Aam)', 'Apple (Seb)', 'Orange (Santra)', 'Papaya', 'Guava (Amrood)', 'Pomegranate (Anar)', 'Watermelon (Tarbooj)', 'Muskmelon (Kharbooja)', 'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry'],
    'Herb Seeds': ['Coriander (Dhaniya)', 'Mint (Pudina)', 'Basil (Tulsi)', 'Parsley', 'Thyme', 'Oregano', 'Rosemary', 'Sage', 'Ashwagandha', 'Chamomile', 'Lemongrass', 'Aloe Vera'],
    'Flower Seeds': ['Marigold (Genda)', 'Sunflower', 'Rose', 'Zinnia', 'Petunia', 'Cosmos', 'Daisy', 'Pansy', 'Hibiscus (Gudhal)', 'Balsam (Gulmehendi)', 'Portulaca (Moss Rose)', 'Gomphrena'],
    'Microgreen Seeds': ['Mustard (Sarson)', 'Radish (Mooli)', 'Broccoli', 'Cabbage (Patta Gobhi)', 'Fenugreek (Methi)', 'Peas (Matar)', 'Sunflower', 'Radish', 'Mustard', 'Methi', 'Peas']
};

Object.keys(seeds).forEach(cat => {
    seeds[cat].forEach((item, idx) => {
        productsToSeed.push(createProduct(item, cat, 49 + (idx * 5), 99 + (idx * 10), productImages.seeds[idx % 3], productImages.seeds[(idx + 1) % 3], ['Organic', 'High Germination']));
    });
});

// GARDENING (EXACT NAMES)
const gardening = {
    'Gardening': [
        'Rose (Gulab)', 'Marigold (Genda)', 'Jasmine (Mogra)', 'Petunia', 'Sunflower',
        'Tulsi (Holy Basil)', 'Curry Leaves (Kadi Patta)', 'Aloe Vera', 'Lemon Plant', 'Mint (Pudina)',
        'Areca Palm', 'Ferns', 'Bamboo Palm', 'Croton', 'Cypress',
        'Bougainvillea', 'Hibiscus (Gudhal)', 'Coleus', 'Golden Pothos', 'Song of India'
    ]
};

Object.keys(gardening).forEach(cat => {
    gardening[cat].forEach((item, idx) => {
        productsToSeed.push(createProduct(item, cat, 199 + (idx * 50), 299 + (idx * 80), productImages.pots[idx % 4], productImages.pots[(idx + 1) % 4], ['Healthy', 'Home Grown']));
    });
});

// SOIL, TOOLS, FERTILIZERS (EXACT NAMES)
const others = {
    'Soil & Growing Media': ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix', 'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure', 'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'],
    'Fertilizers & Nutrients': ['Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer', 'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix', 'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'],
    'Gardening Tools': ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower']
};

Object.keys(others).forEach(cat => {
    others[cat].forEach((item, idx) => {
        productsToSeed.push(createProduct(item, cat, 149 + (idx * 30), 249 + (idx * 40), productImages.tools[idx % 2], productImages.tools[(idx + 1) % 2], ['Essential', 'Quality Check']));
    });
});

// INDOOR, OUTDOOR, FLOWERING (SYNC WITH NAVBAR NAMES)
const plants = {
    'Indoor Plants': ['Snake Plant', 'Money Plant', 'Areca Palm', 'Aloe Vera', 'Peace Lily', 'Spider Plant', 'Rubber Plant', 'ZZ Plant', 'Jade Plant', 'Lucky Bamboo', 'Chinese Evergreen', 'Dracaena', 'Anthurium', 'Boston Fern', 'Calathea', 'Philodendron', 'Croton', 'Fiddle Leaf Fig', 'English Ivy', 'Orchid'],
    'Outdoor Plants': ['Ashoka Tree', 'Neem Tree', 'Mango Tree', 'Guava Plant', 'Coconut Tree', 'Banyan Tree', 'Peepal Tree', 'Palm Tree', 'Bamboo Plant', 'Tulsi Plant', 'Curry Leaf Plant', 'Lemon Plant', 'Papaya Plant', 'Banana Plant', 'Aloe Vera', 'Snake Plant', 'Hibiscus', 'Bougainvillea', 'Areca Palm', 'Croton'],
    'Flowering Plants': ['Peace Lily', 'Anthurium', 'Orchid', 'Kalanchoe', 'Begonia', 'Geranium', 'African Violet', 'Jasmine (Indoor Variety)', 'Bromeliad', 'Amaryllis', 'Christmas Cactus', 'Crown of Thorns', 'Clivia', 'Gloxinia', 'Flamingo Flower', 'Cyclamen', 'Impatiens', 'Lipstick Plant', 'Hoya', 'Anthurium Lily'],
    'XL Plants': ['Fiddle Leaf Fig XL', 'Rubber Plant XL', 'Monstera Deliciosa XL', 'Bird of Paradise XL', 'Snake Plant XL', 'Dragon Tree XL']
};

Object.keys(plants).forEach(cat => {
    plants[cat].forEach((item, idx) => {
        let price = 299 + (idx * 50);
        let originalPrice = 499 + (idx * 70);

        // Higher price for XL plants
        if (cat === 'XL Plants') {
            price = 999 + (idx * 100);
            originalPrice = 1499 + (idx * 150);
        }

        productsToSeed.push(createProduct(item, cat, price, originalPrice, productImages.pots[idx % 4], productImages.pots[(idx + 1) % 4], ['Live Plant', 'Decor']));
    });
});

console.log(`Total items to seed: ${productsToSeed.length}`);

// Seed Database
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB...');
        await Product.deleteMany({});
        console.log('🗑️ Products cleared');
        await Product.insertMany(productsToSeed);
        console.log('🚀 Database Seeded Successfully!');
        fs.unlinkSync('temp_products.js');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
