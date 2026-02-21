const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String },
    discount: { type: String },
    discountPercent: { type: Number },
    image: { type: String, required: true },
    hoverImage: { type: String },
    category: { type: String, required: true },
    videoUrl: { type: String },
    tags: [{ type: String }]
});

module.exports = mongoose.model('Product', productSchema);
