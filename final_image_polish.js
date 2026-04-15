const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function finalPolish() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const fallback = 'https://res.cloudinary.com/dcgxf7dcu/image/upload/v1774377646/187cd302-ed34-4dff-8708-fabc58b38f01.d1aecbe0797f49d8bdd0757c1321df94_n8pzjm.jpg';
        
        const res = await col.updateMany(
            { $or: [ { image: /unsplash/i }, { image: "" }, { image: null } ] },
            { $set: { image: fallback, hoverImage: fallback } }
        );
        
        console.log(`✅ Final Polish: Updated ${res.modifiedCount} remaining products with a high-quality Cloudinary fallback.`);
    } finally {
        await client.close();
    }
}

finalPolish();
