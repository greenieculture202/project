const mongoose = require('mongoose');
const AboutSection = require('./models/AboutSection');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenie_culture';

const seedAbout = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await AboutSection.deleteMany({});
        console.log('Cleared old about sections');

        const sections = [
            {
                type: 'journey',
                title: 'Rooted in Passion, Growing with Purpose',
                content: 'Greenie Culture was born out of a simple realization: in our fast-paced digital world, we are losing our connection to the living, breathing world around us. Our journey began in 2024 with a mission to bridge this gap. We spent months traveling to hidden nurseries, meeting with master botanists, and sourcing the most resilient, vibrant species that could thrive in modern homes.',
                image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80',
                order: 1
            },
            {
                type: 'value',
                title: 'Sustainable Sourcing',
                content: 'We work directly with local nurseries to ensure every plant is raised with love and environmental responsibility.',
                icon: 'fa-leaf',
                order: 2
            },
            {
                type: 'value',
                title: 'Quality Care',
                content: 'Each product is rigorously tested to meet our high standards of durability and botanical health.',
                icon: 'fa-hand-holding-heart',
                order: 3
            },
            {
                type: 'value',
                title: 'Community First',
                content: 'More than just a store, we are a community of plant lovers sharing knowledge and growth together.',
                icon: 'fa-users',
                order: 4
            },
            {
                type: 'stat',
                title: 'Happy Planters',
                content: '5k+',
                icon: 'fa-users-viewfinder',
                order: 5
            },
            {
                type: 'stat',
                title: 'Plant Varieties',
                content: '200+',
                icon: 'fa-seedling',
                order: 6
            },
            {
                type: 'stat',
                title: 'Gardening Tools',
                content: '1k+',
                icon: 'fa-tools',
                order: 7
            },
            {
                type: 'stat',
                title: 'User Rating',
                content: '4.8★',
                icon: 'fa-star',
                order: 8
            },
            {
                type: 'founder',
                title: 'Founder, Greenie Culture',
                content: 'Plants don\'t just decorate a room; they change how you feel in it. Our goal is to make plant parenthood accessible, joyful, and deeply rewarding for everyone, regardless of their thumb color.',
                author: 'Founder',
                order: 9
            },
            {
                type: 'quote',
                title: 'Audrey Hepburn',
                content: 'To plant a garden is to believe in tomorrow.',
                author: 'Audrey Hepburn',
                order: 10
            }
        ];

        await AboutSection.insertMany(sections);
        console.log('Seeded About Us sections successfully');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding About Us:', err);
        process.exit(1);
    }
};

seedAbout();
