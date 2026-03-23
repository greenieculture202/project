const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Offer = require('./models/Offer');
const Placement = require('./models/Placement');
const Faq = require('./models/Faq');
const AboutSection = require('./models/AboutSection');
const Inquiry = require('./models/Inquiry');
const Notification = require('./models/Notification');
const Courier = require('./models/Courier');
const ChatMessage = require('./models/ChatMessage');
const AdminChatMessage = require('./models/AdminChatMessage');
const Review = require('./models/Review');
const { seedPlacements, seedFaqs, seedCouriers, seedReviews, seedPlantReminders } = require('./seed_functions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cron = require('node-cron');
const PlantReminder = require('./models/PlantReminder');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenie-secret-key-123';
const GOOGLE_CLIENT_ID = '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID.trim());

// Temporary store for OTPs (in production, use Redis or DB with expiry)
const otpStore = new Map();

const fs = require('fs');
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
                                <a href="http://localhost:4200/my-account/orders" style="background-color: #2d8c6f; color: white; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">Track My Order</a>
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

// Helper: Send Order Status Update Email
const sendOrderStatusEmail = async (order) => {
    try {
        const userEmail = order.userId?.email;
        if (!userEmail) return;

        let statusText = '';
        let statusMessage = '';
        let trackingSection = '';
        let pinSection = '';

        if (order.status === 'Processing') {
            statusText = 'Order is being processed 🛠️';
            statusMessage = 'Great news! We have started preparing your order for shipment.';
        } else if (order.status === 'Shipped') {
            statusText = 'Order on the move! 🚚';
            statusMessage = `Your package has been handed over to <strong>${order.courierName}</strong>.`;
            const deliveryDate = order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Soon';
            
            trackingSection = `
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 700;">TRACKING ID: ${order.trackingNumber}</p>
                    <p style="margin: 10px 0 0; color: #166534; font-size: 14px;"><strong>Expected Delivery:</strong> ${deliveryDate}</p>
                </div>`;
            
            pinSection = `
                <div style="background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 15px; margin: 15px 0; text-align: center;">
                    <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 700;">DELIVERY VERIFICATION PIN: ${order.deliveryPin}</p>
                </div>`;
        } else if (order.status === 'Delivered') {
            statusText = 'Delivered & Green! 🎁';
            statusMessage = 'Your plants have reached their new home!';
        }

        const mailOptions = {
            from: `"Greenie Culture" <${process.env.GMAIL_USER}>`,
            to: userEmail,
            subject: `Order Update: ${order.orderId} - ${order.status}`,
            html: `<div style="text-align: center;"><h2>${statusText}</h2><p>${statusMessage}</p>${trackingSection}${pinSection}</div>`
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('[EMAIL-ERROR]', err.message);
    }
};

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection (with graceful fallback so server can still start)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mejor';
console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.split('@')[1] ? 'mongodb+srv://***@' + MONGODB_URI.split('@')[1] : MONGODB_URI);

let hasDbConnection = false;

async function bootstrapServer() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });

        hasDbConnection = true;
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Active Database:', mongoose.connection.name);

        console.log('🔄 Starting data seeding...');
        try {
            // Use locally defined seeds or imported ones
            if (typeof seedPlacements === 'function') await seedPlacements();
            if (typeof seedFaqs === 'function') await seedFaqs();
            if (typeof seedCouriers === 'function') await seedCouriers();
            if (typeof seedReviews === 'function') await seedReviews();
            if (typeof seedPlantReminders === 'function') await seedPlantReminders();
            console.log('✅ Seeding completed');
        } catch (seedErr) {
            console.error('⚠️ Seeding internal error:', seedErr.message);
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    } finally {
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`🚀 Server is running on port ${PORT} at http://127.0.0.1:${PORT}`);
        });
    }
}

bootstrapServer();

// Helper: Send SMS/WhatsApp Notification (Placeholder)
const sendSMSWhatsAppNotification = async (order) => {
    try {
        const phone = order.userId?.phone;
        if (!phone || phone === 'Not provided') {
            console.error('[SMS-ERROR] Phone number not available for order:', order.orderId);
            return;
        }

        const orderId = order.orderId;
        const trackingId = order.trackingNumber;
        const pin = order.deliveryPin;
        const deliveryDate = order.expectedDeliveryDate || 'Soon';
        const status = order.status;

        const message = `🌿 Greenie Culture: Order ${orderId} Update! 
Status: ${status}
Tracking ID: ${trackingId}
Expected Delivery: ${deliveryDate}
Delivery PIN: ${pin} (Share with delivery boy only)
Track here: http://localhost:3000/my-account/orders`;

        console.log(`[SMS-MOCK] Sending to ${phone}:`);
        console.log(`----------------------------------\n${message}\n----------------------------------`);
    } catch (err) {
        console.error('[SMS-ERROR] Failed to prepare notification:', err.message);
    }
};

// Admin Login - returns a real JWT for admin dashboard API calls
app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === 'admin@greenie.com' && password === 'radheradhe') {
            const token = jwt.sign(
                { user: { id: 'admin-special-id', isAdmin: true, fullName: 'Super Admin', role: 'admin' } },
                JWT_SECRET,
                { expiresIn: '8h' }
            );
            return res.json({ 
                token, 
                isAdmin: true, 
                user: { _id: 'admin-special-id', fullName: 'Super Admin', email, role: 'admin' } 
            });
        }
        
        // Also check DB for other admins
        const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign(
                    { user: { id: user._id, isAdmin: true, fullName: user.fullName, role: 'admin' } },
                    JWT_SECRET,
                    { expiresIn: '8h' }
                );
                return res.json({ 
                    token, 
                    isAdmin: true, 
                    user: { _id: user._id, fullName: user.fullName, email: user.email, role: 'admin' } 
                });
            }
        }

        return res.status(401).json({ message: 'Invalid admin credentials' });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
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
            res.json({ token, user: { _id: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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

// API Routes for Products
app.get('/api/products', async (req, res) => {
    try {
        const { category, limit } = req.query;
        console.log(`[ProductsAPI] Query: "${category}" | Limit: ${limit}`);

        let query = {};
        if (category) {
            let decodedCategory = decodeURIComponent(category).trim();

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
                        { category: { $regex: regex } },
                        { tags: { $regex: regex } },
                        { category: { $regex: new RegExp(`.*${decodedCategory.replace(/[-\s]+/g, '.*')}.*`, 'i') } }
                    ]
                };
            }
            console.log(`[ProductsAPI] Querying for: "${decodedCategory}" (Partial: ${usePartial})`);
        }

        let productsQuery = Product.find(query).lean();

        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                productsQuery = productsQuery.limit(limitNum);
            }
        }

        const products = await productsQuery;
        console.log(`[ProductsAPI] Found ${products.length} products for "${category}"`);
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
        const searchTerms = q.split(' ').filter(term => term.length > 0);
        const regexes = searchTerms.map(term => new RegExp(term, 'i'));

        // Search in name, category, or tags
        const products = await Product.find({
            $or: [
                { name: { $regex: new RegExp(q, 'i') } },
                { category: { $regex: new RegExp(q, 'i') } },
                { tags: { $regex: new RegExp(q, 'i') } },
                ...(searchTerms.length > 1 ? [{ $and: regexes.map(r => ({ name: { $regex: r } })) }] : [])
            ]
        }).limit(10).select('name category price image slug').lean();

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
        const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 }).lean();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// User Orders API - POST place new order
app.post('/api/user/orders', auth, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, transactionId, paymentScreenshot, appliedOfferCode, offerBenefit } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        const newOrder = new Order({
            userId: req.user.id,
            userName: req.user.fullName || 'User',
            items: items,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || 'UPI',
            status: 'Processing',
            transactionId: transactionId || '',
            paymentScreenshot: paymentScreenshot || '',
            paymentStatus: (paymentMethod === 'Cash on Delivery') ? 'Received' : 'Pending',
            appliedOfferCode: appliedOfferCode || null,
            offerBenefit: offerBenefit || null
        });

        const savedOrder = await newOrder.save();
        console.log(`[OrdersAPI] New order placed: ${savedOrder.orderId} for user ${req.user.id}`);

        // Asynchronously send the invoice email
        sendOrderConfirmationEmail(req.user, savedOrder);

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('[OrdersAPI] Error placing order:', err.message);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// --- AI ASSISTANT (PLANT EXPERT) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AI_KEY_PLACEHOLDER');

app.post('/api/ai-assistant', async (req, res) => {
    let userId; // Declare outside try block to ensure availability in catch block
    try {
        const { message, image } = req.body;
        userId = req.body.userId;

        // Try to get userId from token if not in body
        const token = req.header('x-auth-token');
        if (!userId && token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.user.id;
                console.log(`[AI-ASSISTANT] Derived userId from token: ${userId}`);
            } catch (err) { /* ignore invalid token for this public endpoint */ }
        }

        console.log(`[AI-ASSISTANT] Request Body:`, JSON.stringify({ message: message?.substring(0, 20), userId }));
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Save user message if userId is provided
        if (userId) {
            try {
                console.log(`[CHAT-SAVE] Attempting to save message for user: ${userId}`);
                const userMsg = new ChatMessage({
                    userId,
                    role: 'user',
                    text: message,
                    image: image || null
                });
                await userMsg.save();
                console.log('[CHAT-SAVE] User message saved.');
            } catch (saveErr) {
                console.error('[CHAT-SAVE-ERROR] User message:', saveErr.message);
            }
        }

        let promptText = `You are "Plant Expert AI" for Greenie Culture. Provide professional plant care advice.
        
        CRITICAL INSTRUCTION: Analyze the user's message language. Your response "text" field MUST be in the SAME language as the user's question (e.g., if user asks in Gujarati, answer in Gujarati; if in Hindi, answer in Hindi; if in English, answer in English).
        
        Your response MUST be a valid JSON object with the following fields:
        1. "text": Your diagnostic advice in Markdown format. Match the user's language. Keep it concise, friendly, and use appropriate icons/emojis.
        2. "recommendations": An array of 2-3 specific keywords from OUR store to search for products. ALWAYS provide these in English for our search engine to work.
        3. "remindable": A boolean (true or false). Set to true only if the user's issue requires a 3-day follow-up reminder.
        4. "plantName": The common name of the plant identified (e.g., "Money Plant", "Tulsi"). If not identified, use "Plant".
           
        AVAILABLE CATEGORIES: ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Gardening", "Flower Seeds", "Fertilizers & Nutrients", "Gardening Tools", "Soil & Growing Media", "Accessories"]
        EXAMPLES of products we have: ["Money Plant", "Peace Lily", "Snake Plant", "Aloe Vera", "Tulsi Plant", "Organic Fertilizer", "Vermicompost", "Potting Mix", "Watering Can", "Pruning Shears"].
           
        INTERACTIVE FLOW:
        - If the user says "my plant is dying" but doesn't mention WHICH plant, politely ask for the plant name in their language.
        - If the user specifies the plant, provide specific care and include English keywords in "recommendations".

        User Question: "${message}"`;

        let result;
        if (image) {
            const base64Data = image.split(',')[1] || image;
            const imageData = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
            result = await model.generateContent([promptText, imageData]);
        } else {
            result = await model.generateContent(promptText);
        }

        const response = await result.response;
        let aiFullText = response.text();
        console.log(`[AI-RAW-RESPONSE]`, aiFullText);
        let aiText = aiFullText;
        let recommendations = [];
        let remindable = false;
        let identifiedPlantName = 'Plant';

        try {
            // Robust JSON extraction: Find the first { and last }
            const startIdx = aiFullText.indexOf('{');
            const endIdx = aiFullText.lastIndexOf('}');
            
            if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                const jsonStr = aiFullText.substring(startIdx, endIdx + 1);
                const parsed = JSON.parse(jsonStr);
                aiText = parsed.text || aiFullText;
                recommendations = parsed.recommendations || [];
                remindable = parsed.remindable || false;
                identifiedPlantName = parsed.plantName || 'Plant';
                console.log(`[AI-PARSE-SUCCESS] Recs:`, recommendations, 'Remindable:', remindable, 'Plant:', identifiedPlantName);
            } else {
                console.warn('[AI-PARSE-FAILED] No JSON block found in response');
            }
        } catch (e) {
            console.error('[AI-JSON-ERROR]', e.message);
            // Fallback: If it's not JSON, try to extract it from code blocks anyway
            const match = aiFullText.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) {
                try {
                    const parsed = JSON.parse(match[1]);
                    aiText = parsed.text || aiText;
                    recommendations = parsed.recommendations || recommendations;
                    remindable = parsed.remindable || remindable;
                    identifiedPlantName = parsed.plantName || identifiedPlantName;
                } catch (innerE) { /* give up */ }
            }
        }

        // Save AI response if userId is provided
        if (userId) {
            try {
                const aiMsg = new ChatMessage({
                    userId,
                    role: 'ai',
                    text: aiText,
                    recommendations: recommendations,
                    plantName: identifiedPlantName
                });
                await aiMsg.save();
            } catch (saveErr) {
                console.error('[CHAT-SAVE-ERROR] AI message:', saveErr.message);
            }
        }

        res.json({ text: aiText, recommendations, remindable, plantName: identifiedPlantName });
    } catch (err) {
        console.error('[AI-ASSISTANT] Error:', err.message);
        
        // Smart keyword extraction from user's message for fallback recommendations
        const msgLower = (req.body?.message || '').toLowerCase();
        let fallbackRecs = ['Indoor Plants', 'Gardening'];
        
        // Detect specific plant names mentioned
        if (msgLower.includes('tulsi')) fallbackRecs = ['Tulsi Plant', ...fallbackRecs];
        if (msgLower.includes('money plant')) fallbackRecs = ['Money Plant', ...fallbackRecs];
        if (msgLower.includes('snake plant')) fallbackRecs = ['Snake Plant', ...fallbackRecs];
        if (msgLower.includes('peace lily')) fallbackRecs = ['Peace Lily', ...fallbackRecs];
        if (msgLower.includes('aloe')) fallbackRecs = ['Aloe Vera', ...fallbackRecs];

        if (msgLower.includes('fungal') || msgLower.includes('fungus') || msgLower.includes('rot') || msgLower.includes('disease')) {
            fallbackRecs = ['Fertilizers & Nutrients', 'Soil & Growing Media', ...fallbackRecs];
        } else if (msgLower.includes('water') || msgLower.includes('pani') || msgLower.includes('dry') || msgLower.includes('thirsty')) {
            fallbackRecs = ['Accessories', ...fallbackRecs];
        } else if (msgLower.includes('yellow') || msgLower.includes('brown') || msgLower.includes('leaf') || msgLower.includes('patta')) {
            fallbackRecs = ['Fertilizers & Nutrients', ...fallbackRecs];
        }
        
        // Ensure unique and max 4
        fallbackRecs = [...new Set(fallbackRecs)].slice(0, 4);

        // EXTRA: Extract plantName for frontend header fallback
        let fallbackPlantName = 'Plant';
        if (msgLower.includes('tulsi')) fallbackPlantName = 'Tulsi';
        else if (msgLower.includes('money plant')) fallbackPlantName = 'Money Plant';
        else if (msgLower.includes('snake plant')) fallbackPlantName = 'Snake Plant';
        else if (msgLower.includes('peace lily')) fallbackPlantName = 'Peace Lily';
        else if (msgLower.includes('aloe')) fallbackPlantName = 'Aloe Vera';
        
        const isRateLimit = err.message?.includes('429') || err.message?.includes('quota');
        
        // Professional fallback message that doesn't sound like an error
        let userText = "🌿 **Plant Expert AI Diagnostic Mode**\n\n";

        // Detect if specific plants are in recommendations (exclude general categories)
        const categories = ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Gardening", "Flower Seeds", "Fertilizers & Nutrients", "Gardening Tools", "Soil & Growing Media", "Accessories"];
        const specificPlants = fallbackRecs.filter(r => !categories.includes(r));
        const hasSpecificPlant = specificPlants.length > 0;

        // Interactive Fallback: If "critical/dying" and No specific plant name detected
        const criticalKeywords = ['critical', 'dying', 'mar raha', 'problem', 'help', 'sookh', 'kharab', 'yellow', 'keeda', 'pests'];
        const isCritical = criticalKeywords.some(key => msgLower.includes(key));

        if (isCritical && !hasSpecificPlant) {
            userText += "Main aapki help zaroor karunga. Par meri diagnostics shuru karne ke liye, mujhe ye batayein: **Aapke paas kaunsa plant hai?** (Which plant do you have?) \n\nTaaki main uske care instructions aur remedies dhoondh sakun. 🌱✨";
        } else {
            userText += "Aapke sawaal ke liye yahan kuch basic care tips hain:\n";
            userText += "- **Hydration**: Check karein ki mitti (soil) upar se 1-2 inch dry hai ya nahi. 💧\n";
            userText += "- **Light**: Zyadatar plants ko filtered sunlight pasand hoti hai. 🌞\n";
            userText += "- **Nutrition**: Agar patte yellow ho rahe hain, toh **Fertilizer** ki kami ho sakti hai. 🌿\n\n";
            userText += "Neeche diye gaye products aapke kaam aa sakte hain. Main background mein research kar raha hoon, thodi der mein mujhse aur detailed poochhein! 😉";
        }
        
        // Save AI response even if it's a fallback
        if (userId) {
            try {
                const aiMsg = new ChatMessage({
                    userId,
                    role: 'ai',
                    text: userText,
                    recommendations: fallbackRecs,
                    plantName: fallbackPlantName
                });
                await aiMsg.save();
                console.log(`[CHAT-SAVE] Fallback AI message saved for user: ${userId} with plant: ${fallbackPlantName}`);
            } catch (saveErr) {
                console.error('[CHAT-SAVE-ERROR] AI Fallback:', saveErr.message);
            }
        }
        
        // Return 200 but flag as diagnostic/fallback so frontend knows
        res.json({
            text: userText,
            recommendations: fallbackRecs,
            status: 'diagnostic',
            remindable: true,
            plantName: fallbackPlantName
        });
    }
});

// Create a 4-Part Plant Care Reminder Sequence
app.post('/api/admin/reminders', auth, async (req, res) => {
    try {
        const { plantName, problemType } = req.body;
        
        const sequence = [
            { type: 'water', delayDays: 3, label: 'Water Reminder' },
            { type: 'fertilizer', delayDays: 6, label: 'Fertilizer Reminder' },
            { type: 'sunlight', delayDays: 9, label: 'Sunlight Check' },
            { type: 'general', delayDays: 12, label: 'General Health Assessment' }
        ];

        const sequenceId = new mongoose.Types.ObjectId().toString();
        const createdReminders = [];

        for (const item of sequence) {
            const reminderDate = new Date();
            reminderDate.setDate(reminderDate.getDate() + item.delayDays);

            const reminder = new PlantReminder({
                userId: req.user.id,
                plantName,
                problemType: `${problemType} (${item.label})`,
                reminderType: item.type, 
                reminderDate,
                sequenceId
            });

            await reminder.save();
            createdReminders.push(reminder);
        }

        res.json({ 
            message: 'Sequenced reminders scheduled successfully (4 parts)', 
            reminders: createdReminders 
        });
    } catch (err) {
        console.error('[REMINDER-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to set reminders' });
    }
});

// Scheduler for Plant Care Reminders (Runs Every Minute for Testing)
cron.schedule('* * * * *', async () => {
    console.log('[SCHEDULER] Checking for plant care reminders...');
    try {
        const now = new Date();
        const pendingReminders = await PlantReminder.find({
            reminderDate: { $lte: now },
            notificationStatus: 'pending'
        });

        for (const reminder of pendingReminders) {
            // Check if ANY previous reminder in this sequence was STOPPED
            const isStopped = await PlantReminder.findOne({
                sequenceId: reminder.sequenceId,
                userAction: 'stopped'
            });

            if (isStopped) {
                reminder.notificationStatus = 'dismissed';
                await reminder.save();
                console.log(`[SCHEDULER] Skipping stopped sequence ${reminder.sequenceId} for ${reminder.plantName}`);
                continue;
            }

            // Create a notification for the user
            const notification = new Notification({
                userId: reminder.userId,
                type: 'Reminder',
                subType: reminder.reminderType,
                reminderId: reminder._id,
                title: `🌿 Plant Care: ${reminder.plantName}`,
                message: `Hello! It's time to check your ${reminder.plantName}. Is it ready for some ${reminder.reminderType}?`,
                product: { name: reminder.plantName } 
            });

            await notification.save();
            
            // Mark reminder as sent
            reminder.notificationStatus = 'sent';
            await reminder.save();
            console.log(`[SCHEDULER] Sent reminder for ${reminder.plantName} to user ${reminder.userId}`);
        }
    } catch (err) {
        console.error('[SCHEDULER-ERROR]', err.message);
    }
});

// USER: Action on Reminder (Continue/Stop)
app.post('/api/user/reminders/:id/action', auth, async (req, res) => {
    try {
        const { action } = req.body; // 'continued' or 'stopped'
        const reminderId = req.params.id;

        const reminder = await PlantReminder.findById(reminderId);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

        reminder.userAction = action;
        await reminder.save();

        // [NEW] Also update notifications to mark them as read/handled
        // This ensures they disappear from the navbar immediately after refresh
        const updateQuery = { userId: req.user.id, type: 'Reminder' };
        if (action === 'stopped') {
            // For 'stopped', clear ALL notifications for THIS sequence
            updateQuery.reminderId = { $in: await PlantReminder.find({ sequenceId: reminder.sequenceId }).distinct('_id') };
        } else {
            // For 'continued', clear notifications for THIS specific reminder
            updateQuery.reminderId = reminderId;
        }
        
        await mongoose.model('Notification').updateMany(
            updateQuery,
            { isRead: true }
        );

        if (action === 'stopped') {
            // Mark all future reminders in this sequence as dismissed
            await PlantReminder.updateMany(
                { sequenceId: reminder.sequenceId, notificationStatus: 'pending' },
                { notificationStatus: 'dismissed', userAction: 'stopped' }
            );
        }

        res.json({ message: `Reminder sequence ${action} successfully` });
    } catch (err) {
        console.error('[REMINDER-ACTION-ERROR]', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET Chat History for logged-in user
app.get('/api/chat-history', auth, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ userId: req.user.id })
            .sort({ timestamp: 1 })
            .limit(50)
            .lean();
        res.json(messages);
    } catch (err) {
        console.error('[CHAT-HISTORY-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});

// --- ADMIN MASTER AI ASSISTANT ---
app.post('/api/admin/ai-assistant', auth, async (req, res) => {
    console.log('[MASTER-AI] Request received from:', req.user?.id || 'Unknown');
    try {
        const { message, contextData } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        console.log('[MASTER-AI] Fetching systemic context...');
        // Fetch systemic data for context
        const [recentOrders, recentInquiries, lowStockProducts] = await Promise.all([
            Order.find({}).sort({ orderDate: -1 }).limit(10).populate('userId', 'fullName').lean(),
            Inquiry.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            Product.find({ stock: { $lte: 30 } }).sort({ stock: 1 }).limit(15).lean()
        ]);
        console.log('[MASTER-AI] Context fetched. Orders:', recentOrders.length, 'Stock items:', lowStockProducts.length);

        const orderCtx = recentOrders.map(o => `#${o.orderId}: ${o.userId?.fullName || 'Guest'} - ₹${o.totalAmount} (${o.status})`).join('\n');
        const inquiryCtx = recentInquiries.map(i => `${i.name}: ${i.subject} - ${i.status}`).join('\n');
        const stockCtx = lowStockProducts.map(p => `${p.name}: ${p.stock} units left`).join('\n');

        let promptText = `You are "Greenie Culture Master Intelligence". You have a birds-eye view of all business operations. 
        
        CURRENT SYSTEM SNAPSHOT (Real-time DB Data):
        
        Recent Orders:
        ${orderCtx || 'No recent orders.'}
        
        Recent User Inquiries:
        ${inquiryCtx || 'No recent inquiries.'}
        
        Inventory Alerts (Low Stock):
        ${stockCtx || 'All products well stocked.'}
        
        Live Dashboard Stats:
        - Total Orders: ${contextData?.totalOrders || 'Loading...'}
        - Total Revenue: ₹${contextData?.totalRevenue || 0}
        - Top State: ${contextData?.topState || 'Unknown'}
        - Low Stock Count: ${contextData?.lowStockCount || 0}
        
        User Query: "${message}"
        
        INSTRUCTIONS:
        1. Act as a Chief Operating Officer (COO). Analyze the snapshot to answer the user's specific query.
        2. If they ask about "stock", "orders", or "money", use the exact numbers from the snapshots above.
        3. Keep it professional, data-driven, and use high-end business English mixed with helpful Hinglish.
        4. Format with bold headers, bullet points, and clean Markdown.
        5. Proactively mention if something looks critical (like low stock count > 5).`;

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const aiText = response.text();

        // Save History (User & AI)
        try {
            const userMsg = new AdminChatMessage({ adminId: req.user.id, role: 'user', text: message });
            const aiMsg = new AdminChatMessage({ adminId: req.user.id, role: 'ai', text: aiText });
            await Promise.all([userMsg.save(), aiMsg.save()]);
            console.log('[MASTER-AI] Conversation saved to history.');
        } catch (saveErr) {
            console.error('[MASTER-AI-SAVE-ERROR]', saveErr.message);
        }

        res.json({ text: aiText });

    } catch (err) {
        console.error('[MASTER-AI] Error:', err.message);
        
        // Dynamic Fallback: Compiled directly from DB context based on keywords
        const { message, contextData } = req.body;
        const msgLow = (message || '').toLowerCase();
        
        let dynamicSection = '';
        if (msgLow.includes('stock') || msgLow.includes('maal') || msgLow.includes('inventory')) {
            dynamicSection = `⚠️ **Inventory Update**: ${contextData?.lowStockCount || 0} items are currently below the safety threshold. Re-stocking is recommended for high-movers.`;
        } else if (msgLow.includes('revenue') || msgLow.includes('paisa') || msgLow.includes('money') || msgLow.includes('sales')) {
            dynamicSection = `💰 **Financial Snapshot**: Total revenue stands at **₹${contextData?.totalRevenue || 0}** across **${contextData?.totalOrders || 0} orders**. Sales velocity is stable.`;
        } else if (msgLow.includes('order') || msgLow.includes('deliver') || msgLow.includes('status')) {
            dynamicSection = `📦 **Logistics Brief**: We've processed **${contextData?.totalOrders || 0} total orders**. Most recent activity is centered in **${contextData?.topState || 'Gujarat'}**.`;
        } else {
            dynamicSection = `📊 **General Brief**: Today we have **${contextData?.totalOrders || 0} total orders** and **${contextData?.totalRevenue || 0} total revenue**. Business health is currently optimal.`;
        }

        const fallbackText = `🏛️ **Greenie Master Intelligence Brief (Live DB Sync)**

Yahan aapke sawaal ke liye real-time data analysis hai:

${dynamicSection}

> *Note: AI complex reasoning is on a 60-second cooldown (Rate Limit), but your live database data above is 100% accurate. Try deep-analysis again in 1 minute!*`;

        // Save Fallback History
        try {
            const userMsg = new AdminChatMessage({ adminId: req.user.id, role: 'user', text: message });
            const aiMsg = new AdminChatMessage({ adminId: req.user.id, role: 'ai', text: fallbackText, isFallback: true });
            await Promise.all([userMsg.save(), aiMsg.save()]);
            console.log('[MASTER-AI] Fallback conversation saved.');
        } catch (saveErr) {
            console.error('[MASTER-AI-SAVE-ERROR-FALLBACK]', saveErr.message);
        }

        res.json({ text: fallbackText, isFallback: true });
    }
});

// GET Admin Chat History
app.get('/api/admin/chat-history', auth, async (req, res) => {
    try {
        const history = await AdminChatMessage.find({ adminId: req.user.id }).sort({ timestamp: 1 }).limit(50).lean();
        res.json(history);
    } catch (err) {
        console.error('[ADMIN-CHAT-HISTORY-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to fetch admin history' });
    }
});

/**
 * NEW: Admin Growth Hub - Marketing Assistant
 */
app.post('/api/admin/generate-marketing', auth, async (req, res) => {
    try {
        const { type, productName, offerDetails, tone = 'professional' } = req.body;
        
        let prompt = "";
        if (type === 'social') {
            prompt = `Create a viral, attractive Instagram caption for a plant product named "${productName}". 
                     Details: ${offerDetails}. Tone: ${tone}. Include emojis and relevant hashtags. 
                     Format the output cleanly in plain text.`;
        } else if (type === 'email') {
            prompt = `Write a professional email draft for newsletter subscribers about "${productName}". 
                     Subject line included. Tone: Catchy and green-focused. Details: ${offerDetails}.`;
        } else if (type === 'promo') {
            prompt = `Suggest 3 unique, catchy promo code names and a 1-sentence description for each for a sale on "${productName}".`;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (err) {
        console.error('[MarketingAPI] Error:', err.message);
        res.status(500).json({ message: 'Failed to generate marketing content' });
    }
});

// --- REVIEWS API ---

// Public: Get all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();
        res.json(reviews);
    } catch (err) {
        console.error('[ReviewsAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

// User: Add a review
app.post('/api/reviews', async (req, res) => {
    try {
        const { userName, rating, description, date } = req.body;
        if (!userName || !rating || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newReview = new Review({
            userName,
            rating: Number(rating),
            description,
            date: date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        console.error('[ReviewsAPI] Save error:', err.message);
        res.status(500).json({ message: 'Server error saving review' });
    }
});

// Admin: Delete a review
app.delete('/api/admin/reviews/:id', auth, async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error('[AdminAPI] Review delete error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * NEW: Admin AI Task Hub (Operations) with Caching
 */
let aiTasksCache = { data: null, timestamp: 0 };
app.get('/api/admin/ai-tasks', auth, async (req, res) => {
    try {
        // Cache for 10 minutes to save Gemini quota
        const CACHE_DURATION = 10 * 60 * 1000; 
        if (aiTasksCache.data && (Date.now() - aiTasksCache.timestamp < CACHE_DURATION)) {
            return res.json({ tasks: aiTasksCache.data });
        }

        // Fetch snapshot of business health
        const [lowStock, pendingOrders, totalProducts, activeReminders] = await Promise.all([
            Product.find({ stock: { $lt: 10 } }).limit(5).lean(),
            Order.find({ status: { $in: ['Processing', 'Ordered'] } }).limit(5).lean(),
            Product.countDocuments(),
            PlantReminder.countDocuments({ notificationStatus: 'pending' })
        ]);

        const stockMentions = lowStock.map(p => p.name).join(', ');
        const orderMentions = pendingOrders.length;
        const reminderCount = activeReminders;

        const prompt = `You are a Business Operations Consultant for 'Greenie Culture', an online plant store.
        Current Store Health Snapshot:
        - Low stock items: ${stockMentions || 'None'}
        - Pending/Processing orders: ${orderMentions}
        - Total products in catalog: ${totalProducts}
        - Pending plant care reminders: ${reminderCount}
        
        Generate exactly 3 concise, high-priority operational tasks for the admin.
        If there are low stock items, prioritize restocking them.
        If there are pending orders, prioritize fulfillment.
        If the store is healthy (no low stock or pending orders), suggest growth tasks like '🌿 Update blog with seasonal care tips' or '📈 Review top-selling products this week'.
        
        Format Requirement: Return ONLY 3 lines. Each line MUST start with a relevant emoji. No other text.
        Example:
        📦 Restock Money Plant.
        🚚 Ship 5 pending orders.
        ✨ Create a new promo for succulents.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Split text into array of lines and clean up
        let tasks = response.text()
            .split('\n')
            .map(t => t.replace(/^\d+\.\s*/, '').trim()) // Remove leading numbers if AI adds them
            .filter(t => t.length > 5)
            .slice(0, 3);
            
        // Final fallback if AI fails or returns empty
        if (!tasks || tasks.length === 0) {
            tasks = [
                "🌿 Check daily plant health reports",
                "📈 Analyze latest sales trends",
                "📦 Audit inventory levels"
            ];
        }
        
        // Update cache
        aiTasksCache = { data: tasks, timestamp: Date.now() };
        
        res.json({ tasks });
    } catch (err) {
        console.error('[AI-TASKS-ERROR]', err.message);
        res.json({ tasks: [
            "🌿 Daily store audit",
            "📦 Review stock levels",
            "📊 Check recent orders"
        ] });
    }
});

// Admin: Get all plant reminders (for Operations Hub)
app.get('/api/admin/plant-reminders', auth, async (req, res) => {
    try {
        const reminders = await PlantReminder.find({})
            .populate('userId', 'fullName email phone') 
            .sort({ reminderDate: 1 })
            .lean();
        res.json(reminders);
    } catch (err) {
        console.error('[AdminRemindersAPI] Fetch error:', err.message);
        res.status(500).json({ message: 'Server error fetching plant reminders' });
    }
});

/**
 * NEW: Customer Inquiry Smart-Draft
 */
app.post('/api/admin/ai-inquiry-draft', auth, async (req, res) => {
    try {
        const { inquiryText, userName } = req.body;
        const prompt = `A customer named ${userName} sent this message: "${inquiryText}".
                       Write a professional, polite, and helpful draft reply as 'Greenie Culture Support'.
                       Keep it short (max 3 sentences).`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ draft: response.text() });
    } catch (err) {
        console.error('[INQUIRY-DRAFT-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to generate draft' });
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
        const { status } = req.body;
        if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
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


app.get('/api/admin/payment-summary', auth, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'fullName').lean();

        let cod = 0, online = 0, totalRevenue = 0;
        orders.forEach(o => {
            const method = (o.paymentMethod || '').toUpperCase();
            if (method.includes('CASH') || method.includes('COD')) cod++;
            else online++;
            if (o.status !== 'Cancelled') totalRevenue += (o.totalAmount || 0);
        });

        const totalOrders = cod + online;
        res.json({
            total: totalOrders,
            cod,
            online,
            codPercentage: totalOrders > 0 ? Math.round((cod / totalOrders) * 100) : 0,
            onlinePercentage: totalOrders > 0 ? Math.round((online / totalOrders) * 100) : 0,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/status', auth, async (req, res) => {
    try {
        const { status, courierName, trackingNumber, expectedDeliveryDate } = req.body;
        const updateData = { status };
        if (courierName) updateData.courierName = courierName;
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (expectedDeliveryDate) updateData.expectedDeliveryDate = expectedDeliveryDate;

        if (courierName && trackingNumber && status !== 'Delivered' && status !== 'Cancelled') {
            updateData.status = 'Shipped';
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
            .populate('userId', 'fullName email phone alternatePhone address city state');
        
        if (!order) return res.status(404).json({ message: 'Order not found' });

        sendOrderStatusEmail(order);
        sendSMSWhatsAppNotification(order);
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/payment-status', auth, async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true })
            .populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/courier-settled', auth, async (req, res) => {
    try {
        const { courierSettled } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { courierSettled: !!courierSettled }, { new: true })
            .populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
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

// ADMIN API - Update product
app.put('/api/admin/products/:id', auth, async (req, res) => {
    try {
        const { name, price, originalPrice, discount, category, image, images, description, tags } = req.body;

        const updateData = {
            name,
            price,
            originalPrice,
            discount,
            category,
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
        const { name, price, originalPrice, discount, category, image, images, description, tags } = req.body;

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
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
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

// --- Courier Management Routes ---

// ADMIN: Get all Couriers
app.get('/api/admin/couriers', auth, async (req, res) => {
    try {
        const couriers = await Courier.find();
        res.json(couriers);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// PUBLIC: Get Courier fees and availability
app.get('/api/couriers/public', async (req, res) => {
    try {
        const couriers = await Courier.find({}, 'name states fee');
        res.json(couriers);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN: Add New Courier
app.post('/api/admin/couriers', auth, async (req, res) => {
    try {
        const { name, password, states, fee, icon, email, phone, certificate } = req.body;
        const newCourier = new Courier({ name, password, states, fee, icon, email, phone, certificate });
        await newCourier.save();
        res.status(201).json(newCourier);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN: Update Courier
app.put('/api/admin/couriers/:id', auth, async (req, res) => {
    try {
        const { name, password, states, fee, icon, email, phone, certificate } = req.body;
        const updatedCourier = await Courier.findByIdAndUpdate(
            req.params.id,
            { name, password, states, fee, icon, email, phone, certificate },
            { new: true }
        );
        res.json(updatedCourier);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN: Delete Courier
app.delete('/api/admin/couriers/:id', auth, async (req, res) => {
    try {
        await Courier.findByIdAndDelete(req.params.id);
        res.json({ message: 'Courier deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});


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
app.get('/api/user/notifications', auth, async (req, res) => {
    try {
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
        await Notification.deleteMany({ userId: req.user.id });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// --- End of Inquiry & Notification System ---

// --- End of Inquiry & Notification System ---
