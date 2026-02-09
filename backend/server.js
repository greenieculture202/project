const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Greenie Culture Backend is running');
});

// API Routes for Products
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/map', async (req, res) => {
    try {
        const products = await Product.find();
        const productMap = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});
        res.json(productMap);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
