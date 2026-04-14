const mongoose = require('mongoose');
const Courier = require('../models/Courier');

const MONGODB_URI = 'mongodb://localhost:27017/mejor';

async function seedCouriers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const companies = [
      {
        name: 'bluedart',
        password: 'pass',
        states: ['Maharashtra', 'Gujarat', 'Goa'],
        fee: 60,
        icon: 'fa-paper-plane'
      },
      {
        name: 'delivery',
        password: 'pass',
        states: ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh'],
        fee: 40,
        icon: 'fa-truck-fast'
      },
      {
        name: 'dtdc',
        password: 'pass',
        states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana', 'Andhra Pradesh'],
        fee: 55,
        icon: 'fa-box-open'
      }
    ];

    for (const comp of companies) {
      const exists = await Courier.findOne({ name: comp.name });
      if (!exists) {
        await Courier.create(comp);
        console.log(`Created courier: ${comp.name}`);
      } else {
        // Update states to ensure routing works as expected
        exists.states = comp.states;
        await exists.save();
        console.log(`Updated states for courier: ${comp.name}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding couriers:', err);
    process.exit(1);
  }
}

seedCouriers();
