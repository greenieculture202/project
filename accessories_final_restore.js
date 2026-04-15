const { MongoClient } = require('mongodb');
const fs = require('fs');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function accessoriesFinalRestore() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('mejor');
        const col = db.collection('products');
        
        const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
        const accessoriesDump = dump.filter(p => p.category && (p.category.includes('Accessories') || p.category.includes('Pots') || p.category.includes('Watering') || p.category.includes('Decorative')));
        
        console.log(`Found ${accessoriesDump.length} original accessory records in dump.`);

        let count = 0;
        for (const item of accessoriesDump) {
            // Strict name match to avoid confusion
            const res = await col.updateOne(
                { name: item.name },
                { $set: { image: item.image, hoverImage: item.hoverImage, images: item.images || [] } }
            );
            if (res.modifiedCount > 0) count++;
        }
        
        console.log(`✅ ACCESSORIES RESTORED: ${count} items updated with original Cloudinary links.`);
        
        // Final sanity check: if any accessory still has unsplash, give it a working tool image from our JSON list
        const toolsJson = JSON.parse(fs.readFileSync('./backend/gardening_tools_images.json', 'utf8'));
        const workingToolImg = toolsJson.find(t => t.image.includes('cloudinary')).image;
        
        const leftover = await col.updateMany(
            { category: /accessories/i, image: /unsplash/i },
            { $set: { image: workingToolImg } }
        );
        console.log(`🛠️ Leftover check: Fixed ${leftover.modifiedCount} more accessories with working fallback.`);

    } finally {
        await client.close();
    }
}

accessoriesFinalRestore();
