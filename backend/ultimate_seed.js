const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor');
        console.log('Connected to MongoDB');

        const products = [];
        const usedSlugs = new Set();

        const generateSlug = (name) => {
            let baseSlug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            let finalSlug = baseSlug;
            let counter = 1;
            while (usedSlugs.has(finalSlug)) {
                finalSlug = `${baseSlug}-${counter++}`;
            }
            usedSlugs.add(finalSlug);
            return finalSlug;
        };

        // 1. Parse original products from old_service.ts
        if (fs.existsSync('old_service.ts')) {
            const content = fs.readFileSync('old_service.ts', 'utf8');
            const productBlocks = content.match(/{[\s\S]*?name:[\s\S]*?category:[\s\S]*?}/g);

            if (productBlocks) {
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
                            slug: generateSlug(name)
                        });
                    }
                });
                console.log(`Parsed ${products.length} products from old_service.ts`);
            }
        }

        // 2. Supplementary Categories Helper
        const helper = (name, category, price, originalPrice, image, tags = []) => ({
            name,
            category,
            price: price.toString(),
            originalPrice: originalPrice.toString(),
            discount: `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`,
            discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
            image,
            hoverImage: image,
            tags,
            slug: generateSlug(name)
        });

        // 3. Add Missing Categories Data
        const soilImages = [
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
        ];

        // Soil
        const soilProducts = ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix', 'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure', 'Perlite', 'Vermiculite'];
        soilProducts.forEach((p, i) => products.push(helper(p, 'Soil & Growing Media', 149 + i * 20, 249 + i * 30, soilImages[i % 3], ['Organic', 'Nutrient Rich'])));

        // Fertilizers
        const fertilizerProducts = ['Organic Fertilizer', 'Bone Meal', 'Bio Fertilizer', 'NPK Fertilizer', 'Urea', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid', 'Liquid Fertilizer'];
        fertilizerProducts.forEach((p, i) => products.push(helper(p, 'Fertilizers & Nutrients', 199 + i * 30, 299 + i * 40, soilImages[i % 3], ['Growth Booster'])));

        // Tools
        const toolImages = [
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80'
        ];
        const gardeningTools = ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Pruning Shears', 'Hedge Cutter', 'Rake', 'Shovel', 'Watering Can', 'Garden Knife', 'Dibber', 'Spade'];
        gardeningTools.forEach((p, i) => products.push(helper(p, 'Gardening Tools', 299 + i * 50, 499 + i * 60, toolImages[i % 2], ['Durable', 'Steel'])));

        // Accessories
        const accessoriesProducts = ['Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Plant Stand', 'Grow Lights', 'Garden Statue', 'Watering Spray', 'Plant Clips', 'Trellis', 'Pebbles'];
        accessoriesProducts.forEach((p, i) => products.push(helper(p, 'Accessories', 99 + i * 70, 199 + i * 90, soilImages[i % 3], ['Premium Quality'])));

        // Seeds (Critical)
        const seedsCategories = {
            'Vegetable Seeds': ['Spinach (Palak)', 'Fenugreek (Methi)', 'Coriander (Dhaniya)', 'Tomato (Tamatar)', 'Chilli (Mirch)', 'Capsicum (Shimla Mirch)'],
            'Fruit Seeds': ['Mango (Aam)', 'Orange (Santra)', 'Papaya', 'Guava (Amrood)', 'Watermelon', 'Strawberry'],
            'Herb Seeds': ['Mint (Pudina)', 'Basil (Tulsi)', 'Parsley', 'Rosemary', 'Ashwagandha'],
            'Flower Seeds': ['Marigold (Genda)', 'Sunflower', 'Rose', 'Zinnia', 'Petunia', 'Hibiscus (Gudhal)'],
            'Microgreen Seeds': ['Mustard (Sarson)', 'Radish (Mooli)', 'Broccoli', 'Peas (Matar)', 'Sunflower']
        };
        const seedImg = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80';
        Object.keys(seedsCategories).forEach(cat => {
            seedsCategories[cat].forEach((p, i) => {
                products.push(helper(`${p} Seeds`, cat, 49 + i * 10, 99 + i * 20, seedImg, ['High Germination', 'Seeds']));
            });
        });

        console.log(`Total products to seed: ${products.length}`);

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('✅ Successfully seeded database with EVERYTHING!');

        const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        console.log('\nFinal Category Distribution:');
        counts.sort((a, b) => a._id.localeCompare(b._id)).forEach(c => console.log(` - ${c._id}: ${c.count}`));

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
