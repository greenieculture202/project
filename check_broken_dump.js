const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
const targetItems = ['Garden Statue', 'Drip Irrigation Kit', 'Garden Border Fence', 'Watering Can'];
const found = dump.filter(p => targetItems.includes(p.name));
console.log(JSON.stringify(found, null, 2));
