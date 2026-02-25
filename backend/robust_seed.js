const fs = require('fs');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: String,
    price: String,
    originalPrice: String,
    discount: String,
    discountPercent: Number,
    image: String,
    hoverImage: String,
    category: String,
    tags: [String],
    slug: String
});

const Product = mongoose.model('Product', ProductSchema);

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        const content = fs.readFileSync('old_service.ts', 'utf8');

        // This is a slightly more manual way to extract the object
        const startMarker = 'private allProducts: { [key: string]: Product[] } = {';
        const startIndex = content.indexOf(startMarker);
        if (startIndex === -1) throw new Error('Start marker not found');

        const dataStart = startIndex + startMarker.length - 1; // start at '{'

        // Find the matching closing brace for the whole object
        let braceCount = 0;
        let endIndex = -1;
        for (let i = dataStart; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            if (braceCount === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) throw new Error('End marker not found');

        const rawJsonString = content.substring(dataStart, endIndex + 1);

        // Step 1: Remove comments
        let cleaned = rawJsonString.replace(/\/\/.*$/gm, '');

        // Step 2: Convert TS object literal to something JSON-ish
        // Note: This is tricky because of the property names without quotes
        // We'll use eval() in a controlled way or better yet, a safer extraction.

        // Let's create a temp file and require it.
        const tempFileContent = `const data = ${cleaned};\nmodule.exports = data;`;
        fs.writeFileSync('temp_data.js', tempFileContent);

        const allProducts = require('./temp_data.js');

        const productsToInsert = [];
        for (const category in allProducts) {
            allProducts[category].forEach(p => {
                productsToInsert.push({
                    ...p,
                    category: p.category || category,
                    slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                });
            });
        }

        console.log(`Total products parsed: ${productsToInsert.length}`);

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(productsToInsert);
        console.log('Successfully seeded database');

        const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        console.log('Category Counts:', counts);

        fs.unlinkSync('temp_data.js');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
