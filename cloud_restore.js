const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function cloudinaryRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const dumpData = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
        console.log(`Read ${dumpData.length} original products from Cloud dump.`);
        
        let updatedCount = 0;
        for (const p of dumpData) {
            // Update by name and category to match the current DB entries
            const res = await col.updateOne(
                { name: p.name }, 
                { 
                    $set: { 
                        image: p.image, 
                        hoverImage: p.hoverImage, 
                        images: p.images || [], 
                        description: p.description || "" 
                    } 
                }
            );
            if (res.modifiedCount > 0) updatedCount++;
        }
        
        console.log(`✅ SUCCESS! Restored ${updatedCount} products with original Cloudinary images!`);
    } catch (err) {
        console.error('❌ Error during Cloud restore:', err);
    } finally {
        await client.close();
    }
}

cloudinaryRestore();
