require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

// Read the old service file to get original products
const content = fs.readFileSync('old_service.ts', 'utf8');
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

// Sample images for new categories
const sampleImages = {
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
    ],
    fertilizer: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80'
    ],
    accessories: [
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ]
};

// Add Seeds category products
const seedsCategories = {
    'Vegetable Seeds': ['Spinach (Palak)', 'Fenugreek (Methi)', 'Coriander (Dhaniya)', 'Lettuce', 'Mustard Greens (Sarson)', 'Tomato (Tamatar)', 'Chilli (Mirch)', 'Capsicum (Shimla Mirch)', 'Brinjal (Baingan)', 'Cucumber (Kheera)'],
    'Fruit Seeds': ['Mango (Aam)', 'Apple (Seb)', 'Orange (Santra)', 'Papaya', 'Guava (Amrood)', 'Pomegranate (Anar)', 'Watermelon (Tarbooj)', 'Muskmelon (Kharbooja)', 'Strawberry', 'Blueberry'],
    'Herb Seeds': ['Coriander (Dhaniya)', 'Mint (Pudina)', 'Basil (Tulsi)', 'Parsley', 'Thyme', 'Oregano', 'Rosemary', 'Sage', 'Ashwagandha', 'Chamomile'],
    'Flower Seeds': ['Marigold (Genda)', 'Sunflower', 'Rose', 'Zinnia', 'Petunia', 'Cosmos', 'Daisy', 'Pansy', 'Hibiscus (Gudhal)', 'Balsam (Gulmehendi)'],
    'Microgreen Seeds': ['Mustard (Sarson)', 'Radish (Mooli)', 'Broccoli', 'Cabbage (Patta Gobhi)', 'Fenugreek (Methi)', 'Peas (Matar)', 'Sunflower']
};

Object.keys(seedsCategories).forEach((category) => {
    seedsCategories[category].forEach((seed, idx) => {
        productsToSeed.push(createProduct(
            `${seed} Seeds`,
            category,
            49 + (idx * 10),
            99 + (idx * 15),
            sampleImages.seeds[idx % sampleImages.seeds.length],
            sampleImages.seeds[(idx + 1) % sampleImages.seeds.length],
            ['Easy to Grow', 'High Germination', 'Organic']
        ));
    });
});

// Add Soil & Growing Media products
const soilProducts = [
    'Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix',
    'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure',
    'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'
];

soilProducts.forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Soil & Growing Media',
        99 + (idx * 50),
        199 + (idx * 70),
        sampleImages.soil[idx % sampleImages.soil.length],
        sampleImages.soil[(idx + 1) % sampleImages.soil.length],
        ['Organic', 'Nutrient Rich', 'Premium Quality']
    ));
});

// Add Fertilizers & Nutrients products
const fertilizerProducts = [
    'Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer',
    'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix',
    'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'
];

fertilizerProducts.forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Fertilizers & Nutrients',
        149 + (idx * 50),
        249 + (idx * 70),
        sampleImages.fertilizer[idx % sampleImages.fertilizer.length],
        sampleImages.fertilizer[(idx + 1) % sampleImages.fertilizer.length],
        ['Organic', 'Fast Acting', 'Plant Nutrition']
    ));
});

// Add Gardening Tools products
const gardeningTools = [
    'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter',
    'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife',
    'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'
];

gardeningTools.forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Gardening Tools',
        199 + (idx * 100),
        399 + (idx * 150),
        sampleImages.tools[idx % sampleImages.tools.length],
        sampleImages.tools[(idx + 1) % sampleImages.tools.length],
        ['Durable', 'Ergonomic', 'Professional Grade']
    ));
});

// Add Accessories products
const accessoriesProducts = [
    'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots',
    'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters',
    'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit',
    'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net',
    'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
    'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue'
];

accessoriesProducts.forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Accessories',
        99 + (idx * 50),
        199 + (idx * 80),
        sampleImages.accessories[idx % sampleImages.accessories.length],
        sampleImages.accessories[(idx + 1) % sampleImages.accessories.length],
        ['Premium Quality', 'Durable', 'Stylish']
    ));
});

console.log(`Total products to seed: ${productsToSeed.length}`);

// Seed the database
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB...');
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('📦 Seeding database with products...');
        await Product.insertMany(productsToSeed);
        console.log(`✅ Successfully seeded ${productsToSeed.length} products!`);

        // Show breakdown by category
        const categories = {};
        productsToSeed.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log('\n📊 Products by category:');
        Object.keys(categories).sort().forEach(cat => {
            console.log(`   - ${cat}: ${categories[cat]}`);
        });

        // Cleanup
        fs.unlinkSync('temp_products.js');

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    });
