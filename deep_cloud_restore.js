const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function deepCloudRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const dumpData = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
        console.log(`Deep scanning dump with ${dumpData.length} records...`);
        
        let fixedCount = 0;
        let stillBroken = 0;

        const currentProducts = await col.find({}).toArray();
        
        for (const p of currentProducts) {
            // If image is still Unsplash or missing, try to find in dump
            if (!p.image || p.image.includes('unsplash.com') || p.image.includes('placeholder')) {
                // Try exact match first
                let match = dumpData.find(d => d.name.toLowerCase() === p.name.toLowerCase());
                
                // Try slug match if not found
                if (!match && p.slug) {
                    match = dumpData.find(d => d.slug === p.slug);
                }
                
                // Try name part match
                if (!match) {
                    match = dumpData.find(d => d.name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(d.name.toLowerCase()));
                }

                if (match) {
                    await col.updateOne({ _id: p._id }, { 
                        $set: { 
                            image: match.image, 
                            hoverImage: match.hoverImage, 
                            images: match.images || [],
                            description: match.description || ""
                        } 
                    });
                    fixedCount++;
                } else {
                    stillBroken++;
                }
            }
        }
        
        console.log(`✅ Fixed ${fixedCount} more products using deep matching!`);
        console.log(`⚠️  Still ${stillBroken} products without a clear match (possibly new products).`);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.close();
    }
}

deepCloudRestore();
