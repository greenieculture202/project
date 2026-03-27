const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor');
        const Product = mongoose.model('Product', new mongoose.Schema({
            category: String,
            name: String,
            tags: [String]
        }));

        const fertCats = ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'];
        
        const allProducts = await Product.find({}).lean();
        
        const adminProducts = allProducts.filter(p => {
            const cat = p.category || '';
            const catLower = cat.toLowerCase();
            return fertCats.includes(cat) || catLower.includes('fertilizer') || catLower.includes('nutrient') || catLower.includes('booster');
        });

        console.log(`Potential Fertilizers in DB: ${adminProducts.length}`);
        adminProducts.forEach(p => console.log(`- ${p.name} | Cat: ${p.category}`));
        
        // also check user's frontend logic in admin-panel.html for counting?
        
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
