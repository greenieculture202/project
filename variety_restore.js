const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

const library = {
    indoor: [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80'
    ],
    outdoor: [
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'
    ],
    flowering: [
        'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535242208474-9a296c0b0dd3?auto=format&fit=crop&w=800&q=80'
    ],
    gardening: [
        'https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592150621344-22d761889a71?auto=format&fit=crop&w=800&q=80'
    ],
    seeds: [
        'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
    ],
    soil: [
        'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ]
};

async function varietyRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const products = await col.find({}).toArray();
        console.log(`Finetuning ${products.length} products with variety...`);
        
        for (const p of products) {
            let list = library.indoor;
            const cat = (p.category || '').toLowerCase();
            if (cat.includes('outdoor')) list = library.outdoor;
            else if (cat.includes('flower')) list = library.flowering;
            else if (cat.includes('garden')) list = library.gardening;
            else if (cat.includes('seed')) list = library.seeds;
            else if (cat.includes('soil') || cat.includes('fertilizer') || cat.includes('nutrient') || cat.includes('media')) list = library.soil;

            const main = list[Math.floor(Math.random() * list.length)];
            const hover = list[Math.floor(Math.random() * list.length)];
            
            await col.updateOne({ _id: p._id }, { $set: { image: main, hoverImage: hover, images: [hover] } });
        }
        console.log('✅ Variety Restoration Finished!');
    } finally {
        await client.close();
    }
}

varietyRestore();
