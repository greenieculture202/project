const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Review = require('./models/Review');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mejor';

const getCounts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const userCount = await User.countDocuments();
        const nonPlants = ['Accessories', 'Soil & Growing Media', 'Fertilizers & Nutrients', 'Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds', 'Flower Seeds', 'Microgreen Seeds', 'Garden Toolkits', 'Chemical Fertilizers', 'Organic Fertilizers', 'Seeds'];
        const plantCount = await Product.countDocuments({ category: { $nin: nonPlants } });
        const toolsCount = await Product.countDocuments({ category: /Tool/i });
        const reviews = await Review.find();
        const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 4.8;

        const result = `Happy Planters: ${userCount}\nPlant Varieties: ${plantCount}\nGardening Tools: ${toolsCount}\nUser Rating: ${avgRating}`;
        fs.writeFileSync('stats_result.txt', result);
        console.log(result);
        await mongoose.disconnect();
    } catch (err) { console.error(err); }
};
getCounts();
