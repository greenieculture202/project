require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

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

const productImages = {
    pots: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
    ]
};

const gardeningData = {
    'Outdoor Blooms': ['Rose (Gulab)', 'Marigold (Genda)', 'Jasmine (Mogra)', 'Petunia', 'Sunflower'],
    'Home Garden Essentials': ['Tulsi (Holy Basil)', 'Curry Leaves (Kadi Patta)', 'Aloe Vera', 'Lemon Plant', 'Mint (Pudina)'],
    'Foliage & Greens': ['Areca Palm', 'Ferns', 'Bamboo Palm', 'Croton', 'Cypress'],
    'Decorative Style': ['Bougainvillea', 'Hibiscus (Gudhal)', 'Coleus', 'Golden Pothos', 'Song of India']
};

const productsToSeed = [];
Object.keys(gardeningData).forEach(category => {
    gardeningData[category].forEach((item, idx) => {
        // Individual category
        productsToSeed.push(createProduct(
            item, category, 199 + (idx * 50), 299 + (idx * 80),
            productImages.pots[idx % productImages.pots.length],
            productImages.pots[(idx + 1) % productImages.pots.length],
            ['Gardening', 'Healthy Plant', 'Premium']
        ));

        // General Gardening category for the main link
        productsToSeed.push(createProduct(
            `${item} (Gardening)`, 'Gardening', 199 + (idx * 50), 299 + (idx * 80),
            productImages.pots[idx % productImages.pots.length],
            productImages.pots[(idx + 1) % productImages.pots.length],
            ['Gardening', 'Healthy Plant', 'Premium']
        ));
    });
});

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB...');
        // We DON'T delete all, just add these or update
        for (const p of productsToSeed) {
            await Product.updateOne({ name: p.name }, p, { upsert: true });
        }
        console.log(`✅ Successfully seeded ${productsToSeed.length} gardening products!`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    });
