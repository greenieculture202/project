const Placement = require('./models/Placement');
const Faq = require('./models/Faq');
const Courier = require('./models/Courier');
const Review = require('./models/Review');
const PlantReminder = require('./models/PlantReminder');
const User = require('./models/User');

const seedPlacements = async () => {
    try {
        const count = await Placement.countDocuments();
        if (count < 6) {
            if (count > 0) await Placement.deleteMany({});
            const defaultPlacements = [
                {
                    name: 'SmartLeaf Indoors',
                    description: 'The living room is the heart of your home. Adding plants here creates a welcoming atmosphere and naturally purifies the air.',
                    image: '/images/smartleaf_indoors.jpg',
                    videoUrl: '/videos/living-room.mp4',
                    features: ['Air Purifying', 'Low Maintenance', 'Stunning Decor'],
                    badge: 'LIVING SPACES',
                    categoryRoute: '/products/indoor-plants'
                },
                {
                    name: 'EcoScape Outdoors',
                    description: 'Transform your garden or balcony with plants that thrive under the open sky and enhance your outdoor living.',
                    image: '/images/outdoor_vibe_new.jpg',
                    videoUrl: '/videos/outdoor.mp4',
                    features: ['Weather Resistant', 'Sun Loving', 'Natural Growth'],
                    badge: 'OUTDOOR LIVING',
                    categoryRoute: '/products/outdoor-plants'
                },
                {
                    name: 'Gardening',
                    description: 'Start your own green journey. Our gardening kits and plants are perfect for both beginners and experts.',
                    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
                    videoUrl: '/videos/gardening.mp4',
                    features: ['Beginner Friendly', 'Complete Kits', 'Sustainable'],
                    badge: 'START GROWING',
                    categoryRoute: '/products/gardening'
                },
                {
                    name: 'EcoHaven Rooftop',
                    description: 'Elevate your urban living with a sustainable rooftop garden that brings nature closer to the sky.',
                    image: '/images/rooftop_garden.jpg',
                    videoUrl: '/videos/ecohaven.mp4',
                    features: ['Sustainable Living', 'Urban Oasis', 'Low Carbon Footprint'],
                    badge: 'ECO FRIENDLY',
                    categoryRoute: '/products/outdoor-plants'
                },
                {
                    name: 'miniheaven balcony',
                    description: 'Create your own mini heaven in your balcony with our curated collection of outdoor plants that flourish in open spaces.',
                    image: '/images/miniheaven_balcony.jpg',
                    videoUrl: '/videos/home_balcony.mp4',
                    features: ['Sun Loving', 'Urban Oasis', 'Low Maintenance'],
                    badge: 'BALCONY GARDEN',
                    categoryRoute: '/products/flowering-plants'
                },
                {
                    name: 'kitchen',
                    description: 'Fresh herbs and air-purifying plants make your kitchen a more vibrant and healthy place to cook and gather.',
                    image: '/images/kitchen_image.jpg',
                    videoUrl: '/videos/kitchen.mp4',
                    features: ['Culinary Herbs', 'Air Purifying', 'Compact Size'],
                    badge: 'FRESH COOKING',
                    categoryRoute: '/products/indoor-plants'
                }
            ];
            await Placement.insertMany(defaultPlacements);
            console.log('[SEED] Default placements seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding placements:', err.message);
    }
};

const seedFaqs = async () => {
    try {
        const count = await Faq.countDocuments();
        // If there are only 5 (the old amount), let's refresh to add variety
        if (count <= 5) {
            if (count > 0) await Faq.deleteMany({});
            const defaultFaqs = [
                {
                    category: 'Orders',
                    question: 'How do I track my order?',
                    answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard under "My Orders".',
                    order: 1
                },
                {
                    category: 'Payment',
                    question: 'What payment methods do you accept?',
                    answer: 'We accept UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery. All transactions are 100% secure.',
                    order: 2
                },
                {
                    category: 'Delivery',
                    question: 'How long does delivery take?',
                    answer: 'We deliver within 3-7 business days depending on your location. Metro cities usually receive orders within 2-3 days.',
                    order: 3
                },
                {
                    category: 'Plants',
                    question: 'Are the plants safe for pets?',
                    answer: 'Some plants are pet-friendly and some are not. Check the individual product page for a "Pet Safe" badge. Commonly safe plants include Spider Plant, Boston Fern, and Areca Palm.',
                    order: 4
                },
                {
                    category: 'Returns',
                    question: 'What is your return policy?',
                    answer: 'We have a 7-day return/replacement policy. If the plant arrives damaged or dead, simply send us a photo within 7 days and we will send a free replacement.',
                    order: 5
                },
                {
                    category: 'Plants',
                    question: 'Do you provide plant care instructions?',
                    answer: 'Yes! Every plant comes with a specialized care card. Plus, you can use our AI Plant Assistant 24/7 for specific diagnostics.',
                    order: 6
                },
                {
                    category: 'Account',
                    question: 'How can I reset my password?',
                    answer: 'Go to the Login page and click "Forgot Password". We will send an OTP to your registered Gmail address to reset it.',
                    order: 7
                },
                {
                    category: 'Delivery',
                    question: 'Do you deliver to my city?',
                    answer: 'We deliver pan-India! We use premium couriers like Blue Dart and Delhivery to ensure your plants arrive fresh.',
                    order: 8
                },
                {
                    category: 'Orders',
                    question: 'Can I cancel my order?',
                    answer: 'Orders can be cancelled within 24 hours of placement as long as they haven\'t been shipped.',
                    order: 9
                },
                {
                    category: 'Plants',
                    question: 'How do I know if my plant needs water?',
                    answer: 'The best way is to check the soil. If the top 1-2 inches are dry, it\'s time for a drink! You can also set a "Plant Care Reminder" via our AI chatbot.',
                    order: 10
                }
            ];
            await Faq.insertMany(defaultFaqs);
            console.log('[SEED] Default FAQs expanded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding FAQs:', err.message);
    }
};

const seedCouriers = async () => {
    try {
        const count = await Courier.countDocuments();
        if (count === 0) {
            const defaultCouriers = [
                {
                    name: 'Blue Dart',
                    password: 'bluedart@greenie',
                    fee: 60,
                    states: ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan', 'Madhya Pradesh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu'],
                    icon: 'fa-bolt',
                    email: 'support@bluedart.com',
                    phone: '18602331234',
                    certificate: ''
                },
                {
                    name: 'Delhivery',
                    password: 'delhivery@greenie',
                    fee: 45,
                    states: ['Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Bihar', 'Jharkhand'],
                    icon: 'fa-paper-plane',
                    email: 'customer.support@delhivery.com',
                    phone: '1246719500',
                    certificate: ''
                },
                {
                    name: 'DTDC',
                    password: 'dtdc@greenie',
                    fee: 50,
                    states: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'West Bengal', 'Odisha', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Puducherry', 'Andaman and Nicobar Islands', 'Lakshadweep'],
                    icon: 'fa-truck',
                    email: 'customersupport@dtdc.com',
                    phone: '7305081234',
                    certificate: ''
                }
            ];
            await Courier.insertMany(defaultCouriers);
            console.log('[SEED] Default couriers seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding couriers:', err.message);
    }
};

const seedReviews = async () => {
    try {
        const count = await Review.countDocuments();
        if (count === 0) {
            const defaultReviews = [
                {
                    userName: 'Anjali Sharma',
                    rating: 5,
                    description: 'The Peace Lily I ordered arrived in perfect condition. The packaging was amazing and the plant is thriving!',
                    date: '12 Mar 2026'
                },
                {
                    userName: 'Rahul Verma',
                    rating: 5,
                    description: 'Best online plant store. The AI assistant helped me save my dying Snake Plant. Highly recommended!',
                    date: '10 Mar 2026'
                },
                {
                    userName: 'Priya Patel',
                    rating: 4,
                    description: 'Very happy with the delivery speed. The pots are high quality. Just wish there were more succulent options.',
                    date: '08 Mar 2026'
                },
                {
                    userName: 'Vikram Singh',
                    rating: 5,
                    description: 'The organic fertilizer is really working wonders for my balcony garden. Great experience!',
                    date: '05 Mar 2026'
                },
                {
                    userName: 'Sneha Gupta',
                    rating: 5,
                    description: 'Greenie Culture has transformed my living room. The glassmorphic UI of the app is also very premium!',
                    date: '01 Mar 2026'
                }
            ];
            await Review.insertMany(defaultReviews);
            console.log('[SEED] Default reviews seeded successfully');
        }
    } catch (err) {
        console.error('[SEED] Error seeding reviews:', err.message);
    }
};

const seedPlantReminders = async () => {
    try {
        const count = await PlantReminder.countDocuments();
        if (count === 0) {
            const users = await User.find({ role: 'user' }).limit(1);
            if (users.length > 0) {
                const sampleReminders = [
                    {
                        userId: users[0]._id,
                        plantName: 'Snake Plant',
                        problemType: 'Yellow Leaves',
                        reminderType: 'water',
                        reminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
                        notificationStatus: 'pending'
                    },
                    {
                        userId: users[0]._id,
                        plantName: 'Aloe Vera',
                        problemType: 'Root Rot',
                        reminderType: 'sunlight',
                        reminderDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
                        notificationStatus: 'pending'
                    }
                ];
                await PlantReminder.insertMany(sampleReminders);
                console.log('[SEED] Default plant reminders seeded successfully');
            }
        }
    } catch (err) {
        console.error('[SEED] Error seeding plant reminders:', err.message);
    }
};

module.exports = { seedPlacements, seedFaqs, seedCouriers, seedReviews, seedPlantReminders };
