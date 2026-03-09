const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function updateStock() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Product.updateMany(
            { stock: { $exists: false } },
            { $set: { stock: 25 } }
        );
        console.log(`Updated ${result.modifiedCount} products with no stock field.`);

        const result2 = await Product.updateMany(
            { stock: 0 },
            { $set: { stock: 25 } }
        );
        console.log(`Updated ${result2.modifiedCount} products with 0 stock content.`);

        console.log('Stock update completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating stock:', error);
        process.exit(1);
    }
}

updateStock();
