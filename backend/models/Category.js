const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Display name, e.g. "Indoor Plants"
    key: { type: String, required: true, unique: true }, // Identifier, e.g. "indoor-plants"
    mainGroup: { 
        type: String, 
        required: true, 
        enum: ['Plants', 'Seeds', 'Accessories'] 
    },
    label: { type: String }, // Optional alternative label
    image: { type: String }, // Image URL as requested by the user
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
