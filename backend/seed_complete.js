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

// Comprehensive image library
const productImages = {
    pots: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ],
    watering: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80'
    ],
    support: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
    ],
    lighting: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
    ],
    decorative: [
        'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
    ],
    fertilizer: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80'
    ]
};

// ACCESSORIES - Pots & Planters
const potsAndPlanters = [
    'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots',
    'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters',
    'Decorative Planters', 'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters'
];
potsAndPlanters.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Accessories Plants', 99 + (idx * 50), 199 + (idx * 80),
        productImages.pots[idx % productImages.pots.length],
        productImages.pots[(idx + 1) % productImages.pots.length],
        ['Premium Quality', 'Durable', 'Stylish']
    ));
});

// ACCESSORIES - Watering Equipment
const wateringEquipment = [
    'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit',
    'Sprinkler', 'Water Pump', 'Mist Sprayer', 'Automatic Water Timer', 'Soaker Hose',
    'Water Pipe', 'Hose Connector', 'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer'
];
wateringEquipment.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Accessories Plants', 149 + (idx * 60), 249 + (idx * 90),
        productImages.watering[idx % productImages.watering.length],
        productImages.watering[(idx + 1) % productImages.watering.length],
        ['Efficient', 'Easy to Use', 'Water Saving']
    ));
});

// ACCESSORIES - Support & Protection
const plantSupport = [
    'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net',
    'Frost Cover', 'Plant Cover Bag', 'Tree Guard', 'Bamboo Stakes', 'Wire Support Ring',
    'Plant Tie', 'Mulching Sheet', 'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen'
];
plantSupport.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Accessories Plants', 79 + (idx * 40), 149 + (idx * 60),
        productImages.support[idx % productImages.support.length],
        productImages.support[(idx + 1) % productImages.support.length],
        ['Plant Protection', 'Weather Resistant', 'Durable']
    ));
});

// ACCESSORIES - Lighting Equipment
const lightingEquipment = [
    'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
    'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel',
    'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light',
    'Smart Grow Light', 'Light Controller', 'Heat Lamp'
];
lightingEquipment.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Accessories Plants', 299 + (idx * 100), 499 + (idx * 150),
        productImages.lighting[idx % productImages.lighting.length],
        productImages.lighting[(idx + 1) % productImages.lighting.length],
        ['Energy Efficient', 'Full Spectrum', 'Plant Growth']
    ));
});

// ACCESSORIES - Decorative & Display
const decorativeAccessories = [
    'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue',
    'Decorative Stones', 'Pebbles', 'Plant Tray', 'Moss Decoration', 'Terrarium Glass',
    'Garden Lights', 'Balcony Stand', 'Vertical Frame', 'Garden Border Fence', 'Plant Labels'
];
decorativeAccessories.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Accessories Plants', 129 + (idx * 70), 229 + (idx * 100),
        productImages.decorative[idx % productImages.decorative.length],
        productImages.decorative[(idx + 1) % productImages.decorative.length],
        ['Decorative', 'Premium Design', 'Home Decor']
    ));
});

// SEEDS - All Categories
const seedsData = {
    'Vegetable Seeds': [
        'Spinach (Palak) Seeds', 'Fenugreek (Methi) Seeds', 'Coriander (Dhaniya) Seeds',
        'Lettuce Seeds', 'Mustard Greens (Sarson) Seeds', 'Tomato (Tamatar) Seeds',
        'Chilli (Mirch) Seeds', 'Capsicum (Shimla Mirch) Seeds', 'Brinjal (Baingan) Seeds',
        'Cucumber (Kheera) Seeds', 'Carrot (Gajar) Seeds', 'Radish (Mooli) Seeds',
        'Beans (Sem) Seeds', 'Peas (Matar) Seeds', 'Okra (Bhindi) Seeds'
    ],
    'Fruit Seeds': [
        'Mango (Aam) Seeds', 'Apple (Seb) Seeds', 'Orange (Santra) Seeds',
        'Papaya Seeds', 'Guava (Amrood) Seeds', 'Pomegranate (Anar) Seeds',
        'Watermelon (Tarbooj) Seeds', 'Muskmelon (Kharbooja) Seeds', 'Strawberry Seeds',
        'Blueberry Seeds', 'Raspberry Seeds', 'Blackberry Seeds'
    ],
    'Herb Seeds': [
        'Coriander (Dhaniya) Seeds', 'Mint (Pudina) Seeds', 'Basil (Tulsi) Seeds',
        'Parsley Seeds', 'Thyme Seeds', 'Oregano Seeds', 'Rosemary Seeds',
        'Sage Seeds', 'Ashwagandha Seeds', 'Chamomile Seeds', 'Lemongrass Seeds',
        'Aloe Vera Seeds'
    ],
    'Flower Seeds': [
        'Marigold (Genda) Seeds', 'Sunflower Seeds', 'Rose Seeds', 'Zinnia Seeds',
        'Petunia Seeds', 'Cosmos Seeds', 'Daisy Seeds', 'Pansy Seeds',
        'Hibiscus (Gudhal) Seeds', 'Balsam (Gulmehendi) Seeds', 'Portulaca (Moss Rose) Seeds',
        'Gomphrena Seeds'
    ],
    'Microgreen Seeds': [
        'Mustard (Sarson) Microgreen Seeds', 'Radish (Mooli) Microgreen Seeds',
        'Broccoli Microgreen Seeds', 'Cabbage (Patta Gobhi) Microgreen Seeds',
        'Fenugreek (Methi) Microgreen Seeds', 'Peas (Matar) Microgreen Seeds',
        'Sunflower Microgreen Seeds'
    ]
};

Object.keys(seedsData).forEach(category => {
    seedsData[category].forEach((seed, idx) => {
        productsToSeed.push(createProduct(
            seed, category, 49 + (idx * 10), 99 + (idx * 15),
            productImages.seeds[idx % productImages.seeds.length],
            productImages.seeds[(idx + 1) % productImages.seeds.length],
            ['Easy to Grow', 'High Germination', 'Organic']
        ));
    });
});

// SOIL & GROWING MEDIA
const soilProducts = [
    'Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix',
    'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure',
    'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'
];
soilProducts.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Soil & Growing Media', 99 + (idx * 50), 199 + (idx * 70),
        productImages.soil[idx % productImages.soil.length],
        productImages.soil[(idx + 1) % productImages.soil.length],
        ['Organic', 'Nutrient Rich', 'Premium Quality']
    ));
});

// FERTILIZERS & NUTRIENTS
const fertilizerProducts = [
    'Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer',
    'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix',
    'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract',
    'Fish Emulsion', 'Humic Acid'
];
fertilizerProducts.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Fertilizers & Nutrients', 149 + (idx * 50), 249 + (idx * 70),
        productImages.fertilizer[idx % productImages.fertilizer.length],
        productImages.fertilizer[(idx + 1) % productImages.fertilizer.length],
        ['Organic', 'Fast Acting', 'Plant Nutrition']
    ));
});

// GARDENING TOOLS
const gardeningTools = [
    'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter',
    'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife',
    'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'
];
gardeningTools.forEach((item, idx) => {
    productsToSeed.push(createProduct(
        item, 'Gardening Tools', 199 + (idx * 100), 399 + (idx * 150),
        productImages.tools[idx % productImages.tools.length],
        productImages.tools[(idx + 1) % productImages.tools.length],
        ['Durable', 'Ergonomic', 'Professional Grade']
    ));
});

// GARDENING - All Categories
const gardeningData = {
    'Outdoor Blooms': ['Rose (Gulab)', 'Marigold (Genda)', 'Jasmine (Mogra)', 'Petunia', 'Sunflower'],
    'Home Garden Essentials': ['Tulsi (Holy Basil)', 'Curry Leaves (Kadi Patta)', 'Aloe Vera', 'Lemon Plant', 'Mint (Pudina)'],
    'Foliage & Greens': ['Areca Palm', 'Ferns', 'Bamboo Palm', 'Croton', 'Cypress'],
    'Decorative Style': ['Bougainvillea', 'Hibiscus (Gudhal)', 'Coleus', 'Golden Pothos', 'Song of India']
};

Object.keys(gardeningData).forEach(category => {
    gardeningData[category].forEach((item, idx) => {
        // Also add to 'Gardening' main category for the fallback link
        productsToSeed.push(createProduct(
            item, category, 199 + (idx * 50), 299 + (idx * 80),
            productImages.pots[idx % productImages.pots.length],
            productImages.pots[(idx + 1) % productImages.pots.length],
            ['Gardening', 'Healthy Plant', 'Premium']
        ));

        // Add a duplicate with 'Gardening' category so it shows on /products/gardening-plants
        productsToSeed.push(createProduct(
            `${item} (Gardening)`, 'Gardening', 199 + (idx * 50), 299 + (idx * 80),
            productImages.pots[idx % productImages.pots.length],
            productImages.pots[(idx + 1) % productImages.pots.length],
            ['Gardening', 'Healthy Plant', 'Premium']
        ));
    });
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
