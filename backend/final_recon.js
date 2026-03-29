const fs = require('fs');
const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));

const soilCats = ['Soil & Growing Media', 'Soil Types', 'Organic Amendments', 'Growth Media'];
const fertCats = ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters', 'Growth Boosters', 'Plant Growth Booster', 'Fertilizers'];

const soils = products.filter(p => soilCats.includes(p.category));
const ferts = products.filter(p => fertCats.includes(p.category));

console.log(`Soil Products (${soils.length}):`);
soils.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));

console.log(`\nFertilizer Products (${ferts.length}):`);
ferts.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));

// Additional check for products that MIGHT be missing from categories but belong by name
const missingFerts = products.filter(p => !fertCats.includes(p.category) && 
                      (p.name.toLowerCase().includes('fert') || p.name.toLowerCase().includes('boost')));
console.log(`\nPotential missing fertilizers (matching name but not in cat map):`);
missingFerts.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));
