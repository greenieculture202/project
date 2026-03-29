const fs = require('fs');
const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));
const ferts = products.filter(p => p.name.toLowerCase().includes('fertilizer') || p.category.toLowerCase().includes('fertilizer'));
const cats = [...new Set(ferts.map(p => p.category))];
console.log('Unique Fertilizer Categories:');
cats.forEach(c => console.log(`- ${c}`));
console.log(`\nTotal Fertilizers found by name/cat match: ${ferts.length}`);
