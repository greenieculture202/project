require('dotenv').config();
const mongoose = require('mongoose');
const Cart = require('./models/Cart');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB...");
    
    try {
        // Explicitly create the 'carts' collection in the database
        await Cart.createCollection();
        console.log("Table 'carts' created successfully!");
    } catch (err) {
        console.error("Error creating collection:", err.message);
    }
    
    mongoose.connection.close();
    process.exit(0);
}).catch(err => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
});
