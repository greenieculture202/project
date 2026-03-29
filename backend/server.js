const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
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
const Settlement = require('./models/Settlement');
const PlantReminder = require('./models/PlantReminder');
const AdminChatMessage = require('./models/AdminChatMessage');
const ChatMessage = require('./models/ChatMessage');

const Cart = require('./models/Cart');
const Payment = require('./models/Payment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenie-secret-key-123';
const GOOGLE_CLIENT_ID = '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID.trim());

// Temporary store for OTPs (in production, use Redis or DB with expiry)
const otpStore = new Map();

const fs = require('fs');
// path already imported at top

const INDIAN_STATE_CODE_MAP = {
    'MAHARASHTRA': 'MH',
    'GUJARAT': 'GJ',
    'JHARKHAND': 'JH',
    'PUNJAB': 'PB',
    'UTTAR PRADESH': 'UP',
    'DELHI': 'DL',
    'RAJASTHAN': 'RJ',
    'HARYANA': 'HR',
    'KARNATAKA': 'KA',
    'TAMIL NADU': 'TN',
    'WEST BENGAL': 'WB',
    'TELANGANA': 'TG',
    'MADHYA PRADESH': 'MP',
    'KERALA': 'KL',
    'BIHAR': 'BR',
    'ASSAM': 'AS',
    'ODISHA': 'OD',
    'CHHATTISGARH': 'CT',
    'UTTARAKHAND': 'UK',
    'HIMACHAL PRADESH': 'HP',
    'GOA': 'GA',
    'MANIPUR': 'MN',
    'MEGHALAYA': 'ML',
    'MIZORAM': 'MZ',
    'NAGALAND': 'NL',
    'TRIPURA': 'TR',
    'ANDHRA PRADESH': 'AP',
    'SIKKIM': 'SK',
    'ARUNACHAL PRADESH': 'AR'
};

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
        if (!user || !user.email) {
            console.error('[EMAIL-ERROR] No recipient email provided');
            return;
        }

        const itemsHtml = (order.items || []).map(item => `
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
                    <div style="background: linear-gradient(135deg, #2d8c6f, #1a5d1a); padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 32px; letter-spacing: -0.5px;">Greenie Culture</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">🌱 Your Green Journey Just Got Better!</p>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #1a5d1a; margin-top: 0;">Order Confirmed!</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${user.fullName ? user.fullName.split(' ')[0] : 'Gardener'},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">We've received your order <strong>${order.orderId}</strong>. Our team is already busy picking out the healthiest plants for you!</p>
                        <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 25px 0;">
                            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">
                                <span style="color: #6b7280; font-size: 14px;">ORDER ID: <strong>${order.orderId}</strong></span>
                                <span style="color: #6b7280; font-size: 14px;">DATE: <strong>${new Date(order.orderDate).toLocaleDateString()}</strong></span>
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Items</th>
                                        <th style="text-align: center; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                                        <th style="text-align: right; padding: 10px 0; color: #374151; font-size: 14px; border-bottom: 1px solid #e5e7eb;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>${itemsHtml}</tbody>
                            </table>
                            <div style="margin-top: 20px; text-align: right;">
                                <p style="margin: 5px 0; color: #6b7280;">Payment Method: <strong>${order.paymentMethod}</strong></p>
                                <p style="margin: 10px 0; color: #1a5d1a; font-size: 20px; font-weight: 800;">Total: ₹${order.totalAmount}</p>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #f3f4f6;">
                            <p style="font-size: 18px; color: #2d8c6f; font-weight: 700; margin-bottom: 5px;">Thank you for buying!</p>
                            <p style="color: #6b7280; font-size: 14px;">We'll notify you as soon as your plants leave our greenhouse.</p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Order confirmation sent to ${user.email} for ${order.orderId}`);
    } catch (err) {
        console.error('[EMAIL-ERROR] Failed to send confirmation:', err.message);
    }
};

// Helper: Send Order Status Update Email
const sendOrderStatusEmail = async (order) => {
    try {
        const userEmail = order.userId?.email;
        if (!userEmail) {
            console.error('[EMAIL-ERROR] User email not available for order:', order.orderId);
            return;
        }

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

            const deliveryDate = order.expectedDeliveryDate ?
                new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) :
                'Coming Soon';

            trackingSection = `
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 700;">TRACKING ID</p>
                    <p style="margin: 5px 0 0; color: #14532d; font-size: 24px; font-weight: 800; font-family: monospace;">${order.trackingNumber}</p>
                    <p style="margin: 10px 0 0; color: #166534; font-size: 14px;"><strong>Expected Delivery:</strong> ${deliveryDate}</p>
                </div>
            `;

            pinSection = `
                <div style="background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 15px; margin: 15px 0; text-align: center;">
                    <p style="margin: 0; color: #92400e; font-size: 13px; font-weight: 700;">DELIVERY VERIFICATION PIN</p>
                    <p style="margin: 5px 0 0; color: #b45309; font-size: 28px; font-weight: 900; letter-spacing: 4px;">${order.deliveryPin}</p>
                    <p style="margin: 5px 0 0; color: #92400e; font-size: 11px;">Please share this PIN only with the delivery partner.</p>
                </div>
            `;
        } else if (order.status === 'Delivered') {
            statusText = 'Delivered & Green! 🎁';
            statusMessage = 'Your plants have reached their new home. We hope they bring you joy!';
            
            trackingSection = '';
        } else {
            return;
        }

        const mailOptions = {
            from: `"Greenie Culture" <${process.env.GMAIL_USER || 'greenieculture202@gmail.com'}>`,
            to: userEmail,
            subject: `Update for Order ${order.orderId}: ${order.status} 🌿`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eef2f3; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #2d8c6f, #1a5d1a); padding: 30px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">Greenie Culture</h1>
                    </div>
                    <div style="padding: 30px; text-align: center;">
                        <h2 style="color: #1a5d1a; margin-top: 0;">${statusText}</h2>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${order.userId?.fullName ? order.userId.fullName.split(' ')[0] : 'Gardener'},</p>
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${statusMessage}</p>
                        
                        ${trackingSection}
                        ${pinSection}

                        <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">You can track the live status on our website under "My Orders".</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>&copy; 2026 Greenie Culture. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Status update email sent to ${userEmail} for ${order.orderId} (${order.status})`);
    } catch (err) {
        console.error('[EMAIL-ERROR] Failed to send status update:', err.message);
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

app.use((req, res, next) => {
    const logStr = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    fs.appendFileSync(path.join(__dirname, 'request_logs.txt'), logStr);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';
console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.split('@')[1] ? 'mongodb+srv://***@' + MONGODB_URI.split('@')[1] : MONGODB_URI);

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // Increased to 30s
    connectTimeoutMS: 30000         // Increased to 30s
})
    .then(async () => {
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Active Database:', mongoose.connection.name);

        // Run seeds only after connection is established
        console.log('🔄 Starting data seeding...');
        try {
            await Promise.all([seedPlacements(), seedFaqs(), seedCouriers()]);
            console.log('✅ Seeding completed');
        } catch (seedErr) {
            console.error('⚠️ Seeding internal error:', seedErr.message);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('\n--- DIAGNOSTIC HELP ---');
        console.log('1. Check if your IP is whitelisted in MongoDB Atlas (Network Access).');
        console.log('   Current Environment IP: 152.59.15.24');
        console.log('2. Verify that your connection string in .env is correct.');
        console.log('3. Ensure your firewall allows outbound traffic on port 27017.');
        console.log('-----------------------\n');
    });

// Start listening immediately so frontend proxy doesn't fail with ECONNREFUSED
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT} at http://0.0.0.0:${PORT}`);
});

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

        // --- MESSAGE TEMPLATE ---
        const message = `🌿 Greenie Culture: Order ${orderId} Update! 
Status: ${status}
Tracking ID: ${trackingId}
Expected Delivery: ${deliveryDate}
Delivery PIN: ${pin} (Share with delivery boy only)
Track here: http://localhost:3000/my-account/orders`;

        console.log(`[SMS-MOCK] Sending to ${phone}:`);
        console.log(`----------------------------------\n${message}\n----------------------------------`);

        /* 
        NOTE: To make this work for REAL, you need an API key from a provider:
        1. Fast2SMS (Cheap and popular in India)
        2. Twilio (Global, premium)
        3. Gupshup (WhatsApp API Specialists)

        SMS services usually charge ~20-30 paise per transactional SMS.
        WhatsApp API usually charges ~50 paise per message.
        */

    } catch (err) {
        console.error('[SMS-ERROR] Failed to prepare notification:', err.message);
    }
};

// Admin Login - returns a real JWT for admin dashboard API calls
app.post('/api/auth/admin-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`[ADMIN-LOGIN] Request received for: ${email}`);
        // Try to find admin in DB
        const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' }).lean();
        if (user) {
            if (user.isBlocked) {
                return res.status(403).json({ message: 'Something went wrong. Please try again.' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }
            const token = jwt.sign(
                { user: { id: user._id, isAdmin: true, email: user.email, fullName: user.fullName } },
                JWT_SECRET,
                { expiresIn: '8h' }
            );
            return res.json({ token, isAdmin: true, user: { _id: user._id, email: user.email, fullName: user.fullName, role: 'admin' } });
        }

        // Fallback to hardcoded admin
        if (email === 'admin@greenie.com' && password === 'radheradhe') {
            // Create a special admin JWT (using a fixed admin ID)
            const token = jwt.sign(
                { user: { id: 'admin-special-id', isAdmin: true, email, fullName: 'Super Admin' } },
                JWT_SECRET,
                { expiresIn: '8h' }
            );
            return res.json({ token, isAdmin: true, user: { _id: 'admin-special-id', email, fullName: 'Super Admin', role: 'admin' } });
        }

        return res.status(401).json({ message: 'Invalid admin credentials' });
    } catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Admin Add (requires current admin password verification)
app.post('/api/auth/admin-register', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Only admins can register new admins' });
        }
        const { fullName, email, password, currentAdminPassword } = req.body;

        // ── Verify current admin's password ─────────────────────────────
        if (!currentAdminPassword) {
            return res.status(400).json({ message: 'Your current password is required for authorization.' });
        }

        // Super-admin (hardcoded) verification
        if (req.user.id === 'admin-special-id') {
            const SUPER_ADMIN_PASSWORD = 'radheradhe';
            if (currentAdminPassword !== SUPER_ADMIN_PASSWORD) {
                return res.status(401).json({ message: 'Incorrect admin password. Authorization failed.' });
            }
        } else {
            // DB admin password verification
            const adminUser = await User.findById(req.user.id);
            if (!adminUser) return res.status(404).json({ message: 'Admin not found' });
            const isMatch = await bcrypt.compare(currentAdminPassword, adminUser.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect admin password. Authorization failed.' });
            }
        }

        // ── Register new admin ───────────────────────────────────────────
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin'
        });
        await user.save();
        res.status(201).json({ message: `Admin "${fullName}" registered successfully!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Update (Change password or name)
app.put('/api/auth/admin-update', auth, async (req, res) => {
    try {
        const { fullName, oldPassword, newPassword } = req.body;
        // Super admin cannot change credentials via UI since they are hardcoded
        if (req.user.id === 'admin-special-id') {
            return res.status(400).json({ message: 'Super admin credentials cannot be changed through this interface. Add a database admin first and login with that.' });
        }

        let user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (newPassword && oldPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect old password' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (fullName) {
            user.fullName = fullName;
        }

        await user.save();
        res.json({ message: 'Admin updated successfully', user: { _id: user._id, email: user.email, fullName: user.fullName, role: 'admin' } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('[AUTH] Registration attempt:', req.body);
        const { fullName, email, password, phone, address, state } = req.body;

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
            address,
            state
        });

        const savedUser = await user.save();
        console.log('[AUTH] User saved to DB:', savedUser._id);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('[AUTH] Registration error:', err.message);
        res.status(500).send('Server error');
    }
});

// Admin Regional Analytics
app.get('/api/admin/regional-analytics', auth, async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Cancelled' } }).lean();
        const stats = {};

        orders.forEach(order => {
            const state = order.shippingDetails?.state || order.state;
            if (!state) return;
            const sKey = state.trim().toUpperCase();

            if (!stats[sKey]) {
                stats[sKey] = {
                    orderCount: 0,
                    totalRevenue: 0,
                    products: {},
                    prices: []
                };
            }

            stats[sKey].orderCount++;
            stats[sKey].totalRevenue += order.totalAmount;
            stats[sKey].prices.push(order.totalAmount);

            (order.items || []).forEach(item => {
                if (item.name) {
                    stats[sKey].products[item.name] = (stats[sKey].products[item.name] || 0) + (item.quantity || 1);
                }
            });
        });

        const finalized = {};
        Object.keys(stats).forEach(s => {
            const stateData = stats[s];
            const sortedProducts = Object.entries(stateData.products)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(p => ({ name: p[0], count: p[1] }));

            const prices = stateData.prices.sort((a, b) => a - b);
            
            finalized[s] = {
                state: s,
                topProducts: sortedProducts,
                priceRange: {
                    low: prices[0] || 0,
                    high: prices[prices.length - 1] || 0
                },
                avgOrderValue: Math.round(stateData.totalRevenue / stateData.orderCount)
            };
        });

        res.json(finalized);
    } catch (err) {
        console.error('[AdminAPI] Regional Analytics error:', err.message);
        res.status(500).json({ message: 'Analytics error: ' + err.message });
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
                fullName: user.fullName,
                state: user.state, // Added state to JWT payload
                isRegionalFavorite: user.isRegionalFavorite // Added isRegionalFavorite to JWT payload
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { _id: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic, role: user.role, state: user.state, isRegionalFavorite: user.isRegionalFavorite } });
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
            res.json({ token, user: { email: user.email, fullName: user.fullName, profilePic: user.profilePic, state: user.state } });
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
            res.json({ token, user: { email: user.email, fullName: user.fullName, profilePic: user.profilePic, state: user.state } });
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

// --- UNIFIED AI HANDLER (Failover Strategy) ---
const callGemini = async (systemPrompt, userPrompt, image, apiKey) => {
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt 
    });
    let result;
    if (image) {
        const base64Data = image.split(',')[1] || image;
        const imageData = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
        result = await model.generateContent([userPrompt, imageData]);
    } else {
        result = await model.generateContent(userPrompt);
    }
    const response = await result.response;
    return { text: response.text() };
};

const callGroq = async (systemPrompt, userPrompt, image, apiKey) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
    if (!response.ok) throw new Error(`Groq Error: ${response.statusText}`);
    const data = await response.json();
    return { text: data.choices[0].message.content };
};

const callCerebras = async (systemPrompt, userPrompt, image, apiKey) => {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3.1-70b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
    if (!response.ok) throw new Error(`Cerebras Error: ${response.statusText}`);
    const data = await response.json();
    return { text: data.choices[0].message.content };
};

const callMistral = async (systemPrompt, userPrompt, image, apiKey) => {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
    if (!response.ok) throw new Error(`Mistral Error: ${response.statusText}`);
    const data = await response.json();
    return { text: data.choices[0].message.content };
};

const callHuggingFace = async (systemPrompt, userPrompt, image, apiKey) => {
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: fullPrompt })
    });
    if (!response.ok) throw new Error(`Hugging Face Error: ${response.statusText}`);
    const data = await response.json();
    const text = Array.isArray(data) ? (data[0].generated_text || data[0].text) : (data.generated_text || JSON.stringify(data));
    return { text: text.replace(fullPrompt, '').trim() }; 
};

const callUnifiedAI = async (systemPrompt, userPrompt, image) => {
    const providers = [
        { name: 'Gemini', key: process.env.GEMINI_API_KEY, func: callGemini },
        { name: 'Groq', key: process.env.GROQ_API_KEY, func: callGroq },
        { name: 'Cerebras', key: process.env.CEREBRAS_API_KEY, func: callCerebras },
        { name: 'Mistral', key: process.env.MISTRAL_API_KEY, func: callMistral },
        { name: 'Hugging Face', key: process.env.HUGGINGFACE_API_KEY, func: callHuggingFace }
    ];

    let lastError = null;
    for (const provider of providers) {
        if (!provider.key || provider.key.includes('PLACEHOLDER') || provider.key === '') {
            continue;
        }

        try {
            console.log(`[AI-FAILOVER] Trying ${provider.name}...`);
            const result = await provider.func(systemPrompt, userPrompt, image, provider.key);
            if (result && result.text) return { ...result, provider: provider.name };
        } catch (err) {
            console.error(`[AI-FAILOVER] ${provider.name} failed:`, err.message);
            lastError = err;
        }
    }
    throw lastError || new Error("All AI providers failed. Check your API keys.");
};

// API Routes for AI Assistant
app.post('/api/ai-assistant', async (req, res) => {
    let userId; 
    try {
        const { message, image } = req.body;
        userId = req.body.userId;

        const token = req.header('x-auth-token');
        if (!userId && token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.user.id;
            } catch (err) { /* ignore invalid token */ }
        }

        let historyText = '';
        if (userId) {
            try {
                const history = await ChatMessage.find({ userId })
                    .sort({ timestamp: -1 })
                    .limit(6)
                    .lean();
                
                if (history && history.length > 0) {
                    historyText = "\nRecent Conversation History:\n" + 
                        history.reverse().map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n') + "\n";
                }

                // Save user message
                const userMsg = new ChatMessage({
                    userId,
                    role: 'user',
                    text: message,
                    image: image || null
                });
                await userMsg.save();
            } catch (saveErr) {
                console.error('[CHAT-SAVE-ERROR]', saveErr.message);
            }
        }

        const systemPrompt = `You are "Plant Expert AI" for Greenie Culture. Provide professional plant care advice with a friendly tone.
        
        LANGUAGE & FORMATTING:
        1. MATCH SCRIPT: Your response MUST match the script/language of the user's question.
           - User asks in Gujarati script -> Answer in Gujarati script.
           - User asks in Roman script (Hinglish/Gujarati mix) -> Answer in Roman script (Hindi/Gujarati).
        2. EMOJIS ARE MANDATORY: Use relevant emojis (🌱, 🌿, 💧, ☀️, 🧪, 🧤, ✅, ⚠️, 😉) to make your response visually professional and engaging.
        3. STRUCTURE: Use bullet points and paragraphs for readability.
        
        SMART PLANT RECOGNITION:
        - Identify plant names even if misspelled or mentioned in mixed-language sentences (e.g., "maru money plant...", "tulsi ma pani...").
        - COMMON PLANTS: Recognize Money Plant (Pothos), Tulsi (Holy Basil), Aloe Vera, Snake Plant, Peace Lily, Ficus, etc.
        - DIRECT ANSWER: If a plant name is found in the CURRENT message, provide immediate advice. DO NOT ask "Aapke paas kaunsa plant hai?" if you can identify the plant from the message.
        - ASK ONLY AS LAST RESORT: Only ask for the plant name if the message is completely generic (e.g., "Mera plant sukh raha hai" without specifying which one).
        
        Your response MUST be a valid JSON object with the following fields:
        { 
          "text": "Detailed advice or polite question with plenty of emojis", 
          "recommendations": ["Identified Plant Name", "Related Category/Product"], 
          "remindable": true/false (true if specific advice given), 
          "plantName": "Identified Name or 'Plant'" 
        }
        
        AVAILABLE CATEGORIES: ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Gardening", "Flower Seeds", "Fertilizers & Nutrients", "Gardening Tools", "Soil & Growing Media", "Accessories"]`;


        const userPrompt = `${historyText}\nUser Current Question: "${message}"`;

        const result = await callUnifiedAI(systemPrompt, userPrompt, image);
        let aiFullText = result.text;
        console.log(`[AI-SUCCESS] Response from ${result.provider}`);
        let aiText = aiFullText;
        let recommendations = [];
        let remindable = false;
        let identifiedPlantName = 'Plant';

        try {
            const startIdx = aiFullText.indexOf('{');
            const endIdx = aiFullText.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
                const jsonStr = aiFullText.substring(startIdx, endIdx + 1);
                const parsed = JSON.parse(jsonStr);
                aiText = parsed.text || aiFullText;
                recommendations = parsed.recommendations || [];
                remindable = parsed.remindable || false;
                identifiedPlantName = parsed.plantName || 'Plant';
            }
        } catch (e) {
            const match = aiFullText.match(/```json\s*([\s\S]*?)\s*```/);
            if (match) {
                try {
                    const parsed = JSON.parse(match[1]);
                    aiText = parsed.text || aiText;
                    recommendations = parsed.recommendations || recommendations;
                    remindable = parsed.remindable || remindable;
                    identifiedPlantName = parsed.plantName || identifiedPlantName;
                } catch (innerE) { }
            }
        }

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
                console.error('[CHAT-SAVE-ERROR]', saveErr.message);
            }
        }

        res.json({ text: aiText, recommendations, remindable, plantName: identifiedPlantName });
    } catch (err) {
        console.error('[AI-ASSISTANT-ERROR]', err.message);
        
        let errorText = "Lagta hai main abhi thoda vyast hoon ya API limit khatam ho gayi hai. Please thodi der mein phir se try karein! 🌱";
        
        if (err.message.includes('429') || err.message.includes('Resource has been exhausted')) {
            errorText = "Aapki free AI limit aaj ke liye khatam ho gayi hai (Daily Quota Reached). 🛑 Please kal try karein ya naya API key use karein. (Your free AI limit is reached. Please try again tomorrow! or use a new key) 🌱";
        } else if (err.message.includes('API_KEY_INVALID')) {
            errorText = "Aapka API Key invalid hai. Please backend .env mein sahi key check karein. 🔑";
        }

        const msgLower = (req.body?.message || '').toLowerCase();
        let fallbackRecs = ['Indoor Plants', 'Gardening'];
        if (msgLower.includes('tulsi')) fallbackRecs = ['Tulsi Plant', ...fallbackRecs];
        if (msgLower.includes('money plant')) fallbackRecs = ['Money Plant', ...fallbackRecs];
        
        res.json({
            text: errorText,
            recommendations: fallbackRecs.slice(0, 3),
            status: 'diagnostic',
            remindable: true,
            plantName: 'Plant'
        });
    }
});

// --- ADMIN MASTER AI ASSISTANT ---
app.post('/api/admin/ai-assistant', auth, async (req, res) => {
    try {
        const { message, contextData } = req.body;

        // Fetch systemic data for context
        const [recentOrders, recentInquiries, lowStockProducts] = await Promise.all([
            Order.find({}).sort({ orderDate: -1 }).limit(10).populate('userId', 'fullName').lean(),
            Inquiry.find({}).sort({ createdAt: -1 }).limit(5).lean(),
            Product.find({ stock: { $lte: 30 } }).sort({ stock: 1 }).limit(15).lean()
        ]);

        const orderCtx = recentOrders.map(o => `#${o.orderId}: ${o.userId?.fullName || 'Guest'} - ₹${o.totalAmount} (${o.status})`).join('\n');
        const inquiryCtx = recentInquiries.map(i => `${i.name}: ${i.subject} - ${i.status}`).join('\n');
        const stockCtx = lowStockProducts.map(p => `${p.name}: ${p.stock} units left`).join('\n');

        let systemPrompt = `You are "Greenie Culture Master Intelligence". You have a birds-eye view of all business operations. 
        
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
        
        INSTRUCTIONS:
        1. Act as a Chief Operating Officer (COO). Analyze the snapshot to answer the user's specific query.
        2. If they ask about "stock", "orders", or "money", use the exact numbers from the snapshots above.
        3. Format with bold headers and bullet points.`;

        const userPrompt = `User Query: "${message}"`;

        const result = await callUnifiedAI(systemPrompt, userPrompt, null);
        const aiText = result.text;
        console.log(`[MASTER-AI-SUCCESS] Response from ${result.provider}`);

        // Save History
        try {
            const userMsg = new AdminChatMessage({ adminId: req.user.id, role: 'user', text: message });
            const aiMsg = new AdminChatMessage({ adminId: req.user.id, role: 'ai', text: aiText });
            await Promise.all([userMsg.save(), aiMsg.save()]);
        } catch (saveErr) {
            console.error('[MASTER-AI-HISTORY-ERROR]', saveErr.message);
        }

        res.json({ text: aiText });

    } catch (err) {
        console.error('[MASTER-AI-CRITICAL-ERROR]', err); // Full error for logs
        
        let customError = "AI Diagnostic: Detailed Master AI analysis is currently on cooldown (All providers tested). Please rely on the live dashboard metrics above! 🌱";
        
        if (err.message.includes('429')) customError = "⚠️ **AI Rate Limit Reached**: Too many requests in a short time. Please wait 60 seconds.";
        if (err.message.includes('API_KEY_INVALID')) customError = "⚠️ **AI Configuration Error**: One or more API keys are invalid. Detailed analytics are limited.";

        res.json({ text: customError, isFallback: true });
    }
});

app.get('/api/admin/chat-history', auth, async (req, res) => {
    try {
        const history = await AdminChatMessage.find({ adminId: req.user.id }).sort({ timestamp: 1 }).limit(50).lean();
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch admin history' });
    }
});

// --- USER NOTIFICATION SYSTEM ---
app.get('/api/user/notifications', auth, async (req, res) => {
    try {
        // Since userId in Notification schema is 'Mixed', we must query both as string and ObjectId
        const notifications = await Notification.find({ 
            userId: { $in: [req.user.id, new mongoose.Types.ObjectId(req.user.id)] } 
        }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
});

app.put('/api/user/notifications/:id/read', auth, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/user/notifications', auth, async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user.id });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// USER Opt-in for Plant Care Reminders from Email
app.get('/api/reminders/opt-in', async (req, res) => {
    try {
        const { userId, orderId, choice } = req.query;
        
        if (!userId || !orderId) {
            return res.status(400).send('<h1>Invalid Request</h1><p>Missing user or order information.</p>');
        }

        if (choice === 'no') {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Thank you! 🎁</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fffcf0; color: #92400e; }
                        .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); text-align: center; max-width: 450px; border: 2px solid #fef3c7; }
                        h2 { margin-top: 0; font-size: 28px; color: #b45309; }
                        p { font-size: 18px; line-height: 1.6; color: #4b5563; }
                        .status { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 14px; margin-top: 20px; }
                    </style>
                    <script>
                        setTimeout(() => { window.close(); }, 1500);
                    </script>
                </head>
                <body>
                    <div class="card">
                        <h2>Thank you for shopping! 🎁</h2>
                        <p>We won't send you care reminders for this order. Happy Gardening! 🌿</p>
                        <div class="status">This window will close automatically...</div>
                    </div>
                </body>
                </html>
            `);
        }

        // Logic for YES - Create reminders for each plant in the order
        const order = await Order.findById(orderId).lean();
        if (!order) return res.status(404).send('<h1>Order Not Found</h1>');

        const sequence = [
            { type: 'water', delayDays: 3, label: 'Water Reminder' },
            { type: 'fertilizer', delayDays: 6, label: 'Fertilizer Reminder' },
            { type: 'sunlight', delayDays: 9, label: 'Sunlight Check' },
            { type: 'general', delayDays: 12, label: 'General Health Assessment' }
        ];

        const sequenceId = new mongoose.Types.ObjectId().toString();
        let reminderCount = 0;

        // Filter valid plant items from order
        const plantItems = (order.items || []).filter(item => !item.isGift); 
        
        const firstPlant = plantItems[0]; 
        if (firstPlant) {
            for (const item of sequence) {
                const reminderDate = new Date();
                // Sequence starts 3 days later, then stays every 3 days
                reminderDate.setDate(reminderDate.getDate() + item.delayDays);

                const reminder = new PlantReminder({
                    userId: userId,
                    plantName: firstPlant.name,
                    problemType: `Post-Delivery Care (${item.label})`,
                    reminderType: item.type,
                    reminderDate,
                    sequenceId: `${sequenceId}-${firstPlant.name.replace(/\s+/g, '-')}`
                });
                await reminder.save();
                reminderCount++;
            }
        }

        console.log(`[OPT-IN] User ${userId} opted-in for reminders for order ${orderId}. Created ${reminderCount} tasks.`);

        // Self-closing minimalist English response
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Success! 🌱</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdf4; color: #166534; }
                    .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); text-align: center; max-width: 450px; border: 2px solid #bbf7d0; }
                    h2 { margin-top: 0; font-size: 28px; color: #1a5d1a; }
                    p { font-size: 18px; line-height: 1.6; color: #374151; }
                    .status { display: inline-block; background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 30px; font-weight: 700; font-size: 14px; margin-top: 20px; }
                </style>
                <script>
                    setTimeout(() => { window.close(); }, 1500);
                </script>
            </head>
            <body>
                <div class="card">
                    <h2>Success! 🌱</h2>
                    <p>Now you will receive a reminder **after every 3 days** on our website's **bell icon**. ✅</p>
                    <div class="status">This window will close automatically...</div>
                </div>
            </body>
            </html>
        `);

    } catch (err) {
        console.error('[OPT-IN-ERROR]', err.message);
        res.status(500).send('<h1>Something went wrong</h1><p>Please try again later.</p>');
    }
});

// AI Assistant Chat History Routes
app.get('/api/chat-history', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json([]);
        }
        const messages = await ChatMessage.find({ userId: req.user.id })
            .sort({ timestamp: 1 })
            .limit(50)
            .lean();
        res.json(messages);
    } catch (err) {
        console.error('[CHAT-HISTORY-FETCH-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});

app.delete('/api/chat-history', auth, async (req, res) => {
    try {
        if (req.user.id === 'admin-special-id') {
            return res.json({ message: 'History cleared (Admin mode)' });
        }
        await ChatMessage.deleteMany({ userId: req.user.id });
        res.json({ message: 'Chat history cleared successfully' });
    } catch (err) {
        console.error('[CHAT-HISTORY-CLEAR-ERROR]', err.message);
        res.status(500).json({ message: 'Failed to clear chat history' });
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
        const { category, limit, state } = req.query;
        console.log(`[ProductsAPI] Query: "${category}" | Limit: ${limit} | State: ${state}`);

        let query = {};
        if (category && category !== 'Bestsellers') {
            let decodedCategory = decodeURIComponent(category).trim();

            const categoryMap = {
                'Soil & Growing Media': {
                    subCats: ['Soil & Growing Media', 'Soil Types', 'Organic Amendments', 'Growth Media'],
                    names: ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix', 'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure', 'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold']
                },
                'Fertilizers & Nutrients': {
                    subCats: ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters', 'Growth Boosters', 'Plant Growth Booster', 'Fertilizers'],
                    names: ['Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer', 'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix', 'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid', 'Nutrient']
                },
                'Gardening Tools': {
                    subCats: ['Gardening Tools', 'Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools', 'Tool', 'Gardening Tool'],
                    names: ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower', 'Trowel', 'Fork', 'Scoop', 'Shears', 'Cutter', 'Scissors', 'Knife', 'Mower', 'Planting Tool', 'Digging Tool'],
                    exclude: /Plants|Flowers|Blooms|Fruits|Vegetables|Herbs|Seeds/i
                },
                'Hand Tools': {
                    subCats: ['Hand Tools', 'Hand Tool'],
                    names: ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 'Trowel', 'Fork', 'Scoop'],
                    exclude: /Plants|Flowers|Blooms|Seeds/i
                },
                'Cutting Tools': {
                    subCats: ['Cutting Tools', 'Cutting Tool'],
                    names: ['Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 'Pruning', 'Shears', 'Cutter', 'Scissors', 'Knife'],
                    exclude: /Plants|Flowers|Blooms|Seeds/i
                },
                'Digging Tools': {
                    subCats: ['Digging Tools', 'Digging Tool'],
                    names: ['Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder'],
                    exclude: /Plants|Flowers|Blooms|Seeds/i
                },
                'Power Tools': {
                    subCats: ['Power Tools', 'Power Tool'],
                    names: ['Lawn Mower', 'Mower', 'Power Tool'],
                    exclude: /Plants|Flowers|Blooms|Seeds/i
                },
                'Seeds': {
                    subCats: ['Seeds', 'Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds', 'Flower Seeds', 'Microgreen Seeds', 'Seeds Kit'],
                    names: ['Seed']
                },
                'Accessories': {
                    subCats: ['Accessories', 'Pots & Planters', 'Watering Equipment', 'Support & Protection', 'Lighting Equipment', 'Decorative & Display'],
                    names: ['Pot', 'Planter', 'Watering', 'Tool']
                }
            };

            if (categoryMap[decodedCategory]) {
                const map = categoryMap[decodedCategory];
                const nameRegex = new RegExp(map.names.join('|'), 'i');
                query = {
                    $or: [
                        { category: { $in: map.subCats } },
                        { name: { $regex: nameRegex } },
                        { tags: { $in: map.subCats } }
                    ]
                };
                
                if (map.exclude) {
                    query = {
                        $and: [
                            query,
                            { category: { $not: map.exclude } },
                            { tags: { $not: map.exclude } },
                            { name: { $not: map.exclude } }
                        ]
                    };
                }
            } else {
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
                    query = {
                        $or: [
                            { category: { $regex: partialRegex } },
                            { tags: { $regex: partialRegex } }
                        ]
                    };
                } else {
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
            }
        }

        let products = [];
        if (category === 'Bestsellers') {
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

            if (topSelling.length > 0) {
                const productNames = topSelling.map(s => s._id);
                const dbProducts = await Product.find({ name: { $in: productNames } }).lean();
                products = topSelling
                    .map(s => dbProducts.find(p => p.name === s._id))
                    .filter(p => !!p);
            }

            // Pad with static Bestsellers if not enough order data
            if (products.length < limitNum) {
                const existingNames = products.map(p => p.name);
                const padding = await Product.find({
                    category: 'Bestsellers',
                    name: { $nin: existingNames }
                }).limit(limitNum - products.length).lean();
                products = [...products, ...padding];
            }
            console.log(`[ProductsAPI] Dynamic Bestsellers matched ${products.length} products`);
        } else {
            let productsQuery = Product.find(query).lean();
            if (limit) {
                const limitNum = parseInt(limit);
                if (!isNaN(limitNum)) {
                    productsQuery = productsQuery.limit(limitNum);
                }
            }
            products = await productsQuery;
        }

        // --- REGIONAL SORTING ENGINE ---
        if (state && products.length > 0) {
            const rawState = state.trim().toUpperCase();
            const searchStates = [rawState];
            
            // If full name provided, find code; if code provided, find full name
            if (INDIAN_STATE_CODE_MAP[rawState]) {
                searchStates.push(INDIAN_STATE_CODE_MAP[rawState]);
            } else {
                // Reverse lookup
                const fullName = Object.keys(INDIAN_STATE_CODE_MAP)
                    .find(key => INDIAN_STATE_CODE_MAP[key] === rawState);
                if (fullName) searchStates.push(fullName);
            }

            // Also add lowercase versions just in case
            const allSearchStates = [...new Set([...searchStates, ...searchStates.map(s => s.toLowerCase())])];

            try {
                // 1. Get regional popularity data - Using JS-side filtering like Admin Analytics for robustness
                const allOrders = await Order.find({ 
                    status: { $ne: 'Cancelled' }
                }).limit(500).lean();

                const filteredOrders = allOrders.filter(o => {
                    const s = (o.shippingDetails?.state || o.state || '').trim().toUpperCase();
                    return searchStates.some(match => s === match);
                });

                const popularityMap = {};
                filteredOrders.forEach(o => {
                    (o.items || []).forEach(item => {
                        if (item.name) {
                            const n = item.name.trim().toLowerCase();
                            popularityMap[n] = (popularityMap[n] || 0) + (item.quantity || 1);
                        }
                    });
                });

                // 2. Sort and Mark
                products.sort((a, b) => {
                    const scoreA = popularityMap[a.name?.trim().toLowerCase()] || 0;
                    const scoreB = popularityMap[b.name?.trim().toLowerCase()] || 0;
                    return scoreB - scoreA;
                });
                
                // Mark top regional favorites
                let markedCount = 0;
                products.forEach((p) => {
                    const productScore = popularityMap[p.name?.trim().toLowerCase()] || 0;
                    if (productScore > 0 && markedCount < 3) {
                        p.isRegionalFavorite = true;
                        markedCount++;
                    } else {
                        p.isRegionalFavorite = false;
                    }
                });

                // Debug log to file
                require('fs').appendFileSync('popular_plants_debug.log', 
                    `[${new Date().toISOString()}] State: ${rawState} | Matches: ${searchStates.join(',')} | Total Orders: ${allOrders.length} | Filtered: ${filteredOrders.length} | PopularityMap: ${JSON.stringify(popularityMap)}\n`
                );

            } catch (regErr) {
                console.error('[RegionalEngine] Error:', regErr.message);
            }
        }

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

        console.log(`\n🔍 [ADMIN SEARCH] Query: "${q}"`);
        console.log(`🕐 Time: ${new Date().toISOString()}`);

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
        const { items, totalAmount, paymentMethod, transactionId, paymentScreenshot, appliedOfferCode, offerBenefit, shippingDetails, deliveryType } = req.body;

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
            offerBenefit: offerBenefit || null,
            shippingDetails: shippingDetails || null,
            deliveryType: deliveryType || 'Standard Delivery (7 Days)'
        });

        const savedOrder = await newOrder.save();
        console.log(`[OrdersAPI] New order placed: ${savedOrder.orderId} for user ${req.user.id}`);

        // Automatically create a record in the Payment table
        try {
            const method = (savedOrder.paymentMethod || '').toUpperCase().includes('CASH') || (savedOrder.paymentMethod || '').toUpperCase().includes('COD') ? 'COD' : 'Online';
            const paymentRecord = new Payment({
                orderId: savedOrder._id,
                orderDisplayId: savedOrder.orderId,
                userId: savedOrder.userId,
                userName: savedOrder.userName || req.user.name || 'User',
                amount: savedOrder.totalAmount,
                method: method,
                paymentStatus: 'Pending'
            });
            await paymentRecord.save();
            console.log(`[PaymentAPI] Payment record saved for order: ${savedOrder.orderId}`);
        } catch (payErr) {
            console.error('[PaymentAPI] Failed to save payment record:', payErr.message);
        }

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

app.get('/api/admin/payments-stats', auth, async (req, res) => {
    try {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: "$method",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        
        // Transform for easier frontend consumption
        const result = {
            cod: stats.find(s => s._id === 'COD') || { count: 0, totalAmount: 0 },
            online: stats.find(s => s._id === 'Online') || { count: 0, totalAmount: 0 }
        };
        
        res.json(result);
    } catch (err) {
        console.error('[AdminPaymentStatsAPI] Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/admin/payment-summary', auth, async (req, res) => {
    try {
        // Fetch ALL orders to match the record count in the transaction table
        const rawOrders = await Order.find({}).populate('userId', 'fullName').lean();

        // Filter out "Guest Customer" and missing user data to match frontend table logic
        const orders = rawOrders.filter(o => {
            const name = (o.userName || o.userId?.fullName || '').trim();
            return name !== 'Guest Customer';
        });

        let cod = 0;
        let online = 0;
        let totalRevenue = 0;

        orders.forEach(o => {
            const method = (o.paymentMethod || '').toUpperCase();

            // Counts should include all records (including cancelled) to match the table
            if (method.includes('CASH') || method.includes('COD')) {
                cod++;
            } else {
                online++;
            }

            // ONLY include successful/shipped orders in the revenue total
            if (o.status !== 'Cancelled') {
                totalRevenue += (o.totalAmount || 0);
            }
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
        console.error('[AdminPaymentAPI] Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/admin/orders/:id/status', auth, async (req, res) => {
    try {
        const { status, courierName, trackingNumber, expectedDeliveryDate } = req.body;
        const updateData = { status };
        
        // Find existing order first to check previous states
        const existingOrder = await Order.findById(req.params.id);
        if(!existingOrder) return res.status(404).json({ message: 'Order not found' });

        if (courierName) {
            updateData.courierName = courierName;
            if (!existingOrder.assignedAt || courierName !== existingOrder.courierName) {
                updateData.assignedAt = new Date();
            }
        }
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (expectedDeliveryDate) updateData.expectedDeliveryDate = expectedDeliveryDate;

        // Automatically set to Shipped ONLY if tracking is being added for the first time 
        // AND the current incoming status isn't already Delivered/Cancelled.
        if (courierName && trackingNumber && status !== 'Delivered' && status !== 'Cancelled' && existingOrder.status === 'Pending') {
            updateData.status = 'Shipped';
        }

        // Record delivered timestamp if newly marked as delivered
        if (updateData.status === 'Delivered' && existingOrder.status !== 'Delivered') {
            updateData.deliveredAt = new Date();
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Asynchronously send status update email
        sendOrderStatusEmail(order);

        // Asynchronously send SMS/WhatsApp (Mock for now)
        sendSMSWhatsAppNotification(order);

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

// Toggle courier settlement status
app.put('/api/admin/orders/:id/courier-settled', auth, async (req, res) => {
    try {
        const { courierSettled } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { courierSettled: !!courierSettled },
            { new: true }
        ).populate('userId', 'fullName email phone alternatePhone address city state');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log(`[AdminOrdersAPI] Courier settlement for Order ${order.orderId}: ${courierSettled ? 'Settled' : 'Unsettled'}`);
        res.json(order);
    } catch (err) {
        console.error('[AdminOrdersAPI] Courier settlement error:', err.message);
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

// ADMIN API - Notifications (Consolidated below)

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
        console.log(`\n🗑️  [ADMIN DELETE] Attempting to delete product with ID: ${req.params.id}`);
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            console.log(`❌ [ADMIN DELETE] Product not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log(`✅ [ADMIN DELETE] Successfully deleted product: ${deletedProduct.name}`);
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

// --- Courier Management Routes ---
const Courier = require('./models/Courier');

// Seed default couriers if none exist
const seedCouriers = async () => {
    try {
        const count = await Courier.countDocuments();
        if (count === 0) {
            const defaultCouriers = [
                {
                    name: 'Blue Dart',
                    password: 'bluedart@greenie',
                    fee: 60,
                    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan', 'Madhya Pradesh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu'],
                    icon: 'fa-bolt',
                    email: 'support@bluedart.com',
                    phone: '18602331234',
                    certificate: ''
                },
                {
                    name: 'Delhivery',
                    password: 'delhivery@greenie',
                    fee: 45,
                    states: ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Bihar', 'Jharkhand'],
                    icon: 'fa-paper-plane',
                    email: 'customer.support@delhivery.com',
                    phone: '1246719500',
                    certificate: ''
                },
                {
                    name: 'DTDC',
                    password: 'dtdc@greenie',
                    fee: 50,
                    states: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Odisha', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Puducherry', 'Andaman and Nicobar Islands', 'Lakshadweep'],
                    icon: 'fa-truck',
                    email: 'customersupport@dtdc.com',
                    phone: '7305081234',
                    certificate: ''
                }
            ];
            await Courier.insertMany(defaultCouriers);
            console.log('[SEED] Default couriers seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding couriers:', err.message);
    }
};

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
        // Only returning fields necessary for delivery calculation
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

// COURIER: Bulk Settle Orders & Notify Admin
app.post('/api/orders/bulk-settle', auth, async (req, res) => {
    try {
        const { orderIds, courierName, totalAmount } = req.body;

        if (!orderIds || !Array.isArray(orderIds)) {
            return res.status(400).json({ message: 'Invalid order IDs' });
        }

        // 1. Update orders to fully settled with admin
        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { adminSettled: true } }
        );

        // 2. Create Settlement History Record
        const settlementRecord = new Settlement({
            courierName,
            amount: totalAmount,
            orderCount: orderIds.length,
            orderIds,
            status: 'Settled'
        });
        await settlementRecord.save();

        // 3. Create admin notification
        const adminNotification = new Notification({
            userId: 'admin',
            type: 'admin',
            title: 'New Courier Settlement 💰',
            message: `Courier partner "${courierName}" has transferred ₹${Number(totalAmount).toLocaleString('en-IN')} for ${orderIds.length} order(s).`,
            isRead: false,
            sender: courierName
        });

        await adminNotification.save();

        console.log(`[SETTLEMENT] Courier ${courierName} settled ${orderIds.length} orders. Total: ₹${totalAmount}`);
        res.json({ message: 'Settlement completed and records updated', count: orderIds.length });
    } catch (err) {
        console.error('[BULK-SETTLE-ERROR]', err.message);
        res.status(500).json({ message: 'Server error during settlement: ' + err.message });
    }
});

// GET: Settlement History for a courier
app.get('/api/admin/settlements/:courierName', auth, async (req, res) => {
    try {
        const history = await Settlement.find({ courierName: req.params.courierName })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADMIN: Get Admin Notifications (settlements, inquiries, etc.)
app.get('/api/admin/notifications', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied - Admins only' });
        }
        // Fetch ALL admin-relevant notifications (Settlements, Low Stock, Messages, etc.)
        const notifications = await Notification.find({ 
            $or: [
                { userId: 'admin' },
                { type: 'admin' },
                { type: 'admin-msg' },
                { type: 'LowStock' },
                { type: 'NewOrder' },
                { type: 'Reply' }
            ] 
        }).sort({ createdAt: -1 }).limit(100);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN/COURIER: Communication Hub Messaging
app.post('/api/admin/notify-courier', auth, async (req, res) => {
    try {
        const { courierName, title, message, forceCourierSide } = req.body;
        if (!courierName || !title || !message) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const isAdmin = (req.user.isAdmin || req.user.id === 'admin-special-id') && !forceCourierSide;

        if (isAdmin) {
            // ADMIN SENDS MESSAGE TO COURIER
            const courierNoti = new Notification({
                userId: courierName,   // Recipient
                sender: 'admin',      // Sender
                type: 'admin-msg',
                title: title || 'Message from Admin 📩',
                message: message,
                isRead: false
            });
            await courierNoti.save();
            res.json({ message: 'Message sent to ' + courierName });
        } else {
            // COURIER SENDS MESSAGE TO ADMIN
            const adminNoti = new Notification({
                userId: 'admin',      // Recipient
                sender: courierName,  // Sender
                type: 'admin',
                courierName: courierName, // Useful for filtering in Admin Hub
                title: `Message from ${courierName} 📥`,
                message: message,
                isRead: false
            });
            await adminNoti.save();
            res.json({ message: 'Message sent to Admin' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// COURIER: Get chat history (Ascending for chat flow)
app.get('/api/courier/notifications/:courierName', async (req, res) => {
    try {
        const { courierName } = req.params;
        const notifications = await Notification.find({ 
            $or: [
                { userId: courierName }, // Received by courier
                { sender: courierName }  // Sent by courier
            ]
        }).sort({ createdAt: 1 }).limit(50); // Ascending order (Oldest to Newest)
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// COURIER: Clear chat history
app.delete('/api/courier/notifications/:courierName', auth, async (req, res) => {
    try {
        const { courierName } = req.params;
        await Notification.deleteMany({
            $or: [
                { userId: courierName },
                { sender: courierName }
            ]
        });
        res.json({ message: 'Chat history cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});
// ADMIN: Mark admin notification as read
app.put('/api/admin/notifications/:id/read', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied' });
        }
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// ADMIN: Mark ALL admin notifications as read
app.put('/api/admin/notifications/read', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied' });
        }
        await Notification.updateMany({ 
            $or: [
                { userId: 'admin' },
                { type: 'admin' },
                { type: 'LowStock' },
                { type: 'NewOrder' },
                { type: 'Reply' }
            ] 
        }, { $set: { isRead: true } });
        res.json({ message: 'All admin notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

/**
 * NEW: Admin Growth Hub - Marketing Assistant (Restored)
 */
app.post('/api/admin/generate-marketing', auth, async (req, res) => {
    console.log(`[MarketingAPI] POST received for ${req.body.type} - product: ${req.body.productName}`);
    const { type, productName, offerDetails, tone = 'professional' } = req.body;
    try {
        let prompt = "";
        if (type === 'social') {
            prompt = `Create a viral, attractive Instagram caption for a plant product named "${productName}". 
                     Details: ${offerDetails}. Tone: ${tone}. Include emojis and relevant hashtags. 
                     Format the output cleanly in plain text.`;
        } else if (type === 'email') {
            prompt = `Write a professional email draft for newsletter subscribers about "${productName}". 
                     Subject line included. Tone: Catchy and green-focused. Details: ${offerDetails}.`;
        } else if (type === 'care') {
            prompt = `Suggest 3 essential, quick-to-read care tips for a plant named "${productName}". 
                     Focus on: Sunlight, Watering, and a "Pro Secret". Include emojis.`;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // 3-second timeout to guarantee ultra-fast responses (either AI or Template!)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('AI Request Timeout or Rate Limited')), 3000);
        });
        
        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]);

        const response = await result.response;
        res.json({ text: response.text() });
    } catch (err) {
        console.error('[MarketingAPI] Error/Timeout:', err.message);
        
        // INSTANT OFFLINE FALLBACK GENERATOR with 6 VARIATIONS!
        let fallbackText = "";
        const cleanName = productName ? productName.trim().charAt(0).toUpperCase() + productName.trim().slice(1) : "Plant";
        const randomIndex = Math.floor(Math.random() * 6); // Choose from 6 variations
        
        if (type === 'social') {
            const variations = [
                `🌿 Say hello to green goodness! 🌿\n\nOur stunning ${cleanName} is exactly what your space needs right now. ✨\n\n${offerDetails}\n\nHurry, limited stock available! 🛍️🛒\n\n#GreenieCulture #${cleanName.replace(/\\s+/g, '')} #PlantLove #HomeDecor #GreenLiving`,
                `✨ **PLANT ALERT** ✨\n\nLevel up your home aesthetic with the one and only ${cleanName}! 🍃\n\n${offerDetails}\n\nSwipe up or DM to order before we sell out! 🚚🏠\n\n#UrbanJungle #PlantParent #InteriorDesign #GreenVibes`,
                `Did someone say **PLANT REFRESH**? 🌿\n\nThe ${cleanName} is back in stock and looks more vibrant than ever. 😍\n\n🔥 ${offerDetails}\n\nDon't let this one slip away! ✨🙌\n\n#ShopSmall #EcoFriendly #TrendingPlants #BetterLiving`,
                `🪴 **HOME TRANSFORMATION** 🪴\n\nBring the outdoors in with our best-selling ${cleanName}! 🌿\n\n${offerDetails}\n\nPerfect for your office, bedroom, or living room. 🪴✨\n\n#PlantDecor #LushLiving #GreenieCulture #HomeInspo`,
                `💚 **VIBE CHECK: PURE GREEN** 💚\n\nMeet the ${cleanName}. Not just a plant, but a mood. 🌿✨\n\n${offerDetails}\n\nGet yours today and breathe better! 🌬️🍃\n\n#BreatheClean #PlantAesthetic #GreenieCulture #MustHave`,
                `🌿 **INSTANT JUNGLE VIBES** 🌿\n\nWant that jungle look? You need the ${cleanName}. 🍃✨\n\n${offerDetails} for a limited time ONLY!\n\nLink in bio to shop! 📲🛍️\n\n#PlantLover #JungleVibes #GreenieCulture #GreenSpace`
            ];
            fallbackText = variations[randomIndex];
        } else if (type === 'email') {
            const variations = [
                `**Subject:** Elevate your space with our ${cleanName}! 🌿\n\nHi Plant Lover,\n\nWe know how much you love adding life to your home. That's why we're bringing you an exclusive update on our beautiful **${cleanName}**!\n\n✨ **Special Offer:** ${offerDetails}\n\nDon't miss out on this chance to grow your indoor jungle. Click below to shop now!\n\nStay Green,\n**The Greenie Culture Team** 🌱`,
                `**Subject:** Something green is coming your way... 🍃\n\nHello Friend,\n\nOur ${cleanName} collection is finally here, and it's looking spectacular! ✨\n\nTo celebrate, we are offering: **${offerDetails}**\n\nGrab your favorites before they're gone! 🌿🏠\n\nWarmly,\n**Greenie Culture Support**`,
                `**Subject:** Fresh Vibes only! ✨ (Inside: ${cleanName})\n\nHey there,\n\nReady for a home makeover? The ${cleanName} is the perfect choice for a fresh start. 🌿\n\n🎁 **Bonus:** ${offerDetails}\n\nLet's grow together!\n\n**Greenie Culture HQ** 🌱`,
                `**Subject:** 🌿 Exclusive Access: The ${cleanName} is here!\n\nGreetings,\n\nWe've saved the best for our inner circle. The ${cleanName} is finally back, and we've got a treat for you.\n\n🍃 **Offer:** ${offerDetails}\n\nMake your space more vibrant today.\n\nBest,\n**Greenie Culture**`,
                `**Subject:** 🌱 Your daily dose of green + a special gift!\n\nHi there,\n\nAt Greenie Culture, we believe everyone needs a ${cleanName}. Here's why you should get yours now:\n\n✨ **Deal of the Day:** ${offerDetails}\n\nShop the collection before it's too late! 🪴💫`,
                `**Subject:** 🍃 Time for a Plant Upgrade? (Save on ${cleanName})\n\nHey Plant Parent,\n\nIs your shelf looking a bit empty? Fill it with the gorgeous ${cleanName}! 🌿\n\n🔥 **Hot Offer:** ${offerDetails}\n\nOrder now for fast delivery! 🚚✨\n\nCheers,\n**Greenie Culture Team**`
            ];
            fallbackText = variations[randomIndex];
        } else if (type === 'care') {
            const variations = [
                `🌱 **QUICK CARE GUIDE: ${cleanName.toUpperCase()}** 🌱\n\n1. **☀️ Sunlight**: Keep me in bright, indirect light for those lush leaves.\n2. **💧 Watering**: Only water when the top 1-inch of soil feels dry. I hate soggy feet!\n3. **✨ Pro Secret**: Wipe my leaves with a damp cloth once a week to help me breathe better.\n\nHappy Growing! 🌱✨`,
                `🌿 **CARE TIPS FOR YOUR ${cleanName.toUpperCase()}** 🌿\n\n🌵 **Environment**: I love high humidity and warm spots away from drafts.\n🚿 **Feed**: Give me balanced liquid fertilizer once a month during spring/summer.\n✂️ **Pruning**: Trim any yellow leaves to keep me focused on new growth!\n\nLove your plants! 💚`,
                `📗 **THE ${cleanName.toUpperCase()} MASTERCLASS** 📗\n\n🌤️ **Exposure**: Diffused light is key. If my leaves burn, I'm too close to the window!\n🧂 **Drainage**: Ensure my pot has holes. Drainage is life! 🕳️\n🔄 **Rotation**: Turn me 90 degrees every week so I grow evenly towards the light. 🔄\n\nKeep it green! 🌿`,
                `🪴 **HAPPY ${cleanName.toUpperCase()} CHEATSHEET** 🪴\n\n☁️ **Humidity**: I love being misted or placed on a pebble tray! 💦\n🌡️ **Temp**: Anything between 18°C-24°C is perfect for me. 🌡️\n🐾 **Pet Safety**: Check if I'm toxic! Keep me out of reach of curious paws. 🐾\n\nStay safe and green! 🍃`,
                `🌿 **${cleanName.toUpperCase()} GROWTH TIPS** 🌿\n\n🏺 **Repotting**: I like being slightly root-bound, but repot me every 2 years! 🏺\n🧴 **Pest Control**: Neem oil is my best friend for keeping bugs away. 🐛🚫\n🍯 **Soil**: Use a well-draining peat-based mix for best results. 🪴\n\nWatch me grow! ✨🍃`,
                `🌟 **EXPERT ${cleanName.toUpperCase()} CARE** 🌟\n\n💧 **Consistency**: I prefer a regular watering schedule over "random soakings". 📅\n🌬️ **Airflow**: Good ventilation prevents many common plant diseases! 🌬️\n🎶 **Music**: Believe it or not, I love some gentle background music! 🎵🌱\n\nLet's thrive together! 💚`
            ];
            fallbackText = variations[randomIndex];
        }

        res.json({ text: fallbackText });
    }
});

/**
 * ADMIN: Get AI-Prioritized Operations (Tasks)
 */
app.get('/api/admin/ai-tasks', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const tasks = [];
        
        // 1. Critical Stock Alerts (< 10)
        const criticalItems = await Product.find({ stock: { $lt: 10 } }).limit(2);
        criticalItems.forEach(p => tasks.push(`🚨 CRITICAL: Replenish ${p.name} (Stock: ${p.stock})`));

        // 2. Pending Inquiries
        const pendingCount = await Inquiry.countDocuments({ status: 'Pending' });
        if (pendingCount > 0) tasks.push(`📧 Action Required: Reply to ${pendingCount} pending customer inquiries.`);

        // 3. Low Stock Alerts (10 - 25)
        if (tasks.length < 4) {
            const lowItems = await Product.find({ stock: { $gte: 10, $lt: 25 } }).limit(2);
            lowItems.forEach(p => tasks.push(`⚠️ Low Stock: ${p.name} (${p.stock} units remaining)`));
        }

        // 4. Daily Volume Insight
        const today = new Date();
        today.setHours(0,0,0,0);
        const orderCount = await Order.countDocuments({ orderDate: { $gte: today } });
        if (orderCount > 8) tasks.push(`🏁 High Traffic: ${orderCount} orders placed today so far! 🚀`);

        // 5. General AI Optimization Tips
        if (tasks.length < 3) tasks.push("💡 AI Optimize: Review seasonal placement for Flowering Plants.");
        if (tasks.length < 5) tasks.push("📊 Strategic: High search volume detected for Peace Lily in Maharashtra.");

        res.json({ tasks: tasks.slice(0, 8) });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

/**
 * ADMIN: Get Plant Care Reminders Registry
 */
app.get('/api/admin/plant-reminders', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const reminders = await PlantReminder.find()
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

/**
 * ADMIN: Get AI Assistant Chat History
 */
app.get('/api/admin/chat-history', auth, async (req, res) => {
    try {
        if (!req.user.isAdmin && req.user.id !== 'admin-special-id') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const history = await AdminChatMessage.find()
            .sort({ timestamp: 1 })
            .limit(100);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Server startup is now handled inside the MongoDB connection block (line 182-205)

/**
 * ADMIN: Create a 4-Part Plant Care Reminder Sequence
 */
app.post('/api/admin/reminders', auth, async (req, res) => {
    const debugInfo = { timestamp: new Date(), userId: req.user?.id, body: req.body };
    fs.appendFileSync(path.join(__dirname, 'reminder_logs.txt'), JSON.stringify(debugInfo) + '\n');
    
    try {
        const { plantName, problemType } = req.body;
        console.log(`[REMINDER-DEBUG] User ${req.user.id} setting reminder for ${plantName}`);
        
        const sequence = [
            { type: 'water', delayDays: 0, label: 'Water Reminder' },
            { type: 'fertilizer', delayDays: 4, label: 'Fertilizer Reminder' },
            { type: 'sunlight', delayDays: 8, label: 'Sunlight Check' },
            { type: 'general', delayDays: 12, label: 'General Health Assessment' }
        ];

        const sequenceId = new mongoose.Types.ObjectId().toString();
        const createdReminders = [];

        for (const item of sequence) {
            const reminderDate = new Date();
            
            if (item.type === 'water') {
                // First one in 1 minute for immediate feedback
                reminderDate.setMinutes(reminderDate.getMinutes() + 1);
            } else {
                // Subsequent ones every 4 days
                reminderDate.setDate(reminderDate.getDate() + item.delayDays);
            }

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
        res.status(500).json({ message: 'Failed to set reminders: ' + err.message });
    }
});

/**
 * Scheduler for Plant Care Reminders (Runs Every Minute)
 */
cron.schedule('* * * * *', async () => {
    // Guard against running queries when DB is not connected
    if (mongoose.connection.readyState !== 1) {
        console.log('[SCHEDULER] Database not connected. Skipping reminder check...');
        return;
    }

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

// =======================
// CART API ROUTES
// =======================

// GET /api/cart - Get user's cart
app.get('/api/cart', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }
        res.json(cart.items);
    } catch (err) {
        console.error('[CART GET ERROR]', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/cart - Update user's cart
app.post('/api/cart', auth, async (req, res) => {
    try {
        console.log('[CART POST] Hit by user:', req.user.id, 'Payload:', req.body);
        const { cart: items } = req.body; // frontend sends { cart: items }
        
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }
        
        // Ensure required fields are present
        const processedItems = (items || []).map(item => ({
            productId: item.productId || item.id, // Fallback for testing
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            image: item.image,
            weight: item.weight,
            isGift: item.isGift,
            planter: item.planter
        }));

        cart.items = processedItems;
        await cart.save();
        
        res.json({ message: 'Cart saved successfully', items: cart.items, totalAmount: cart.totalAmount });
    } catch (err) {
        console.error('[CART POST ERROR]', err.message);
        res.status(500).json({ message: 'Server Error', details: err.message });
    }
});
// END CART ROUTES
