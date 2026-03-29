const fs = require('fs');

const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));

const ferts = products.filter(p => {
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    return name.includes('fertilizer') || cat.includes('fertilizer') ||
           name.includes('booster') || cat.includes('booster') ||
           name.includes('nutrient') || cat.includes('nutrient') ||
           cat === 'organic fertilizers' || cat === 'chemical fertilizers' ||
           cat === 'growth boosters' || cat === 'plant boosters' || cat === 'plant growth booster';
});

console.log(`Found ${ferts.length} products:`);
const counts = {};
ferts.forEach(p => {
    console.log(`- ${p.name} | Category: ${p.category}`);
    counts[p.category] = (counts[p.category] || 0) + 1;
});

console.log('\nCounts by Category:');
console.log(JSON.stringify(counts, null, 2));

const categoryMap = ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters', 'Growth Boosters', 'Plant Growth Booster', 'Fertilizers'];
const mapped = ferts.filter(p => categoryMap.includes(p.category));
console.log(`\nProducts covered by current mapping: ${mapped.length}`);
const missing = ferts.filter(p => !categoryMap.includes(p.category));
console.log(`\nMissing products categories:`);
missing.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));
