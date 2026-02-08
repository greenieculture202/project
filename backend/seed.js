const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB...');

        // Create a simple schema and model to insert data
        const SetupSchema = new mongoose.Schema({
            message: String,
            createdAt: { type: Date, default: Date.now }
        });

        const Setup = mongoose.model('Setup', SetupSchema);

        // Insert a document
        await Setup.create({ message: 'Database initialized successfully!' });

        console.log('Dummy data inserted. Database "mejor" should now be visible.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
