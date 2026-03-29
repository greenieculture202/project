const mongoose = require('mongoose');
const uri = 'mongodb+srv://greenie:M8lXh9Kz9hps6b7h@cluster0.b7391.mongodb.net/greenie_db_v2?retryWrites=true&w=majority&appName=Cluster0';

const names = [
    'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 
    'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 
    'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'
];

async function check() {
    try {
        await mongoose.connect(uri);
        const Product = mongoose.model('Product', new mongoose.Schema({ name: String }));
        const found = await Product.find({ name: { $in: names } }).lean();
        console.log('Found:', found.length);
        found.forEach(p => console.log(p.name));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
