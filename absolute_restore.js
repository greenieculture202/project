const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function absoluteRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
        console.log(`Force-synching ${dump.length} dump entries with DB.`);

        let matchCount = 0;
        for (const d of dump) {
            // Force update by name (case insensitive)
            const res = await col.updateOne(
                { name: { $regex: new RegExp(`^${d.name}$`, 'i') } },
                { 
                    $set: { 
                        image: d.image, 
                        hoverImage: d.hoverImage,
                        images: d.images || [],
                        description: d.description || ""
                    } 
                }
            );
            if (res.modifiedCount > 0) matchCount++;
            
            // If still no match, try by slug
            if (res.modifiedCount === 0 && d.slug) {
                const resSlug = await col.updateOne(
                    { slug: d.slug },
                    { 
                        $set: { 
                            image: d.image, 
                            hoverImage: d.hoverImage,
                            images: d.images || [],
                            description: d.description || ""
                        } 
                    }
                );
                if (resSlug.modifiedCount > 0) matchCount++;
            }
        }
        
        console.log(`✅ ABSOLUTE SUCCESS! Forced restore for ${matchCount} products from original Cloudinary dump.`);
    } finally {
        await client.close();
    }
}

absoluteRestore();
