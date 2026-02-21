// Extract products from old service file and create seed data
const fs = require('fs');

// Read the old service file
const content = fs.readFileSync('old_service.ts', 'utf8');

// Extract the allProducts object
const match = content.match(/private allProducts.*?=\s*{([\s\S]*?)};[\s\S]*?getProducts/);

if (!match) {
    console.log('Could not find products data');
    process.exit(1);
}

// Write to a temporary file for processing
const productsData = `const allProducts = {${match[1]}};
module.exports = allProducts;`;

fs.writeFileSync('temp_products.js', productsData);

// Load the products
const allProducts = require('./temp_products.js');

// Flatten all products
const productsToSeed = [];
Object.keys(allProducts).forEach(category => {
    allProducts[category].forEach(product => {
        productsToSeed.push(product);
    });
});

console.log(`Total products extracted: ${productsToSeed.length}`);

// Create the new seed file
const seedFileContent = `require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

// All products data extracted from original service
const productsToSeed = ${JSON.stringify(productsToSeed, null, 2)};

// Seed the database
mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB...');
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});
        console.log('📦 Seeding database with products...');
        await Product.insertMany(productsToSeed);
        console.log(\`✅ Successfully seeded \${productsToSeed.length} products!\`);
        
        // Show breakdown by category
        const categories = {};
        productsToSeed.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log('\\n📊 Products by category:');
        Object.keys(categories).forEach(cat => {
            console.log(\`   - \${cat}: \${categories[cat]}\`);
        });
        
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    });
`;

fs.writeFileSync('seed.js', seedFileContent);
console.log('✅ New seed.js file created!');

// Cleanup
fs.unlinkSync('temp_products.js');
