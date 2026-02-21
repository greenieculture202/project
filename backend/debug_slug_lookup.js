const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {

            const testSlug = 'rose-gulab';
            console.log(`\n--- Testing Regex Logic for '${testSlug}' ---`);

            // Test Logic from server.js
            const nameParts = testSlug.split(/[-\s]+/);
            const namePattern = nameParts
                .filter(part => part.length > 0)
                .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                .join('[^a-z0-9]+');

            const regex = new RegExp(`^[^a-z0-9]*${namePattern}[^a-z0-9]*$`, 'i');
            console.log(`Regex: ${regex}`);

            let product = await Product.findOne({ name: { $regex: regex } });
            if (product) {
                console.log(`SUCCESS (Regex): Found '${product.name}'`);
            } else {
                console.log('FAIL (Regex): Not found.');

                // Fallback Logic from server.js
                console.log('Testing Fallback (Split words)...');
                const andConditions = nameParts.filter(p => p.length > 0).map(part => ({
                    name: { $regex: new RegExp(part, 'i') }
                }));
                product = await Product.findOne({ $and: andConditions });

                if (product) {
                    console.log(`SUCCESS (Fallback): Found '${product.name}'`);
                } else {
                    console.log('FAIL (Fallback): Not found.');
                }
            }

        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
