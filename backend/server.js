const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('--- BACKEND STARTUP ---');
console.log('Working Directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('--- ---');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Offer = require('./models/Offer');
const offerProductsRouter = require('./routes/offerProducts');
const Placement = require('./models/Placement');
const Review = require('./models/Review');
const Faq = require('./models/Faq');
const AboutSection = require('./models/AboutSection');
const Inquiry = require('./models/Inquiry');
const Notification = require('./models/Notification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenie-secret-key-123';
const GOOGLE_CLIENT_ID = '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID.trim());

// Temporary store for OTPs (in production, use Redis or DB with expiry)
const otpStore = new Map();

const fs = require('fs');
// path already imported at top
const debugLog = (msg) => {
    const logPath = path.join(__dirname, 'debug_otp.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
};

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'greenieculture202@gmail.com',
        pass: process.env.GMAIL_PASS || 'your-app-password'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Helper: Send Order Confirmation Email
const sendOrderConfirmationEmail = async (user, order) => {
    try {
        const itemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px;">
                    <span style="font-weight: 500;">${item.name} ${item.isGift ? '<span style="color: #d97706; font-size: 0.8em;">(FREE GIFT)</span>' : ''}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">₹${item.price}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Greenie Culture" <${process.env.GMAIL_USER || 'greenieculture202@gmail.com'}>`,
            to: user.email,
            subject: `Hooray! Your order ${order.orderId} is confirmed 🌿`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eef2f3; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #2d8c6f, #1a5d1a); padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 32px; letter-spacing: -0.5px;">Greenie Culture</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">🌱 Your Green Journey Just Got Better!</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px;">
                        <h2 style="color: #1a5d1a; margin-top: 0;">Order Confirmed!</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${user.fullName.split(' ')[0]},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We've received your order <strong>${order.orderId}</strong>. Our team is already busy picking out the healthiest plants for you!</p>

                        <!-- Order Details Box -->
                        <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 25px 0;">
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">
                                <span style="color: #6b7280; font-size: 14px;">ORDER ID: <strong>${order.orderId}</strong></span>
                                <span style="color: #6b7280; font-size: 14px;">DATE: <strong>${new Date().toLocaleDateString()}</strong></span>
                            </div>

                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Items</th>
                                        <th style="text-align: center; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                                        <th style="text-align: right; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>

                            <div style="margin-top: 20px; text-align: right;">
                                <p style="margin: 5px 0; color: #6b7280;">Payment Method: <strong>${order.paymentMethod}</strong></p>
                                <p style="margin: 10px 0; color: #1a5d1a; font-size: 20px; font-weight: 800;">Total: ₹${order.totalAmount}</p>
                            </div>
                        </div>

                        <!-- Thank You Note -->
                        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #f3f4f6;">
                            <p style="font-size: 18px; color: #2d8c6f; font-weight: 700; margin-bottom: 5px;">Thank you for buying!</p>
                            <p style="color: #6b7280; font-size: 14px;">We'll notify you as soon as your plants leave our greenhouse.</p>
                            
                            <div style="margin-top: 25px;">
                                <a href="http://localhost:3000/my-account/orders" style="background-color: #2d8c6f; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">Track My Order</a>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>Need help? Contact us at support@greenieculture.com</p>
                        <p>&copy; 2026 Greenie Culture. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Order invoice sent to ${user.email} for ${order.orderId}`);
    } catch (err) {
        console.error('[EMAIL-ERROR] Failed to send invoice:', err.message);
    }
};

// Auth Middleware
const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;

        // Ensure user is not blocked (Skip for special admin bypass)
        if (req.user.id && req.user.id !== 'admin-special-id') {
            const activeUser = await User.findById(req.user.id).select('isBlocked').lean();
            if (activeUser && activeUser.isBlocked) {
                return res.status(403).json({ message: 'Something went wrong. Please try again.' });
            }
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/admin/offers', offerProductsRouter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.split('@')[1] ? 'mongodb+srv://***@' + MONGODB_URI.split('@')[1] : MONGODB_URI);
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Active Database:', mongoose.connection.name);
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Admin Login - returns a real JWT for admin dashboard API calls
app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@greenie.com' && password === 'radheradhe') {
        // Create a special admin JWT (using a fixed admin ID)
        const token = jwt.sign(
            { user: { id: 'admin-special-id', isAdmin: true } },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        return res.json({ token, isAdmin: true });
    }
    return res.status(401).json({ message: 'Invalid admin credentials' });
});

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

        // Check for user (case-insensitive lookup)
        const user = await User.findOne({ email: email.toLowerCase() }).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Something went wrong. Please try again.' });
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

        jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { _id: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic, role: user.role } });
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

        let user = await User.findOne({ email: email.toLowerCase() }).lean();

        if (user && user.isBlocked) {
            return res.status(403).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!user) {
            const newUser = new User({
                fullName: name,
                email: email.toLowerCase(),
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                phone: 'Not provided',
                address: 'Not provided',
                profilePic: picture,
                method: 'Google'
            });
            user = await newUser.save();
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
        });
    } catch (err) {
        console.error('[GOOGLE-LOGIN] Error:', err.message);
        res.status(401).json({ message: 'Google verification failed', details: err.message });
    }
});

app.post('/api/auth/google-login/request-otp', async (req, res) => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });

        const { email } = ticket.getPayload();

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with expiry (5 mins)
        otpStore.set(email.toLowerCase(), {
            otp,
            idToken, // Store idToken to use it for final login after verification
            expires: Date.now() + 5 * 60 * 1000
        });

        console.log(`[GOOGLE-OTP] Generated ${otp} for ${email}`);
        debugLog(`Generated OTP: ${otp} for ${email}`);

        // Send professional email
        const mailOptions = {
            from: `"Greenie Culture" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `${otp} is your Greenie Culture verification code`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #2d8c6f; margin: 0; font-size: 28px;">Greenie Culture</h1>
                        <p style="color: #666; font-size: 14px; margin-top: 5px;">Your Green Journey Starts Here</p>
                    </div>
                    
                    <div style="padding: 20px; background-color: #f9fdfb; border-radius: 8px; text-align: center;">
                        <h2 style="color: #1a5d1a; margin-bottom: 15px;">Verify Your Identity</h2>
                        <p style="color: #444; font-size: 16px;">Hello,</p>
                        <p style="color: #444; font-size: 16px;">Use the following code to complete your Google Login at Greenie Culture:</p>
                        
                        <div style="margin: 25px 0; padding: 15px; background: #ffffff; border: 2px dashed #2d8c6f; display: inline-block; border-radius: 10px;">
                            <span style="font-size: 36px; font-weight: bold; color: #1a5d1a; letter-spacing: 5px;">${otp}</span>
                        </div>
                        
                        <p style="color: #666; font-size: 13px;">This code will expire in 5 minutes.</p>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #888; font-size: 12px; text-align: center;">
                        <p>If you did not request this code, please ignore this email.</p>
                        <p>&copy; 2026 Greenie Culture. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[GOOGLE-OTP] Email sent to ${email}`);
            res.json({ message: 'OTP sent to your Gmail', email });
        } catch (mailError) {
            console.error('[GOOGLE-OTP] Mail error:', mailError.message);
            debugLog(`Mail error for ${email}: ${mailError.message}`);
            res.status(500).json({ message: 'Failed to send verification email. Please check server configuration.' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Google verification failed', details: err.message });
    }
});

app.post('/api/auth/google-login/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = otpStore.get(email.toLowerCase());

        if (!record) {
            return res.status(400).json({ message: 'OTP expired or not requested' });
        }

        if (record.expires < Date.now()) {
            otpStore.delete(email.toLowerCase());
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP Valid - Now proceed with standard Google login logic
        const { idToken } = record;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });

        const { name, picture } = ticket.getPayload();

        // Remove OTP after successful use
        otpStore.delete(email.toLowerCase());

        let user = await User.findOne({ email: email.toLowerCase() }).lean();

        if (user && user.isBlocked) {
            return res.status(403).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!user) {
            const newUser = new User({
                fullName: name,
                email: email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
                phone: 'Not provided',
                address: 'Not provided',
                profilePic: picture,
                method: 'Google'
            });
            user = await newUser.save();
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
        });

    } catch (err) {
        res.status(500).json({ message: 'Verification failed', details: err.message });
    }
});

// Cart Routes
app.get('/api/cart', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json([]);
        }
        const user = await User.findById(req.user.id).select('cart').lean();
        res.json(user?.cart || []);
    } catch (err) {
        console.error('[CART] Fetch error:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/cart', auth, async (req, res) => {
    try {
        const { cart } = req.body;
        // Skip DB update for special admin ID to avoid CastError
        if (req.user.id === 'admin-special-id') {
            return res.json({ message: 'Cart updated successfully (Admin mode)' });
        }
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

// API Routes for Reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();
        res.json(reviews);
    } catch (err) {
        console.error('[ReviewsAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { userName, rating, description, date } = req.body;

        if (!rating || !description) {
            return res.status(400).json({ message: 'Rating and description are required' });
        }

        const newReview = new Review({
            userName: userName || 'Guest User',
            rating: Number(rating),
            description,
            date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        console.error('[ReviewsAPI] Save error:', err.message);
        res.status(500).json({ message: 'Server error saving review' });
    }
});

// API Routes for Products
app.get('/api/products', async (req, res) => {
    try {
        const { category, limit } = req.query;
        console.log(`[ProductsAPI] Query: "${category}" | Limit: ${limit}`);

        let query = {};
        if (category) {
            let decodedCategory = decodeURIComponent(category).trim();

            // --- SPECIAL CASE: Dynamic Bestsellers based on Orders ---
            if (decodedCategory === 'Bestsellers') {
                const limitNum = parseInt(limit) || 20;
                const topSelling = await Order.aggregate([
                    { $unwind: "$items" },
                    {
                        $group: {
                            _id: "$items.name",
                            totalSold: { $sum: "$items.quantity" }
                        }
                    },
                    { $sort: { totalSold: -1 } },
                    { $limit: limitNum }
                ]);

                let sortedProducts = [];
                if (topSelling.length > 0) {
                    const productNames = topSelling.map(s => s._id);
                    const products = await Product.find({ name: { $in: productNames } }).lean();
                    sortedProducts = topSelling
                        .map(s => products.find(p => p.name === s._id))
                        .filter(p => !!p);
                }

                // Pad with static Bestsellers if not enough order data
                if (sortedProducts.length < limitNum) {
                    const existingIds = sortedProducts.map(p => p._id);
                    const padding = await Product.find({
                        category: 'Bestsellers',
                        _id: { $nin: existingIds }
                    }).limit(limitNum - sortedProducts.length).lean();
                    sortedProducts = [...sortedProducts, ...padding];
                }

                console.log(`[ProductsAPI] Returning ${sortedProducts.length} Bestsellers`);
                return res.json(sortedProducts);
            }

            // Broaden search for main categories
            let usePartial = false;
            if (['seeds', 'plants', 'accessories', 'soil'].some(c => decodedCategory.toLowerCase().includes(c))) {
                usePartial = true;
            }

            // Normalize names for better matching
            let normalized = decodedCategory.replace(/[-\s]+/g, '[-\\s]+');
            const regex = new RegExp(`^${normalized}$`, 'i');

            // Partial regex for matching tags or nested category strings
            const partialPattern = decodedCategory.replace(/[-\s]+/g, '.*');
            const partialRegex = new RegExp(partialPattern, 'i');

            if (usePartial) {
                // If it's a major category, pull EVERYTHING that matches the term anywhere
                query = {
                    $or: [
                        { category: { $regex: partialRegex } },
                        { tags: { $regex: partialRegex } }
                    ]
                };
            } else {
                // For specific sub-categories, be more precise but still allow tag matches
                query = {
                    $or: [
                        { category: decodedCategory },
                        { tags: decodedCategory },
                        { category: { $regex: regex } },
                        { tags: { $regex: regex } },
                        { category: { $regex: new RegExp(decodedCategory.replace(/[-\s]+/g, '.*'), 'i') } },
                        { tags: { $regex: new RegExp(decodedCategory.replace(/[-\s]+/g, '.*'), 'i') } }
                    ]
                };
            }
            console.log(`[ProductsAPI] Querying for: "${decodedCategory}" (Partial: ${usePartial})`);
            console.log(`[ProductsAPI] DB Query Object: ${JSON.stringify(query)}`);
        }

        let productsQuery = Product.find(query).lean();

        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                productsQuery = productsQuery.limit(limitNum);
            }
        }

        const products = await productsQuery;
        console.log(`[ProductsAPI] Found ${products.length} products for "${category || 'all'}"`);
        res.json(products);
    } catch (err) {
        console.error('[ProductsAPI] Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);

        console.log(`[Backend Search] Processing query: "${q}"`);

        // Use text search for performance if possible, with regex fallback
        // Text search is generally faster and handles weights
        const products = await Product.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(50)
            .select('name category price originalPrice discount image slug tags')
            .lean();

        // If text search yields few results, fallback to regex for partial matches
        if (products.length < 5) {
            const searchTerms = q.split(' ').filter(term => term.length > 0);
            const regexes = searchTerms.map(term => new RegExp(term, 'i'));

            const regexProducts = await Product.find({
                $or: [
                    { name: { $regex: new RegExp(q, 'i') } },
                    { category: { $regex: new RegExp(q, 'i') } },
                    { tags: { $regex: new RegExp(q, 'i') } },
                    ...(searchTerms.length > 1 ? [{ $and: regexes.map(r => ({ name: { $regex: r } })) }] : [])
                ]
            })
                .limit(50)
                .select('name category price originalPrice discount image slug tags')
                .lean();

            // Merge and de-duplicate
            const combined = [...products, ...regexProducts];
            const unique = Array.from(new Map(combined.map(p => [p._id.toString(), p])).values());
            return res.json(unique.slice(0, 50));
        }

        res.json(products);
    } catch (err) {
        console.error('[SearchAPI] Error:', err.message);
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

        // Inject Dynamic Bestsellers into the map
        const topSelling = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 20 }
        ]);

        let bestSellers = [];
        if (topSelling.length > 0) {
            bestSellers = topSelling
                .map(s => products.find(p => p.name === s._id))
                .filter(p => !!p);
        }

        // Pad with static Bestsellers up to 20
        if (bestSellers.length < 20) {
            const existingIds = new Set(bestSellers.map(p => p._id.toString()));
            const staticBS = products.filter(p => p.category === 'Bestsellers' && !existingIds.has(p._id.toString()));
            bestSellers = [...bestSellers, ...staticBS.slice(0, 20 - bestSellers.length)];
        }
        productMap['Bestsellers'] = bestSellers;

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

// Dashboard Stats API
app.get('/api/user/dashboard', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const [user, orderCount, recentOrders] = await Promise.all([
            User.findById(userId).select('greenPoints fullName'),
            Order.countDocuments({ userId }),
            Order.find({ userId }).sort({ orderDate: -1 }).limit(5).lean()
        ]);

        res.json({
            stats: {
                totalOrders: orderCount,
                greenPoints: user.greenPoints || 0
            },
            recentOrders: recentOrders
        });
    } catch (err) {
        console.error('[DashboardStats] Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Orders API - GET all orders for current user
app.get('/api/user/orders', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json([]);
        }
        const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 }).lean();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// User Orders API - POST place new order
app.post('/api/user/orders', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.status(403).json({ message: 'Admin cannot place regular orders' });
        }
        const { items, totalAmount, paymentMethod, transactionId, paymentScreenshot, appliedOfferCode, offerBenefit } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        const newOrder = new Order({
            userId: req.user.id,
            userName: req.user.fullName || 'User',
            items: items,
            totalAmount: totalAmount,
            deliveryCharge: req.body.deliveryCharge || 0,
            paymentMethod: paymentMethod || 'UPI',
            status: 'Pending',
            transactionId: transactionId || '',
            paymentScreenshot: paymentScreenshot || '',
            paymentStatus: (paymentMethod === 'Cash on Delivery') ? 'Received' : 'Pending',
            appliedOfferCode: appliedOfferCode || null,
            offerBenefit: offerBenefit || null
        });

        const savedOrder = await newOrder.save();
        console.log(`[OrdersAPI] New order placed: ${savedOrder.orderId} for user ${req.user.id}`);

        // Deduct stock for each item in the order
        for (const item of items) {
            if (item.productId) {
                try {
                    const product = await Product.findById(item.productId);
                    if (product) {
                        const reduceBy = Number(item.quantity) || 1;
                        let currentStock = product.stock !== undefined ? product.stock : 25;
                        currentStock = Math.max(0, currentStock - reduceBy); // Prevent negative stock
                        product.stock = currentStock;
                        await product.save();
                        console.log(`[OrdersAPI] Reduced stock for product ${product.name} to ${product.stock}`);

                        // --- LOW STOCK NOTIFICATION STRATEGY ---
                        if (currentStock <= 5) {
                            try {
                                const newNoti = new Notification({
                                    type: 'LowStock',
                                    title: 'Low Stock Alert 📉',
                                    message: `Stock for ${product.name} has fallen to ${currentStock}. Time to restock!`,
                                    product: {
                                        id: product._id,
                                        name: product.name,
                                        image: product.image,
                                        price: product.price,
                                        stock: currentStock
                                    }
                                });
                                await newNoti.save();
                                console.log(`[OrdersAPI] Generated Low Stock Notification for: ${product.name}`);
                            } catch (notiErr) {
                                console.error('[OrdersAPI] Failed to generate low stock notification:', notiErr.message);
                            }
                        }
                    }
                } catch (err) {
                    // Log error but don't fail the order if stock update fails
                    console.error(`[OrdersAPI] Error updating stock for product ${item.productId}:`, err.message);
                }
            }
        }

        // Asynchronously send the invoice email
        sendOrderConfirmationEmail(req.user, savedOrder);

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('[OrdersAPI] Error placing order:', err.message);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// Admin Orders API
app.get('/api/admin/orders', auth, async (req, res) => {
    try {
        // Fetch all orders, populate user details
        const orders = await Order.find({})
            .populate('userId', 'fullName email phone alternatePhone address city state')
            .sort({ orderDate: -1 })
            .lean();
        res.json(orders);
    } catch (err) {
        console.error('[AdminOrdersAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/status', auth, async (req, res) => {
    try {
        const { status, courierName, trackingNumber } = req.body;
        if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        const updateData = { status };
        if (courierName) updateData.courierName = courierName;
        if (trackingNumber) updateData.trackingNumber = trackingNumber;

        // Automatically set to Shipped if courier and tracking are provided
        if (courierName && trackingNumber && status !== 'Delivered' && status !== 'Cancelled') {
            updateData.status = 'Shipped';
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error('[AdminOrdersAPI] Update error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/payment-status', auth, async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!['Pending', 'Received', 'Failed'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        ).populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log(`[AdminOrdersAPI] Payment verified for Order ${order.orderId}: ${paymentStatus}`);
        res.json(order);
    } catch (err) {
        console.error('[AdminOrdersAPI] Payment status update error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


// User Profile API
app.get('/api/user/profile', auth, async (req, res) => {
    try {
        console.log(`[ProfileAPI] Loading profile for ID: ${req.user.id}`);
        if (req.user.id === 'admin-special-id') {
            return res.json({
                _id: 'admin-special-id',
                fullName: 'System Admin',
                email: 'admin@greenie.com',
                role: 'admin',
                profilePic: 'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
            });
        }
        const user = await User.findById(req.user.id).select('-password').lean();
        if (!user) {
            console.log(`[ProfileAPI] User not found: ${req.user.id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('[ProfileAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/user/profile', auth, async (req, res) => {
    try {
        console.log(`[ProfileAPI] Update attempt for ID: ${req.user.id}`);
        const { fullName, phone, alternatePhone, address, profilePic, city, state } = req.body;
        console.log(`[ProfileAPI] Fields received: ${Object.keys(req.body).join(', ')}`);

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        if (alternatePhone !== undefined) updateData.alternatePhone = alternatePhone;
        if (address) updateData.address = address;
        if (profilePic) updateData.profilePic = profilePic;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;

        if (req.user.id === 'admin-special-id') {
            return res.json({
                _id: 'admin-special-id',
                fullName: fullName || 'System Admin',
                email: 'admin@greenie.com',
                role: 'admin'
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password').lean();

        if (!updatedUser) {
            console.log(`[ProfileAPI] User not found for update: ${req.user.id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('[ProfileAPI] Profile updated successfully');
        res.json(updatedUser);
    } catch (err) {
        console.error('[ProfileAPI] Update error details:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ADMIN API - Notifications
app.get('/api/admin/notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: { $exists: false } })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        res.json(notifications);
    } catch (err) {
        console.error('[AdminNotificationsAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

app.put('/api/admin/notifications/:id/read', auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('[AdminNotificationsAPI] Read error:', err.message);
        res.status(500).json({ message: 'Server error marking notification read' });
    }
});

app.delete('/api/admin/notifications/:id', auth, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('[AdminNotificationsAPI] Delete error:', err.message);
        res.status(500).json({ message: 'Server error deleting notification' });
    }
});

app.put('/api/admin/notifications/read', auth, async (req, res) => {
    try {
        await Notification.updateMany({ userId: { $exists: false }, isRead: false }, { isRead: true });
        res.json({ message: 'All admin notifications marked as read' });
    } catch (err) {
        console.error('[AdminNotificationsAPI] Read error:', err.message);
        res.status(500).json({ message: 'Server error marking notifications read' });
    }
});

// ADMIN API - Offers
app.get('/api/admin/offers', auth, async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ createdAt: -1 }).lean();
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.post('/api/admin/offers', auth, async (req, res) => {
    try {
        const newOffer = new Offer(req.body);
        const savedOffer = await newOffer.save();
        console.log('[AdminAPI] Offer created:', savedOffer.title);
        res.status(201).json(savedOffer);
    } catch (err) {
        console.error('[AdminAPI] Offer creation error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.put('/api/admin/offers/:id', auth, async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        console.log('[AdminAPI] Offer updated:', updatedOffer.title);
        res.json(updatedOffer);
    } catch (err) {
        console.error('[AdminAPI] Offer update error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.delete('/api/admin/offers/:id', auth, async (req, res) => {
    try {
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        console.log('[AdminAPI] Offer deleted:', deletedOffer.title);
        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] Offer deletion error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Placements (Videos)
app.get('/api/admin/placements', auth, async (req, res) => {
    try {
        const placements = await Placement.find({}).sort({ createdAt: -1 }).lean();
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.post('/api/admin/placements', auth, async (req, res) => {
    try {
        const newPlacement = new Placement(req.body);
        const savedPlacement = await newPlacement.save();
        console.log('[AdminAPI] Placement created:', savedPlacement.name);
        res.status(201).json(savedPlacement);
    } catch (err) {
        console.error('[AdminAPI] Placement creation error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.put('/api/admin/placements/:id', auth, async (req, res) => {
    try {
        const updatedPlacement = await Placement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPlacement) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        console.log('[AdminAPI] Placement updated:', updatedPlacement.name);
        res.json(updatedPlacement);
    } catch (err) {
        console.error('[AdminAPI] Placement update error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.delete('/api/admin/placements/:id', auth, async (req, res) => {
    try {
        const deletedPlacement = await Placement.findByIdAndDelete(req.params.id);
        if (!deletedPlacement) {
            return res.status(404).json({ message: 'Placement not found' });
        }
        console.log('[AdminAPI] Placement deleted:', deletedPlacement.name);
        res.json({ message: 'Placement deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] Placement deletion error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Public API for Placements
app.get('/api/placements', async (req, res) => {
    try {
        const placements = await Placement.find({}).sort({ createdAt: -1 }).lean();
        res.json(placements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Public API for FAQ
app.get('/api/faqs', async (req, res) => {
    try {
        const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 }).lean();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - FAQs
app.get('/api/admin/faqs', auth, async (req, res) => {
    try {
        const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 }).lean();
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.post('/api/admin/faqs', auth, async (req, res) => {
    try {
        const newFaq = new Faq(req.body);
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.put('/api/admin/faqs/:id', auth, async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFaq);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.delete('/api/admin/faqs/:id', async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Public API for About Us Sections
app.get('/api/about-sections', async (req, res) => {
    try {
        const sections = await AboutSection.find({}).sort({ order: 1, createdAt: -1 }).lean();
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - About Us Sections
app.get('/api/admin/about-sections', auth, async (req, res) => {
    try {
        const sections = await AboutSection.find({}).sort({ order: 1, createdAt: -1 }).lean();
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.post('/api/admin/about-sections', auth, async (req, res) => {
    try {
        const newSection = new AboutSection(req.body);
        const saved = await newSection.save();
        console.log('[AdminAPI] About section created:', saved.title);
        res.status(201).json(saved);
    } catch (err) {
        console.error('[AdminAPI] About section creation error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.put('/api/admin/about-sections/:id', auth, async (req, res) => {
    try {
        const updated = await AboutSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Section not found' });
        console.log('[AdminAPI] About section updated:', updated.title);
        res.json(updated);
    } catch (err) {
        console.error('[AdminAPI] About section update error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.delete('/api/admin/about-sections/:id', auth, async (req, res) => {
    try {
        const deleted = await AboutSection.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Section not found' });
        console.log('[AdminAPI] About section deleted:', deleted.title);
        res.json({ message: 'Section deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] About section deletion error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Public API for Offers
app.get('/api/offers', async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ createdAt: -1 }).lean();
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN API - Get all users
app.get('/api/admin/users', auth, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ADMIN API - Update user
app.put('/api/admin/users/:id', auth, async (req, res) => {
    try {
        const { fullName, email, phone, address, greenPoints } = req.body;

        const updateData = {
            fullName,
            email,
            phone,
            address,
            greenPoints: Number(greenPoints) || 0
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('[AdminAPI] User updated:', updatedUser.fullName);
        res.json(updatedUser);
    } catch (err) {
        console.error('[AdminAPI] User update error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('[AdminAPI] User deleted:', deletedUser.fullName);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] User deletion error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Block/Unblock user
app.put('/api/admin/users/:id/block', auth, async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(`[AdminAPI] User ${user.fullName} ${isBlocked ? 'blocked' : 'unblocked'}`);
        res.json(user);
    } catch (err) {
        console.error('[AdminAPI] User block error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Update product
app.put('/api/admin/products/:id', auth, async (req, res) => {
    try {
        const { name, price, originalPrice, discount, category, image, images, description, tags, stock } = req.body;

        const updateData = {
            name,
            price,
            originalPrice,
            discount,
            category,
            stock: stock !== undefined ? Number(stock) : 25,
            image,
            images,
            description,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('[AdminAPI] Product updated:', updatedProduct.name);
        res.json(updatedProduct);
    } catch (err) {
        console.error('[AdminAPI] Product update error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Delete product
app.delete('/api/admin/products/:id', auth, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('[AdminAPI] Product deleted:', deletedProduct.name);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] Product deletion error:', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Add new product
app.post('/api/admin/products', auth, async (req, res) => {
    try {
        const { name, price, originalPrice, discount, category, image, images, description, tags, stock } = req.body;

        if (!name || !price || !category || !image) {
            return res.status(400).json({ message: 'Name, price, category, and image are required.' });
        }

        // Generate unique slug with short random suffix to avoid duplicate key errors
        const baseSlug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        const newProduct = new Product({
            name,
            slug,
            price,
            originalPrice,
            discount,
            category,
            image,
            images: Array.isArray(images) ? images : [],
            description: description || '',
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
            stock: stock !== undefined ? Number(stock) : 25
        });

        const savedProduct = await newProduct.save();
        console.log('[AdminAPI] Product created:', savedProduct.name, '| Category:', savedProduct.category);
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('[AdminAPI] Product creation error:', err.message);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A product with this name already exists. Please use a different name.' });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN API - Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed default placements if none exist
const seedPlacements = async () => {
    try {
        const count = await Placement.countDocuments();
        if (count < 6) {
            // If we have fewer than 6, let's reset to ensure user gets all original 6
            if (count > 0) {
                await Placement.deleteMany({});
                console.log('[SEED] Clearing old placements for fresh full seed...');
            }

            const defaultPlacements = [
                {
                    name: 'SmartLeaf Indoors',
                    description: 'The living room is the heart of your home. Adding plants here creates a welcoming atmosphere and naturally purifies the air.',
                    image: '/images/smartleaf_indoors.jpg',
                    videoUrl: '/videos/living-room.mp4',
                    features: ['Air Purifying', 'Low Maintenance', 'Stunning Decor'],
                    badge: 'LIVING SPACES',
                    categoryRoute: '/products/indoor-plants'
                },
                {
                    name: 'EcoScape Outdoors',
                    description: 'Transform your garden or balcony with plants that thrive under the open sky and enhance your outdoor living.',
                    image: '/images/outdoor_vibe_new.jpg',
                    videoUrl: '/videos/outdoor.mp4',
                    features: ['Weather Resistant', 'Sun Loving', 'Natural Growth'],
                    badge: 'OUTDOOR LIVING',
                    categoryRoute: '/products/outdoor-plants'
                },
                {
                    name: 'Gardening',
                    description: 'Start your own green journey. Our gardening kits and plants are perfect for both beginners and experts.',
                    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
                    videoUrl: '/videos/gardening.mp4',
                    features: ['Beginner Friendly', 'Complete Kits', 'Sustainable'],
                    badge: 'START GROWING',
                    categoryRoute: '/products/gardening'
                },
                {
                    name: 'EcoHaven Rooftop',
                    description: 'Elevate your urban living with a sustainable rooftop garden that brings nature closer to the sky.',
                    image: '/images/rooftop_garden.jpg',
                    videoUrl: '/videos/ecohaven.mp4',
                    features: ['Sustainable Living', 'Urban Oasis', 'Low Carbon Footprint'],
                    badge: 'ECO FRIENDLY',
                    categoryRoute: '/products/outdoor-plants'
                },
                {
                    name: 'miniheaven balcony',
                    description: 'Create your own mini heaven in your balcony with our curated collection of outdoor plants that flourish in open spaces.',
                    image: '/images/miniheaven_balcony.jpg',
                    videoUrl: '/videos/home_balcony.mp4',
                    features: ['Sun Loving', 'Urban Oasis', 'Low Maintenance'],
                    badge: 'BALCONY GARDEN',
                    categoryRoute: '/products/flowering-plants'
                },
                {
                    name: 'kitchen',
                    description: 'Fresh herbs and air-purifying plants make your kitchen a more vibrant and healthy place to cook and gather.',
                    image: '/images/kitchen_image.jpg',
                    videoUrl: '/videos/kitchen.mp4',
                    features: ['Culinary Herbs', 'Air Purifying', 'Compact Size'],
                    badge: 'FRESH COOKING',
                    categoryRoute: '/products/indoor-plants'
                }
            ];
            await Placement.insertMany(defaultPlacements);
            console.log('[SEED] Default placements seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding placements:', err.message);
    }
};

const seedFaqs = async () => {
    try {
        const count = await Faq.countDocuments();
        if (count === 0) {
            const defaultFaqs = [
                {
                    category: 'Orders',
                    question: 'How do I track my order?',
                    answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard under "My Orders".',
                    order: 1
                },
                {
                    category: 'Payment',
                    question: 'What payment methods do you accept?',
                    answer: 'We accept UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery. All transactions are 100% secure.',
                    order: 2
                },
                {
                    category: 'Delivery',
                    question: 'How long does delivery take?',
                    answer: 'We deliver within 3–7 business days depending on your location. Metro cities usually receive orders within 2–3 days.',
                    order: 3
                },
                {
                    category: 'Plants',
                    question: 'Are the plants safe for pets?',
                    answer: 'Some plants are pet-friendly and some are not. Check the individual product page for a "Pet Safe" badge. Commonly safe plants include Spider Plant, Boston Fern, and Areca Palm.',
                    order: 4
                },
                {
                    category: 'Returns',
                    question: 'What is your return policy?',
                    answer: 'We have a 7-day return/replacement policy. If the plant arrives damaged or dead, simply send us a photo within 7 days and we will send a free replacement.',
                    order: 5
                }
            ];
            await Faq.insertMany(defaultFaqs);
            console.log('[SEED] Default FAQs seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding FAQs:', err.message);
    }
};

// --- Inquiry & Notification System Routes ---

// USER: Submit Inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        const newInquiry = new Inquiry({
            userId: userId || null,
            name,
            email,
            subject,
            message,
            status: 'Pending'
        });

        await newInquiry.save();
        console.log(`[INQUIRY] New message from ${name} (${email})`);
        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: newInquiry });
    } catch (err) {
        console.error('[INQUIRY-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to submit inquiry' });
    }
});

// ADMIN: Get all Inquiries
app.get('/api/admin/inquiries', auth, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN: Reply to Inquiry
app.put('/api/admin/inquiries/:id/reply', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const inquiryId = req.params.id;

        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        inquiry.reply = {
            content,
            repliedAt: new Date(),
            adminId: req.user.id
        };
        inquiry.status = 'Replied';
        await inquiry.save();

        // Create Notification if user is registered
        if (inquiry.userId) {
            const newNotification = new Notification({
                userId: inquiry.userId,
                title: 'Admin Replied to your Inquiry',
                message: `Subject: ${inquiry.subject}. Reply: ${content}`,
                relatedInquiryId: inquiryId
            });
            await newNotification.save();
            console.log(`[NOTIFICATION] Created for user ${inquiry.userId}`);
        }

        res.json({ message: 'Reply submitted and user notified', inquiry });
    } catch (err) {
        console.error('[REPLY-ERROR]', err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// USER: Get Notifications
// USER: Get Notifications
app.get('/api/user/notifications', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json([]);
        }
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// USER: Mark Notification as Read
app.put('/api/user/notifications/:id/read', auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// USER: Delete all notifications
app.delete('/api/user/notifications', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json({ message: 'Notifications cleared (Admin)' });
        }
        await Notification.deleteMany({ userId: req.user.id });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// --- End of Inquiry & Notification System ---

// Start Server
Promise.all([seedPlacements(), seedFaqs()]).then(() => {
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server is running on port ${PORT} at http://127.0.0.1:${PORT}`);
    });
});
