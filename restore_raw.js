const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

const library = {
    indoor: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    outdoor: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    flowering: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
    gardening: 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&w=800&q=80',
    seeds: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    soil: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    fertilizer: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    tools: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
};

async function rawRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB via Raw Client');
        const db = client.db('mejor');
        const collection = db.collection('products');

        const configs = [
            { filter: { category: /indoor/i }, img: library.indoor },
            { filter: { category: /outdoor/i }, img: library.outdoor },
            { filter: { category: /flower/i }, img: library.flowering },
            { filter: { category: /garden/i }, img: library.gardening },
            { filter: { category: /seed/i }, img: library.seeds },
            { filter: { category: /soil|media/i }, img: library.soil },
            { filter: { category: /fertilizer|nutrient/i }, img: library.fertilizer },
            { filter: { category: /tool|accessory/i }, img: library.tools }
        ];

        for (const config of configs) {
            const res = await collection.updateMany(
                config.filter,
                { $set: { image: config.img, hoverImage: config.img, images: [config.img] } }
            );
            console.log(`Updated ${res.modifiedCount} products for ${JSON.stringify(config.filter)}`);
        }

        console.log('✅ Raw Restoration Successful!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.close();
    }
}

rawRestore();
