const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

mongoose.connect(uri)
    .then(async () => {
        const prod = await Product.findOne({ name: /shovel/i });
        console.log('PRODUCT_DATA_START');
        console.log(JSON.stringify(prod, null, 2));
        console.log('PRODUCT_DATA_END');
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
