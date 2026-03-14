const mongoose = require('mongoose');
require('dotenv').config();

const missing = ['Money Plant', 'Areca Palm', 'Spider Plant', 'Fiddle Leaf Fig'];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Product = require('./models/Product');
    const products = await Product.find({ name: { $in: missing } });
    require('fs').writeFileSync('missing_cats.json', JSON.stringify(products.map(p => ({ name: p.name, category: p.category, tags: p.tags })), null, 2));
    process.exit(0);
});
