const fs = require('fs');
const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));
const counts = {};
products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
});
Object.entries(counts).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`${cat}: ${count}`);
});
