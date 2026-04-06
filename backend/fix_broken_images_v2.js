const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Product = require('./models/Product');

const STABLE_IMAGES = {
    'Snake Plant': 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
    'Aloe Vera': 'https://images.unsplash.com/photo-1596547610034-71f00889984e?auto=format&fit=crop&w=800&q=80',
    'Jade Plant': 'https://images.unsplash.com/photo-1581447100512-32b05b871c4c?auto=format&fit=crop&w=800&q=80',
    'Money Plant': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    'Peace Lily': 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    'Rubber Plant': 'https://images.unsplash.com/photo-1592150621344-78439b73484c?auto=format&fit=crop&w=800&q=80',
    'Spider Plant': 'https://images.unsplash.com/photo-1594236052044-307a01c6fe10?auto=format&fit=crop&w=800&q=80',
    'ZZ Plant': 'https://images.unsplash.com/photo-1597072603399-52643a6d482d?auto=format&fit=crop&w=800&q=80'
};

const CATEGORY_FALLBACKS = {
    'Indoor Plants': 'https://images.unsplash.com/photo-1520412099521-63bc1e951717?auto=format&fit=crop&w=800&q=80',
    'Outdoor Plants': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    'XL Plants': 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80'
};

async function fixImages() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // 1. Update specific known products first
        for (const [name, imageUrl] of Object.entries(STABLE_IMAGES)) {
            const res = await Product.updateMany(
                { name: new RegExp(name, 'i') },
                { $set: { image: imageUrl } }
            );
            if (res.modifiedCount > 0) {
                console.log(`✅ Updated ${res.modifiedCount} instances of "${name}"`);
            }
        }

        // 3. GLOBAL FALLBACK for ANY remaining broken links (Cloudinary, local, or placeholder)
        const allProducts = await Product.find({}).lean();
        let globalFixedCount = 0;

        for (const prod of allProducts) {
            const isBroken = !prod.image || 
                             prod.image.includes('cloudinary') || 
                             prod.image.startsWith('assets/') || 
                             prod.image.includes('placeholder') ||
                             prod.image.includes('example.com');

            if (isBroken) {
                let fallback = STABLE_IMAGES['Snake Plant']; // Default
                if (prod.category && CATEGORY_FALLBACKS[prod.category]) {
                    fallback = CATEGORY_FALLBACKS[prod.category];
                }
                
                await Product.updateOne({ _id: prod._id }, { $set: { image: fallback } });
                globalFixedCount++;
            }
        }
        console.log(`✅ Applied global fallback image to ${globalFixedCount} remaining products.`);

        console.log('\n--- Final Verification ---');
        const finalCheck = await Product.find({}).lean();
        const stillBroken = finalCheck.filter(p => !p.image || p.image.includes('cloudinary') || p.image.startsWith('assets/'));
        console.log(`Final count of missing/broken images: ${stillBroken.length}`);

        await mongoose.disconnect();
        console.log('Database disconnected.');
    } catch (err) {
        console.error('Error fixing images:', err);
    }
}

fixImages();
