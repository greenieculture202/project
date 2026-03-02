const mongoose = require('mongoose');
require('dotenv').config();
const Offer = require('./models/Offer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

const initialOffers = [
    {
        badge: '🌿 EXCLUSIVE DEAL',
        title: 'BOGO OFFER',
        subtitle: 'Buy 2 XL Plants',
        discountLine: '& GET 1 MEDIUM PLANT FREE',
        description: 'Double the green, double the joy! Our BOGO offer is here to help you expand your garden effortlessly.',
        features: ['Premium XL Quality', 'Healthy Root Systems', 'Free Medium Plant', 'Expert Care Guide'],
        ctaText: 'GRAB THIS DEAL',
        ctaLink: '/bogo-offer',
        image: '/images/bogo_offer_v2.jpg',
        cardBg: '#f0fdf4',
        accentColor: '#16a34a',
        accentLight: '#dcfce7',
        accentText: '#14532d',
        tag: 'BOGO',
        tagBg: '#fbbf24',
        tagText: '#78350f',
        timer: 'Ends Soon!',
        timerBg: '#dcfce7'
    },
    {
        badge: '🏺 INDOOR SPECIAL',
        title: 'INDOOR JUNGLE',
        subtitle: 'Buy Any 2 Indoor Plants',
        discountLine: '& GET A DESIGNER CERAMIC POT FREE',
        description: 'Create your own indoor oasis with our stunning collection of low-maintenance indoor plants.',
        features: ['Air Purifying', 'Low Maintenance', 'Designer Ceramic Pot', 'Safe Packaging'],
        ctaText: 'SHOP INDOOR',
        ctaLink: '/indoor-offer',
        image: '/images/indoor_jungle_offer.jpg',
        cardBg: '#f5f3ff',
        accentColor: '#7c3aed',
        accentLight: '#ede9fe',
        accentText: '#4c1d95',
        tag: 'FREE POT',
        tagBg: '#a78bfa',
        tagText: '#fff',
        timer: 'Limited Time',
        timerBg: '#ede9fe'
    },
    {
        badge: '🛠️ GARDEN TOOLS',
        title: 'PRO GARDENER',
        subtitle: 'Essential Tool Kit',
        discountLine: '25% OFF ON ALL TOOLS',
        description: 'Level up your gardening game with professional-grade tools designed for comfort and efficiency.',
        features: ['Ergonomic Design', 'Stainless Steel', 'Lifetime Warranty', 'Beginner Friendly'],
        ctaText: 'VIEW TOOLS',
        ctaLink: '/garden-offer',
        image: '/images/garden_tools_offer.jpg',
        cardBg: '#fff7ed',
        accentColor: '#ea580c',
        accentLight: '#ffedd5',
        accentText: '#7c2d12',
        tag: '25% OFF',
        tagBg: '#f97316',
        tagText: '#fff',
        timer: 'Big Savings',
        timerBg: '#ffedd5'
    },
    {
        badge: '🌸 FLOWERING SPECIAL',
        title: 'FLOWER BONANZA',
        subtitle: 'Premium Flower Seeds',
        discountLine: 'BUY 3 GET 2 FREE',
        description: 'Bring vibrant colors to your balcony or garden with our curated selection of high-germination flower seeds.',
        features: ['High Germination', 'Tested Varieties', 'Growing Guide', 'Organic Seeds'],
        ctaText: 'GET SEEDS',
        ctaLink: '/flowering-offer',
        image: '/images/flowering_seeds_offer.jpg',
        cardBg: '#fdf2f8',
        accentColor: '#db2777',
        accentLight: '#fce7f3',
        accentText: '#831843',
        tag: '3+2 FREE',
        tagBg: '#f472b6',
        tagText: '#fff',
        timer: 'Seasonal',
        timerBg: '#fce7f3'
    }
];

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Remove existing offers to avoid duplicates during seeding
        await Offer.deleteMany({});
        console.log('Cleared existing offers.');

        await Offer.insertMany(initialOffers);
        console.log('Successfully seeded 4 initial offers.');

        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedData();
