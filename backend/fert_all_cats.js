const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        const Product = mongoose.model('Product', new mongoose.Schema({
            category: String,
            name: String
        }));

        const allProducts = await Product.find({}).lean();
        
        let output = '';
        const counts = {};
        allProducts.forEach(p => {
             const lowerCategory = p.category ? p.category.toLowerCase() : 'none';
             if(lowerCategory.includes('fertilizer') || lowerCategory.includes('nutrient') || lowerCategory.includes('booster')){
                 output += `- ${p.name} | Cat: ${p.category}\n`;
             }
        });

        fs.writeFileSync('fert_all_cats.txt', output, 'utf8');
        console.log('Saved to fert_all_cats.txt');
        await mongoose.connection.close();
    } catch(err) {
        console.log(err);
    }
}
check();
