const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        const Product = mongoose.model('Product', new mongoose.Schema({
            category: String,
            name: String,
            tags: [String]
        }));

        let output = '';

        const fertCats = ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'];
        const allProducts = await Product.find({}).lean();
        
        const adminProducts = allProducts.filter(p => {
            const cat = p.category || '';
            const catLower = cat.toLowerCase();
            return fertCats.includes(cat) || catLower.includes('fertilizer') || catLower.includes('nutrient') || catLower.includes('booster');
        });

        output += `Potential Fertilizers in DB: ${adminProducts.length}\n`;
        adminProducts.forEach(p => output += `- ${p.name} | Cat: ${p.category}\n`);
        
        fs.writeFileSync('fert_counts_fixed.txt', output, 'utf8');
        console.log('Done');
        
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
