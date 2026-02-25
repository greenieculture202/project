const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        const content = fs.readFileSync('old_service.ts', 'utf8');

        // Match product blocks { ... }
        const productBlocks = content.match(/{[\s\S]*?name:[\s\S]*?category:[\s\S]*?}/g);

        if (!productBlocks) {
            console.log('No product blocks found');
            process.exit(1);
        }

        const products = [];
        const usedSlugs = new Set();

        productBlocks.forEach(block => {
            const getVal = (regex) => {
                const m = block.match(regex);
                return m ? m[1] : null;
            };

            const name = getVal(/name:\s*['"]([^'"]+)['"]/);
            const price = getVal(/price:\s*['"]([^'"]+)['"]/);
            const originalPrice = getVal(/originalPrice:\s*['"]([^'"]+)['"]/);
            const discount = getVal(/discount:\s*['"]([^'"]+)['"]/);
            const discountPercent = getVal(/discountPercent:\s*(\d+)/);
            const category = getVal(/category:\s*['"]([^'"]+)['"]/);
            const image = getVal(/image:\s*['"]([^'"]+)['"]/);
            const hoverImage = getVal(/hoverImage:\s*['"]([^'"]+)['"]/);

            const tagsMatch = block.match(/tags:\s*\[([\s\S]*?)\]/);
            const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(t => t) : [];

            if (name && category) {
                let baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                let finalSlug = baseSlug;
                let counter = 1;
                while (usedSlugs.has(finalSlug)) {
                    finalSlug = `${baseSlug}-${counter++}`;
                }
                usedSlugs.add(finalSlug);

                products.push({
                    name,
                    price: price || '0',
                    originalPrice: originalPrice || price || '0',
                    discount: discount || '',
                    discountPercent: discountPercent ? parseInt(discountPercent) : 0,
                    category,
                    image: image || '',
                    hoverImage: hoverImage || '',
                    tags,
                    slug: finalSlug
                });
            }
        });

        console.log(`Parsed ${products.length} products`);

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Successfully seeded database with full details');

        const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        console.log('Category Distribution:');
        counts.forEach(c => console.log(` - ${c._id}: ${c.count}`));

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
