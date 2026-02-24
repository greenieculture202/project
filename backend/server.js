const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenie-secret-key-123';
const GOOGLE_CLIENT_ID = '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('[AUTH] Registration attempt:', req.body);
        const { fullName, email, password, phone, address } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address
        });

        const savedUser = await user.save();
        console.log('[AUTH] User saved to DB:', savedUser._id);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('[AUTH] Registration error:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const payload = {
            user: {
                id: user._id, // User lean() makes it _id instead of id in some contexts, but let's be safe
                email: user.email,
                fullName: user.fullName
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { email: user.email, fullName: user.fullName } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/google-login', async (req, res) => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });

        const { email, name, picture } = ticket.getPayload();

        // Check for user
        let user = await User.findOne({ email }).lean();

        if (!user) {
            // Create user for first time Google login
            const newUser = new User({
                fullName: name,
                email: email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10), // Random dummy password
                phone: 'Not provided',
                address: 'Not provided',
                profilePic: picture
            });
            user = await newUser.save();
        }

        // Create JWT
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { email: user.email, fullName: user.fullName } });
        });
    } catch (err) {
        console.error('[GOOGLE-AUTH] Error:', err.message);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

// Cart Routes
app.get('/api/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('cart').lean();
        res.json(user.cart || []);
    } catch (err) {
        console.error('[CART] Fetch error:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/cart', auth, async (req, res) => {
    try {
        const { cart } = req.body;
        await User.findByIdAndUpdate(req.user.id, { cart });
        res.json({ message: 'Cart updated successfully' });
    } catch (err) {
        console.error('[CART] Save error:', err.message);
        res.status(500).send('Server error');
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Greenie Culture Backend is running');
});

// API Routes for Products
app.get('/api/products', async (req, res) => {
    try {
        const { category, limit } = req.query;
        console.log('Fetching products for category query:', category, 'limit:', limit);

        let query = {};
        if (category) {
            let decodedCategory = decodeURIComponent(category);

            // Fix for Seeds Plants and Accessories Plants
            if (decodedCategory.toLowerCase().includes('seeds')) {
                decodedCategory = 'Seeds';
            } else if (decodedCategory.toLowerCase().includes('accessories')) {
                decodedCategory = 'Accessories';
            }

            // Replace hyphens with space or allow for any separator to handle slugs like 'flower-seeds'
            const searchPattern = decodedCategory.replace(/-/g, '[-\\s]');
            const regex = new RegExp(`^${searchPattern}$`, 'i');

            // Also allow partial match for tags
            const tagRegex = new RegExp(decodedCategory.replace(/-/g, ' '), 'i');

            query = {
                $or: [
                    { category: { $regex: regex } },
                    { tags: { $regex: tagRegex } },
                    // If it's a seed category, also match subcategories like 'Vegetable Seeds'
                    { category: { $regex: new RegExp(`.*${decodedCategory}.*`, 'i') } }
                ]
            };
        }

        let productsQuery = Product.find(query).lean();

        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                productsQuery = productsQuery.limit(limitNum);
            }
        }

        const products = await productsQuery;
        console.log(`Found ${products.length} products for query:`, query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        // Search in name or category
        const regex = new RegExp(q, 'i');
        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { category: { $regex: regex } }
            ]
        }).limit(8).select('name category price image').lean(); // Select only needed fields and lean extension for speed

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/map', async (req, res) => {
    try {
        // Optimization: Only fetch fields needed for the map (assuming we need full objects for some reason, 
        // but if we only need names/images for a list, we should project. 
        // For now, let's at least exclude heavy fields if any, or just rely on the fact that we fixed the main slug issue.
        // Actually, let's use a lean query.)
        const products = await Product.find({}).lean();
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

// Get product by slug (optimized with indexed slug field)
app.get('/api/products/slug/:slug', async (req, res) => {
    try {
        const rawSlug = decodeURIComponent(req.params.slug);
        console.log(`[SlugLookup] Seeking: "${rawSlug}"`);

        // 1. Direct indexed lookup - Instant
        let product = await Product.findOne({ slug: rawSlug }).lean();

        if (!product) {
            console.log(`[SlugLookup] Fast lookup failed for "${rawSlug}", trying fuzzy regex fallback...`);

            // 2. Fallback: Improved regex matching (legacy/edge cases)
            const nameParts = rawSlug.split(/[-\s]+/);
            const namePattern = nameParts
                .filter(part => part.length > 0)
                .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                .join('[^a-z0-9]+');

            const regex = new RegExp(`^[^a-z0-9]*${namePattern}[^a-z0-9]*$`, 'i');
            product = await Product.findOne({ name: { $regex: regex } }).lean();

            if (!product && nameParts.length > 0) {
                const andConditions = nameParts.filter(p => p.length > 0).map(part => ({
                    name: { $regex: new RegExp(part, 'i') }
                }));
                product = await Product.findOne({ $and: andConditions }).lean();
            }
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log(`[SlugLookup] SUCCESS: Found "${product.name}"`);
        res.json(product);
    } catch (err) {
        console.error(`[SlugLookup] ERROR: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
});

// Auth Routes (Mocked for Demo)
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email || !email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Valid Gmail required' });
    }

    // Simulate code generation
    const code = Math.floor(1000 + Math.random() * 9000);
    console.log(`[AUTH] Reset code for ${email}: ${code}`);

    res.json({ message: 'Code generated successfully', debugCode: code });
});

// Start Server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port ${PORT} at http://127.0.0.1:${PORT}`);
});
