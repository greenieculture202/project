const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const PlantReminder = mongoose.model('PlantReminder', new mongoose.Schema({}, { strict: false }));
    const userIdStr = '69b0432993e8fc277983d59e';
    const rems = await PlantReminder.find({ 
        userId: { $in: [userIdStr, new mongoose.Types.ObjectId(userIdStr)] } 
    });
    console.log(JSON.stringify(rems, null, 2));
    process.exit(0);
}

check();
