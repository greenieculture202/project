require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB cluster.");
        const modelsPath = path.join(__dirname, 'models');
        const files = fs.readdirSync(modelsPath);
        
        let report = {};
        for(let file of files) {
            if(file.endsWith('.js')) {
                const modelName = file.split('.')[0];
                const Model = require(path.join(modelsPath, file));
                try {
                    const count = await Model.countDocuments();
                    report[modelName] = count;
                } catch(e) {
                    report[modelName] = 'Error: ' + e.message;
                }
            }
        }
        console.log("Database Stats:", JSON.stringify(report, null, 2));
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection Error:", err);
        process.exit(1);
    });
