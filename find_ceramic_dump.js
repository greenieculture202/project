const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('./backend/all_products_dump.json', 'utf8'));
const match = dump.find(p => p.name.includes('Ceramic Pots'));
console.log(JSON.stringify(match, null, 2));
