const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mejor';

const productsData = [
    // Bestsellers
    { name: 'Majestic Zen Garden', price: '₹1999', originalPrice: '₹2499', discount: '20% OFF', discountPercent: 20, image: 'https://tse2.mm.bing.net/th/id/OIP.X3jDS9J58Q4ilo4vgjh-RAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3', hoverImage: 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg', category: 'Bestsellers' },
    { name: 'Jade Luck Charm', price: '₹449', originalPrice: '₹499', discount: '10% OFF', discountPercent: 10, image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Bestsellers' },
    // ... adding more from each category
    { name: 'Peace Lily Purification', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Bestsellers' },
    { name: 'Snake Plant Sansevieria', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Bestsellers' },

    // New Arrivals
    { name: 'Monstera Deliciosa', price: '₹799', originalPrice: '₹999', discount: '20% OFF', discountPercent: 20, image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
    { name: 'String of Pearls', price: '₹399', originalPrice: '₹599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },

    // Indoor Plants
    { name: 'Spider Plant', price: '₹149', originalPrice: '₹249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
    { name: 'Satin Pothos', price: '₹299', originalPrice: '₹399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },

    // Outdoor Plants
    { name: 'Bougainvillea', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },

    // Money Plants
    { name: 'Golden Money Plant', price: '₹149', originalPrice: '₹199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },

    // Air Purifying
    { name: 'Snake Plant', price: '₹299', originalPrice: '₹499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' }
];

// Helper to expand the data to match the 20 products per category
const categories = ['Bestsellers', 'New Arrivals', 'Indoor Plants', 'Outdoor Plants', 'Money Plants', 'Air Purifying'];
const fullProductsData = [];

categories.forEach(cat => {
    const catProducts = productsData.filter(p => p.category === cat);
    // Fill up to 10 products per category for seeding (can be duplicated with "II" like in frontend)
    for (let i = 1; i <= 10; i++) {
        const baseProduct = catProducts[i % catProducts.length] || catProducts[0];
        fullProductsData.push({
            ...baseProduct,
            name: i === 1 ? baseProduct.name : `${baseProduct.name} ${i}`,
            category: cat
        });
    }
});

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');
        await Product.deleteMany({});
        await Product.insertMany(fullProductsData);
        console.log('Database seeded with products!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
