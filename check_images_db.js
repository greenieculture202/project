const mongoose = require('mongoose');
const Product = require('./backend/models/Product');
const uri = 'mongodb+srv://admin:radheradhe@cluster1.bqxczz3.mongodb.net/mejor?retryWrites=true&w=majority&appName=Cluster1';

async function checkImages() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const products = await Product.find({}, 'name image category hoverImage images');
        console.log(`Total Products: ${products.length}`);

        const missingMain = products.filter(p => !p.image || p.image.includes('placeholder') || p.image === '');
        console.log(`Products with missing/placeholder main image: ${missingMain.length}`);

        if (missingMain.length > 0) {
            console.log('Example missing:', missingMain.slice(0, 3).map(p => ({ name: p.name, img: p.image })));
        }

        const missingHover = products.filter(p => !p.hoverImage);
        console.log(`Products missing hover image: ${missingHover.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();
