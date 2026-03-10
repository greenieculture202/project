const mongoose = require('mongoose');
require('dotenv').config();

const navbarPlants = [
    'Snake Plant', 'Money Plant', 'Areca Palm', 'Aloe Vera', 'Peace Lily',
    'Spider Plant', 'Rubber Plant', 'ZZ Plant', 'Jade Plant', 'Lucky Bamboo',
    'Chinese Evergreen', 'Dracaena', 'Anthurium', 'Boston Fern', 'Calathea',
    'Philodendron', 'Croton', 'Fiddle Leaf Fig', 'English Ivy', 'Orchid'
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const Product = require('./models/Product');
    const products = await Product.find({ category: /Indoor/i }, 'name');
    const dbPlants = products.map(p => p.name);

    console.log('Database has', dbPlants.length, 'indoor plants.');

    const missingInDb = navbarPlants.filter(p => !dbPlants.includes(p));
    console.log('Plants in navbar but missing in DB:');
    console.dir(missingInDb);

    const extraInDb = dbPlants.filter(p => !navbarPlants.includes(p));
    console.log('Plants in DB but not in navbar:');
    console.dir(extraInDb);

    process.exit(0);
});
