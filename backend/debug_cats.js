const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mejor')
    .then(async () => {
        const Product = mongoose.model('Product', new mongoose.Schema({ category: String }));
        const cats = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        console.log(JSON.stringify(cats, null, 2));
        process.exit();
    });
