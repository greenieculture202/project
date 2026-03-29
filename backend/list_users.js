const mongoose = require('mongoose');

async function listUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mejor', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const userSchema = new mongoose.Schema({
            fullName: String,
            email: String,
            role: String
        }, { strict: false });
        const User = mongoose.model('User', userSchema);

        const users = await User.find({}).limit(5).lean();
        console.log(JSON.stringify(users, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

listUsers();
