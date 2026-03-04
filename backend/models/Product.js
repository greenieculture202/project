const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    price: { type: String, required: true },
    originalPrice: { type: String },
    discount: { type: String },
    discountPercent: { type: Number },
    image: { type: String, required: true },
    hoverImage: { type: String },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    videoUrl: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    variants: [{
        name: { type: String }, // e.g. "250g", "500g", "1kg", "2kg", "5kg"
        price: { type: String },
        originalPrice: { type: String }
    }]
});

// Create text index for searching
productSchema.index({
    name: 'text',
    category: 'text',
    tags: 'text',
    description: 'text'
}, {
    weights: {
        name: 10,
        category: 5,
        tags: 3,
        description: 1
    },
    name: "ProductTextIndex"
});

module.exports = mongoose.model('Product', productSchema);
