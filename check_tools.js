const mongoose = require('mongoose');
const uri = 'mongodb+srv://greenie:M8lXh9Kz9hps6b7h@cluster0.b7391.mongodb.net/greenie_db_v2?retryWrites=true&w=majority&appName=Cluster0';

async function checkTools() {
    try {
        await mongoose.connect(uri);
        const Product = mongoose.model('Product', new mongoose.Schema({
            name: String,
            category: String,
            tags: [String]
        }));

        const toolsNames = [
            'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 
            'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 
            'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'
        ];

        // Search by category/tags containing "Tool"
        const toolByCat = await Product.find({ 
            $or: [
                { category: /Tool/i }, 
                { tags: /Tool/i } 
            ] 
        }).lean();

        // Search by names
        const nameRegex = new RegExp(toolsNames.join('|'), 'i');
        const toolByNames = await Product.find({ name: { $regex: nameRegex } }).lean();

        console.log('Total by Category/Tags:', toolByCat.length);
        console.log('Total by Names:', toolByNames.length);

        const allTools = [...toolByCat, ...toolByNames];
        const uniqueTools = Array.from(new Set(allTools.map(t => t.name)));
        console.log('Unique Tool Names Found:', uniqueTools.length);
        console.log('Names:', uniqueTools);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTools();
