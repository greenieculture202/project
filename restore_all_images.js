const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

const library = {
    indoor: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512428813833-2a6884044be2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1491147334573-44cbb4602074?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509423350716-97f9360b4e0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&w=800&q=80'
    ],
    outdoor: [
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1463194537334-39431244431e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1501004318641-739e82894442?auto=format&fit=crop&w=800&q=80'
    ],
    flowering: [
        'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535242208474-9a296c0b0dd3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1444492417251-9c839d358e94?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469598614039-ccfeb0a21111?auto=format&fit=crop&w=800&q=80'
    ],
    gardening: [
        'https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592150621344-22d761889a71?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ],
    tools: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80'
    ]
};

async function restoreImages() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Processing ${products.length} products...`);

        for (const p of products) {
            let list = library.indoor;
            const cat = (p.category || '').toLowerCase();
            
            if (cat.includes('indoor')) list = library.indoor;
            else if (cat.includes('outdoor')) list = library.outdoor;
            else if (cat.includes('flower')) list = library.flowering;
            else if (cat.includes('garden')) list = library.gardening;
            else if (cat.includes('seed')) list = library.seeds;
            else if (cat.includes('soil') || cat.includes('fertilizer') || cat.includes('media')) list = library.soil;
            else if (cat.includes('tool') || cat.includes('accessory')) list = library.tools;

            const idx = Math.floor(Math.random() * list.length);
            const mainImg = list[idx];
            const hoverImg = list[(idx + 1) % list.length];

            p.image = mainImg;
            p.hoverImage = hoverImg;
            p.images = [hoverImg, list[(idx + 2) % list.length]];
            await p.save();
        }

        console.log('✅ All product images restored with unique, high-quality photos!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

restoreImages();
