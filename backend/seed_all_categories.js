require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Product = require(path.join(__dirname, 'models/Product'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

// Helper function to generate product data
// Helper function to generate product data
const createProduct = (name, category, price, originalPrice, image, hoverImage, tags = []) => {
    // Tag pools for different categories
    const plantTags = ['Easy Care', 'Vastu Friendly', 'Air Purifying', 'Pet Friendly', 'Low Maintenance'];
    const floweringTags = ['Outdoor Blooms', 'Fragrant', 'Aromatic', 'Colorful', 'Pest Repellent'];
    const seedTags = ['High Germination', 'Organic', 'Fast Growing', 'High Yield', 'Easy to Grow'];
    const accessoryTags = ['Premium Quality', 'Durable', 'Stylish', 'Eco-Friendly', 'Modern', 'Sleek Design'];
    const fertilizerTags = ['Organic', 'Fast Acting', 'Nutrient Rich', 'Soil Booster', 'Plant Food', 'Bio-Fertilizer'];
    const soilTags = ['Premium Mix', 'Well Draining', 'Ready to Use', 'Moisture Retaining', 'Nutrient Dense', 'Sterile'];

    let extraTags = [];
    const lowerCategory = category.toLowerCase();
    const lowerName = name.toLowerCase();

    // Categorization logic
    const isPlant = !lowerCategory.includes('seeds') &&
        !lowerCategory.includes('accessories') &&
        !lowerCategory.includes('tools') &&
        !lowerCategory.includes('media') &&
        !lowerCategory.includes('fertilizer');

    const getTwoRandom = (pool) => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    };

    if (isPlant) {
        if (lowerCategory.includes('flowering') || lowerName.includes('rose') || lowerName.includes('marigold') || lowerName.includes('jasmine') || lowerName.includes('petunia')) {
            extraTags = ['Outdoor Blooms'];
            if (lowerName.includes('rose')) extraTags.push('Fragrant');
            else if (lowerName.includes('marigold')) extraTags.push('Pest Repellent');
            else if (lowerName.includes('jasmine')) extraTags.push('Aromatic');
            else if (lowerName.includes('petunia')) extraTags.push('Colorful');
            else extraTags.push(floweringTags[Math.floor(Math.random() * floweringTags.length)]);

            // Ensure we have 2 tags
            if (extraTags.length < 2) {
                const remaining = floweringTags.filter(t => !extraTags.includes(t));
                extraTags.push(remaining[Math.floor(Math.random() * remaining.length)]);
            }
        } else if (lowerName.includes('snake') || lowerName.includes('money') || lowerName.includes('zz')) {
            extraTags = ['Easy Care', 'Air Purifying'];
        } else if (lowerName.includes('tuls') || lowerName.includes('jade')) {
            extraTags = ['Vastu Friendly', 'Easy Care'];
        } else {
            extraTags = getTwoRandom(plantTags);
        }
    } else if (lowerCategory.includes('seeds')) {
        extraTags = getTwoRandom(seedTags);
    } else if (lowerCategory.includes('fertilizer')) {
        extraTags = getTwoRandom(fertilizerTags);
    } else if (lowerCategory.includes('soil') || lowerCategory.includes('media')) {
        extraTags = getTwoRandom(soilTags);
    } else if (lowerCategory.includes('accessories') || lowerCategory.includes('tools')) {
        extraTags = getTwoRandom(accessoryTags);
    }

    return {
        name,
        category,
        price,
        originalPrice,
        discount: `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`,
        discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
        image,
        hoverImage,
        tags: [...new Set([...tags, ...extraTags])]
    };
};

// Base images for different categories
const images = {
    indoor: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80'
    ],
    outdoor: [
        'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
    ],
    fertilizer: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ],
    accessories: [
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80'
    ]
};

const productsToSeed = [];

// Load existing products from old seed
const fs = require('fs');
const oldSeedContent = fs.readFileSync(path.join(__dirname, 'seed.js'), 'utf8');
const match = oldSeedContent.match(/const productsToSeed = (\[[\s\S]*?\]);/);
if (match) {
    const existingProducts = JSON.parse(match[1]);
    productsToSeed.push(...existingProducts);
}

// Add Seeds category products
const seedsCategories = {
    'Vegetable Seeds': ['Spinach (Palak)', 'Fenugreek (Methi)', 'Coriander (Dhaniya)', 'Lettuce', 'Mustard Greens (Sarson)', 'Tomato (Tamatar)', 'Chilli (Mirch)', 'Capsicum (Shimla Mirch)', 'Brinjal (Baingan)', 'Cucumber (Kheera)'],
    'Fruit Seeds': ['Mango (Aam)', 'Apple (Seb)', 'Orange (Santra)', 'Papaya', 'Guava (Amrood)', 'Pomegranate (Anar)', 'Watermelon (Tarbooj)', 'Muskmelon (Kharbooja)', 'Strawberry', 'Blueberry'],
    'Herb Seeds': ['Coriander (Dhaniya)', 'Mint (Pudina)', 'Basil (Tulsi)', 'Parsley', 'Thyme', 'Oregano', 'Rosemary', 'Sage', 'Ashwagandha', 'Chamomile'],
    'Flower Seeds': ['Marigold (Genda)', 'Sunflower', 'Rose', 'Zinnia', 'Petunia', 'Cosmos', 'Daisy', 'Pansy', 'Hibiscus (Gudhal)', 'Balsam (Gulmehendi)'],
    'Microgreen Seeds': ['Mustard (Sarson)', 'Radish (Mooli)', 'Broccoli', 'Cabbage (Patta Gobhi)', 'Fenugreek (Methi)', 'Peas (Matar)', 'Sunflower']
};

Object.keys(seedsCategories).forEach((category, catIdx) => {
    seedsCategories[category].forEach((seed, idx) => {
        productsToSeed.push(createProduct(
            `${seed} Seeds`,
            category,
            49 + (idx * 10),
            99 + (idx * 15),
            images.seeds[idx % images.seeds.length],
            images.seeds[(idx + 1) % images.seeds.length],
            []
        ));
    });
});

// Add Soil & Growing Media products
const soilProducts = {
    'Soil & Growing Media': [
        'Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix',
        'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure',
        'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'
    ]
};

soilProducts['Soil & Growing Media'].forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Soil & Growing Media',
        99 + (idx * 50),
        199 + (idx * 70),
        images.soil[idx % images.soil.length],
        images.soil[(idx + 1) % images.soil.length],
        []
    ));
});

// Add Fertilizers & Nutrients products
const fertilizerProducts = {
    'Fertilizers & Nutrients': [
        'Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer',
        'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix',
        'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'
    ]
};

fertilizerProducts['Fertilizers & Nutrients'].forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Fertilizers & Nutrients',
        149 + (idx * 50),
        249 + (idx * 70),
        images.fertilizer[idx % images.fertilizer.length],
        images.fertilizer[(idx + 1) % images.fertilizer.length],
        []
    ));
});

// Add Gardening Tools products
const gardeningTools = {
    'Gardening Tools': [
        'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter',
        'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife',
        'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'
    ]
};

gardeningTools['Gardening Tools'].forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Gardening Tools',
        199 + (idx * 100),
        399 + (idx * 150),
        images.tools[idx % images.tools.length],
        images.tools[(idx + 1) % images.tools.length],
        []
    ));
});

// Add Accessories products
const accessoriesProducts = {
    'Accessories': [
        'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots',
        'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters',
        'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit',
        'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net',
        'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
        'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue'
    ]
};

accessoriesProducts['Accessories'].forEach((product, idx) => {
    productsToSeed.push(createProduct(
        product,
        'Accessories',
        99 + (idx * 50),
        199 + (idx * 80),
        images.accessories[idx % images.accessories.length],
        images.accessories[(idx + 1) % images.accessories.length],
        []
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

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    });
