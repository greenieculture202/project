const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = 'greenie-secret-key-123';

mongoose.connect('mongodb://localhost:27017/mejor').then(async () => {
    // Find a non-admin user
    const user = await User.findOne({ email: { $exists: true } }).lean();
    if (!user) {
        console.log('ERROR: No user found in DB!');
        process.exit(0);
    }
    console.log('Found user:', user.email, 'id:', user._id.toString());

    // Generate a valid token
    const token = jwt.sign({ user: { id: user._id.toString() } }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token.substring(0, 30) + '...');

    // Test POST /api/user/orders directly via HTTP
    const orderPayload = JSON.stringify({
        items: [{
            productId: user._id.toString(),
            name: 'Test Plant',
            price: 299,
            quantity: 1,
            image: 'test.jpg',
            weight: null,
            planter: null,
            isGift: false
        }],
        totalAmount: 299
    });

    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/user/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
            'Content-Length': Buffer.byteLength(orderPayload)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', async () => {
            console.log('POST /api/user/orders response status:', res.statusCode);
            console.log('Response body:', data);

            // Check DB again
            const count = await Order.countDocuments({});
            console.log('Orders in DB after test:', count);
            process.exit(0);
        });
    });
    req.on('error', (e) => {
        console.error('HTTP error:', e.message);
        process.exit(1);
    });
    req.write(orderPayload);
    req.end();
}).catch(e => {
    console.error('MongoDB error:', e.message);
    process.exit(1);
});
