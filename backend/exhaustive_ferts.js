const fs = require('fs');
const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));
const ferts = products.filter(p => {
    const n = p.name.toLowerCase();
    const c = p.category.toLowerCase();
    return n.includes('fert') || c.includes('fert') || 
           n.includes('boost') || c.includes('boost') || 
           n.includes('nutri') || c.includes('nutri') ||
           n.includes('manure') || c.includes('manure');
});
console.log(`Found ${ferts.length} products:`);
ferts.forEach(p => console.log(`- ${p.name} | Category: ${p.category}`));
