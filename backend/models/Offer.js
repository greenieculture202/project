const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    badge: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    discountLine: { type: String },
    description: { type: String },
    features: [{ type: String }],
    ctaText: { type: String, default: 'GRAB THIS DEAL' },
    ctaLink: { type: String, default: '/' },
    image: { type: String, required: true },
    cardBg: { type: String, default: '#f0fdf4' },
    accentColor: { type: String, default: '#16a34a' },
    accentLight: { type: String, default: '#dcfce7' },
    accentText: { type: String, default: '#14532d' },
    tag: { type: String },
    tagBg: { type: String, default: '#fbbf24' },
    tagText: { type: String, default: '#78350f' },
    timer: { type: String, default: 'Ends Soon!' },
    timerBg: { type: String, default: '#dcfce7' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema);
