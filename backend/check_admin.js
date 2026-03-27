const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

async function checkAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const adminEmail = 'admin@greenie.com';
        const password = 'radheradhe';

        let admin = await User.findOne({ email: adminEmail });
        if (admin) {
            console.log('Admin found in DB');
            console.log('Role:', admin.role);
            console.log('isBlocked:', admin.isBlocked);
            
            // Check if password matches
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log('Password matches "radheradhe":', isMatch);

            if (admin.role !== 'admin' || admin.isBlocked || !isMatch) {
                console.log('Updating admin...');
                admin.role = 'admin';
                admin.isBlocked = false;
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(password, salt);
                await admin.save();
                console.log('Admin fixed!');
            }
        } else {
            console.log('Admin NOT found in DB. Creating one...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            admin = new User({
                fullName: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isBlocked: false
            });
            await admin.save();
            console.log('Admin created successfully!');
        }

        const allAdmins = await User.find({ role: 'admin' });
        console.log('Total admins in DB:', allAdmins.length);
        allAdmins.forEach(a => console.log(`- ${a.email} (${a.fullName})`));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
