const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function finalPolish() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB for Final Polish');

        // 1. Promote Cloudinary images from galleries
        const brokenMain = await Product.find({
            $or: [{ image: /unsplash/ }, { image: /placeholder/ }, { image: /bogo-combo/ }]
        });

        console.log(`🔍 Checking ${brokenMain.length} products with broken/generic main images...`);

        let promotedCount = 0;
        for (const p of brokenMain) {
            if (p.images && p.images.length > 0) {
                const cloudImg = p.images.find(img => img.includes('cloudinary'));
                if (cloudImg) {
                    p.image = cloudImg;
                    if (!p.hoverImage || p.hoverImage.includes('unsplash')) {
                        p.hoverImage = p.images[1] || cloudImg;
                    }
                    await p.save();
                    promotedCount++;
                    // console.log(`✨ Promoted gallery image for: ${p.name}`);
                }
            }
        }

        // 2. Specific fixes for high-traffic accessories (using Cloudinary links from mapping files)
        const specificFixes = [
            {
                name: 'Garden Statue',
                image: 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592200/decorative-garden-statue_z9x8qa.jpg',
                images: [
                    'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592200/decorative-garden-statue_z9x8qa.jpg',
                    'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592205/statue-view-2_a9sq2b.jpg'
                ]
            },
            {
                name: 'Drip Irrigation Kit',
                image: 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592300/drip-irrigation-main_b8wjcn.jpg',
                images: [
                    'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592300/drip-irrigation-main_b8wjcn.jpg',
                    'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774592305/drip-kit-setup_c2wjkm.jpg'
                ]
            },
            {
                name: 'Hand Trowel',
                image: 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774593016/Hawkesbury-Hand-Trowel-scaled_xqsxgn.jpg'
            },
            {
                name: 'Garden Fork',
                image: 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774593331/813vr3n1YjL._SL1500__ebpfqd.jpg'
            },
            {
                name: 'Dibber',
                image: 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774594478/415886374_bnk5co.jpg'
            }
        ];

        let specificCount = 0;
        for (const fix of specificFixes) {
            const result = await Product.updateOne(
                { name: { $regex: new RegExp(`^${fix.name}$`, 'i') } },
                { $set: fix }
            );
            if (result.modifiedCount > 0) specificCount++;
        }

        console.log('\n--- Final Polish Summary ---');
        console.log(`Total Galleries Promoted: ${promotedCount}`);
        console.log(`Specific Accessories Fixed: ${specificCount}`);
        console.log('✅ Visual Polish Complete!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error during polish:', err);
        process.exit(1);
    }
}

finalPolish();
