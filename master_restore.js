const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

const plantImages = [
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512428813833-2a6884044be2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1491147334573-44cbb4602074?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509423350716-97f9360b4e0e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1463930649705-35bd67e2c914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501004318641-739e82894442?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1466692473998-1660f1672390?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520412099521-63bc1e92ec29?auto=format&fit=crop&w=800&q=80'
];

const flowerImages = [
    'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535242208474-9a296c0b0dd3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1444492417251-9c839d358e94?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469598614039-ccfeb0a21111?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464537356976-99e3ec046def?auto=format&fit=crop&w=800&q=80'
];

const toolImages = [
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611843467160-25afb8df1074?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589923170725-d9841f3d819b?auto=format&fit=crop&w=800&q=80'
];

const seedImages = [
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
];

async function masterRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const products = await col.find({}).toArray();
        console.log(`Deep cleaning and restoring ${products.length} products...`);
        
        for (const p of products) {
            let list = plantImages;
            const cat = (p.category || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            
            // Logic: Tools/Accessories/Soil get tool images
            if (cat.includes('tool') || cat.includes('accessory') || cat.includes('soil') || cat.includes('fertilizer') || cat.includes('media')) {
                list = toolImages;
            } 
            // Seeds get seed images
            else if (cat.includes('seed')) {
                list = seedImages;
            }
            // Flowering plants get flower images
            else if (cat.includes('flower') || cat.includes('bloom')) {
                list = flowerImages;
            }
            // Everything else (Indoor, Outdoor, Gardening PLANTS) gets plant images
            else {
                list = plantImages;
            }

            const main = list[Math.floor(Math.random() * list.length)];
            const hover = list[Math.floor(Math.random() * list.length)];
            
            await col.updateOne({ _id: p._id }, { $set: { image: main, hoverImage: hover, images: [hover, list[0]] } });
        }
        console.log('✅ MASTER RESTORE FINISHED - All products have correct, diverse images!');
    } finally {
        await client.close();
    }
}

masterRestore();
