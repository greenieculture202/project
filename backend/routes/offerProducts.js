const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Offer = require('../models/Offer');
const Product = require('../models/Product');
// auth middleware removed; routes will be protected at higher level if needed

// Add product to offer
router.post('/:offerId/products', async (req, res) => {
    try {
        const { offerId } = req.params;
        const { productId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(offerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid IDs' });
        }
        const offer = await Offer.findById(offerId);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (offer.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in offer' });
        }
        offer.products.push(productId);
        await offer.save();
        res.json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Remove product from offer
router.delete('/:offerId/products/:productId', async (req, res) => {
    try {
        const { offerId, productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(offerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid IDs' });
        }
        const offer = await Offer.findById(offerId);
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        const index = offer.products.indexOf(productId);
        if (index === -1) return res.status(404).json({ message: 'Product not associated with this offer' });
        offer.products.splice(index, 1);
        await offer.save();
        res.json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
