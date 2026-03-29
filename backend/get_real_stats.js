const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mejor';

const getStats = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        const userCount = await User.countDocuments({ role: 'user' });
        const plantCount = await Product.countDocuments({ 
            $or: [
                { category: /Plant/i },
                { category: /Indoor/i },
                { category: /Outdoor/i },
                { category: /Flowering/i }
            ]
        });
        const toolsCount = await Product.countDocuments({ category: /Tool/i });
        
        console.log('--- REAL STATS ---');
        console.log('Users (Happy Planters):', userCount);
        console.log('Plants (Plant Varieties):', plantCount);
        console.log('Tools (Gardening Tools):', toolsCount);
        console.log('-------------------');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

getStats();
