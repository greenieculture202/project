const fs = require('fs');
const products = JSON.parse(fs.readFileSync('all_products_dump.json', 'utf8'));

const navbarDefinitions = {
    'Soil Types': ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix'],
    'Organic Amendments': ['Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure'],
    'Growth Media': ['Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'],
    'Organic Fertilizers': ['Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer'],
    'Chemical Fertilizers': ['Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix'],
    'Plant Boosters': ['Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid']
};

function getProductsFor(names, groupCategory) {
    return products.filter(p => {
        const pName = p.name.toLowerCase();
        const pCat = p.category.toLowerCase();
        const pTags = (p.tags || []).map(t => t.toLowerCase());
        
        return names.some(n => pName.includes(n.toLowerCase())) || 
               pCat === groupCategory.toLowerCase() ||
               pTags.includes(groupCategory.toLowerCase());
    });
}

console.log('--- Reconciliation against Admin Definitions ---');

const soilSubCats = ['Soil Types', 'Organic Amendments', 'Growth Media'];
let allSoil = new Set();
soilSubCats.forEach(cat => {
    const matched = getProductsFor(navbarDefinitions[cat], cat);
    console.log(`${cat}: Found ${matched.length} products`);
    matched.forEach(p => allSoil.add(p._id));
});
console.log(`\nTotal Unique Soil (Admin Logic): ${allSoil.size}`);

const fertSubCats = ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'];
let allFert = new Set();
fertSubCats.forEach(cat => {
    const matched = getProductsFor(navbarDefinitions[cat], cat);
    console.log(`${cat}: Found ${matched.length} products`);
    matched.forEach(p => allFert.add(p._id));
});
console.log(`\nTotal Unique Fertilizer (Admin Logic): ${allFert.size}`);
