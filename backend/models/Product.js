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
    tags: [{ type: String }]
});

module.exports = mongoose.model('Product', productSchema);
