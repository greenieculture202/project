const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mejor')
    .then(async () => {
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const products = await Product.find({
            $or: [
                { name: /Flowering/i },
                { category: /Flowering/i },
                { tags: /flowering/i }
            ]
        });
        console.log('Found:', products.length);
        if (products.length > 0) {
            console.log('Sample:', products[0]);
        }
        process.exit();
    });
