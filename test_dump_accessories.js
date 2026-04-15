const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
const accessories = dump.filter(p => p.category && p.category.toLowerCase().includes('accessories'));
console.log(`Found ${accessories.length} accessories.`);
console.log(JSON.stringify(accessories.slice(0, 5), null, 2));
