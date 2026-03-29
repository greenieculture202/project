const mongoose = require('mongoose');
const uri = 'mongodb+srv://greenie:M8lXh9Kz9hps6b7h@cluster0.b7391.mongodb.net/greenie_db_v2?retryWrites=true&w=majority&appName=Cluster0';

async function listTools() {
    try {
        await mongoose.connect(uri);
        const Product = mongoose.model('Product', new mongoose.Schema({
            name: String,
            category: String,
            tags: [String]
        }));

        // Fetch all products that might be tools
        const allProducts = await Product.find({}).lean();
        
        const toolKeywords = [
            'Trowel', 'Fork', 'Scoop', 'Dibber', 'Transplanter', 
            'Shears', 'Cutter', 'Scissors', 'Knife', 
            'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Mower'
        ];

        const tools = allProducts.filter(p => {
            const searchStr = `${p.name} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase();
            return toolKeywords.some(kw => searchStr.includes(kw.toLowerCase()));
        });

        console.log(`Found ${tools.length} potential tools:`);
        tools.forEach(t => {
            console.log(`- NAME: "${t.name}" | CAT: "${t.category}" | TAGS: [${(t.tags || []).join(', ')}]`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listTools();
