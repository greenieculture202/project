const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

const library = {
    plants: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512428813833-2a6884044be2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1491147334573-44cbb4602074?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509423350716-97f9360b4e0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1501004318641-739e82894442?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1463930644024-c94ddb4bcad0?auto=format&fit=crop&w=800&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1628350565513-2428277572b2?auto=format&fit=crop&w=800&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592150621344-22d761889a71?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&w=800&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    specific: {
        'Snake Plant': 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=800&q=80',
        'Aloe Vera': 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
        'Jade Plant': 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=800&q=80',
        'Peace Lily': 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=800&q=80',
        'Money Plant': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
        'Areca Palm': 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=800&q=80',
        'Rubber Plant': 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=800&q=80',
        'ZZ Plant': 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=800&q=80',
        'Fiddle Leaf Fig': 'https://images.unsplash.com/photo-1601985705806-8b998a3458ae?auto=format&fit=crop&w=800&q=80',
        'Monstera': 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=800&q=80'
    }
};

async function restore() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Updating ${products.length} products...`);

        let count = 0;
        for (const p of products) {
            let selectedList = library.plants;
            const cat = (p.category || '').toLowerCase();
            const name = (p.name || '').toLowerCase();

            // Category matching
            if (cat.includes('seed')) selectedList = library.seeds;
            else if (cat.includes('tool') || cat.includes('accessory')) selectedList = library.tools;
            else if (cat.includes('soil') || cat.includes('fertilizer') || cat.includes('nutrient') || cat.includes('media') || cat.includes('booster')) selectedList = library.soil;
            else selectedList = library.plants;

            // Pick images
            let mainImg, hoverImg;
            
            // Check for specific matches first
            let specificMatch = null;
            for (const key in library.specific) {
                if (name.includes(key.toLowerCase())) {
                    specificMatch = library.specific[key];
                    break;
                }
            }

            if (specificMatch) {
                mainImg = specificMatch;
                const idx = Math.floor(Math.random() * selectedList.length);
                hoverImg = selectedList[idx];
            } else {
                const idx = Math.floor(Math.random() * selectedList.length);
                mainImg = selectedList[idx];
                hoverImg = selectedList[(idx + 1) % selectedList.length];
            }

            const gallery = [
                hoverImg,
                selectedList[Math.floor(Math.random() * selectedList.length)]
            ];

            p.image = mainImg;
            p.hoverImage = hoverImg;
            p.images = gallery;

            await p.save();
            count++;
            if (count % 50 === 0) console.log(`Progress: ${count}/${products.length}...`);
        }

        console.log(`✅ Successfully updated ${count} products with high-quality images!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during restoration:', err);
        process.exit(1);
    }
}

restore();
