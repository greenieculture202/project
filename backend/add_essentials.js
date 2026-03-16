const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function addEssentialProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        const essentials = [
            {
                name: 'Neem Oil (Organic Spray)',
                category: 'Fertilizers & Nutrients',
                price: '299',
                originalPrice: '450',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                tags: ['Organic', 'Pest Control', 'Eco-Friendly']
            },
            {
                name: 'Plant Fungicide',
                category: 'Fertilizers & Nutrients',
                price: '349',
                originalPrice: '499',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
                tags: ['Antifungal', 'Plant Health', 'Protective']
            }
        ];

        for (const item of essentials) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                await Product.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Exists: ${item.name}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

addEssentialProducts();
