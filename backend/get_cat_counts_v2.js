const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Review = require('./models/Review');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mejor';

const getCounts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        const userCount = await User.countDocuments({ role: 'user' });
        
        const catCounts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const reviews = await Review.find();
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : 4.8;

        console.log('--- COUNTS ---');
        console.log('Users:', userCount);
        console.log('Categories:', JSON.stringify(catCounts, null, 2));
        console.log('Avg Rating:', avgRating);
        console.log('--------------');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

getCounts();
