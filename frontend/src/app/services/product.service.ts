import { Injectable } from '@angular/core';

export interface Product {
    image: string;
    hoverImage?: string; // New property for hover effect
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
    discountPercent?: number;
    category?: string; // Added category property
    videoUrl?: string; // Optional video URL (YouTube, Vimeo, or MP4)
    tags?: string[]; // Plant feature tags like "Easy Care", "Vastu Friendly", etc.
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // 20 Mock Products for each category
    private allProducts: { [key: string]: Product[] } = {
        'Bestsellers': [
            {
                name: 'Majestic Zen Garden',
                price: '1999',
                originalPrice: '2499',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://tse2.mm.bing.net/th/id/OIP.X3jDS9J58Q4ilo4vgjh-RAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3',
                hoverImage: 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg',
                category: 'Bestsellers',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Mock video for demo
                tags: ['Easy Care', 'Modern Decor', 'Perfect Gift']
            },
            {
                name: 'Jade Luck Charm',
                price: '449',
                originalPrice: '499',
                discount: '10% OFF',
                discountPercent: 10,
                image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift']
            },
            {
                name: 'Peace Lily Purification',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Snake Plant Sansevieria',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Air Purifying', 'Easy Care', 'Pet Friendly']
            },
            {
                name: 'Money Plant Golden',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Areca Palm',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Air Purifying', 'Modern Decor', 'Easy Care']
            },
            {
                name: 'Rubber Plant Burgundy',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Air Purifying', 'Modern Decor', 'Easy Care']
            },
            {
                name: 'ZZ Plant Zamia',
                price: '349',
                originalPrice: '549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Easy Care', 'Air Purifying', 'Pet Friendly']
            },
            {
                name: 'Fiddle Leaf Fig',
                price: '899',
                originalPrice: '1299',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1601985705806-8b998a3458ae?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Modern Decor', 'Air Purifying', 'Perfect Gift']
            },
            {
                name: 'Bamboo Palm',
                price: '649',
                originalPrice: '849',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
        ],
        'New Arrivals': [
            {
                name: 'Monstera Deliciosa',
                price: '799',
                originalPrice: '999',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Modern Decor', 'Air Purifying', 'Easy Care']
            },
            {
                name: 'String of Pearls',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Calathea Roseopicta',
                price: '549',
                originalPrice: '749',
                discount: '26% OFF',
                discountPercent: 26,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Modern Decor', 'Air Purifying', 'Pet Friendly']
            },
            {
                name: 'Aglaonema Red',
                price: '449',
                originalPrice: '649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Philodendron Birkin',
                price: '999',
                originalPrice: '1299',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Modern Decor', 'Air Purifying', 'Perfect Gift']
            },
            {
                name: 'Begonia Maculata',
                price: '699',
                originalPrice: '899',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Modern Decor', 'Easy Care', 'Perfect Gift']
            },
            {
                name: 'Syngonium Pink',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Easy Care', 'Air Purifying', 'Modern Decor']
            },
            {
                name: 'Neon Pothos',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Hoya Kerrii Heart',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Perfect Gift', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Orchid Mini',
                price: '899',
                originalPrice: '1199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals',
                tags: ['Perfect Gift', 'Modern Decor', 'Easy Care']
            },
            // Repeat
            { name: 'Monstera Deliciosa II', price: '799', originalPrice: '999', discount: '20% OFF', discountPercent: 20, image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Modern Decor', 'Air Purifying', 'Easy Care'] },
            { name: 'String of Pearls II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Easy Care', 'Perfect Gift', 'Modern Decor'] },
            { name: 'Calathea Roseopicta II', price: '549', originalPrice: '749', discount: '26% OFF', discountPercent: 26, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Modern Decor', 'Air Purifying', 'Pet Friendly'] },
            { name: 'Aglaonema Red II', price: '449', originalPrice: '649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Philodendron Birkin II', price: '999', originalPrice: '1299', discount: '23% OFF', discountPercent: 23, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Modern Decor', 'Air Purifying', 'Perfect Gift'] },
            { name: 'Begonia Maculata II', price: '699', originalPrice: '899', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Modern Decor', 'Easy Care', 'Perfect Gift'] },
            { name: 'Syngonium Pink II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Easy Care', 'Air Purifying', 'Modern Decor'] },
            { name: 'Neon Pothos II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying'] },
            { name: 'Hoya Kerrii Heart II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Perfect Gift', 'Easy Care', 'Modern Decor'] },
            { name: 'Orchid Mini II', price: '899', originalPrice: '1199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals', tags: ['Perfect Gift', 'Modern Decor', 'Easy Care'] }
        ],
        'Indoor Plants': [
            {
                name: 'Spider Plant',
                price: '149',
                originalPrice: '249',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Air Purifying', 'Pet Friendly']
            },
            {
                name: 'Money Plant',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Air Purifying', 'Modern Decor']
            },
            {
                name: 'Boston Fern',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Snake Plant',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Aloe Vera',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Air Purifying', 'Perfect Gift']
            },
            {
                name: 'Jade Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift']
            },
            {
                name: 'Rubber Plant',
                price: '599',
                originalPrice: '799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Air Purifying', 'Modern Decor', 'Easy Care']
            },
            {
                name: 'ZZ Plant',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Air Purifying', 'Modern Decor']
            },
            {
                name: 'Areca Palm',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Lucky Bamboo',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift']
            },
            // Repeat
            { name: 'Peace Lily', price: '149', originalPrice: '249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Easy Care', 'Air Purifying', 'Pet Friendly'] },
            { name: 'Chinese Evergreen', price: '299', originalPrice: '399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Easy Care', 'Air Purifying', 'Modern Decor'] },
            { name: 'Dracaena', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Anthurium', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Calathea', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Easy Care', 'Air Purifying', 'Perfect Gift'] },
            { name: 'Philodendron', price: '349', originalPrice: '449', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift'] },
            { name: 'Croton', price: '599', originalPrice: '799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Air Purifying', 'Modern Decor', 'Easy Care'] },
            { name: 'Fiddle Leaf Fig', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Easy Care', 'Air Purifying', 'Modern Decor'] },
            { name: 'English Ivy', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Orchid', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] }
        ],
        'Outdoor Plants': [
            {
                name: 'Ashoka Tree',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Modern Decor', 'Perfect Gift']
            },
            {
                name: 'Neem Tree',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Mango Tree',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            },
            {
                name: 'Guava Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Perfect Gift', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Coconut Tree',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift']
            },
            {
                name: 'Banyan Tree',
                price: '99',
                originalPrice: '149',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Peepal Tree',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            },
            {
                name: 'Palm Tree',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Vastu Friendly', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Bamboo Plant',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Tulsi Plant',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            },
            {
                name: 'Curry Leaf Plant',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Modern Decor', 'Perfect Gift']
            },
            {
                name: 'Lemon Plant',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Papaya Plant',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            },
            {
                name: 'Banana Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Perfect Gift', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Aloe Vera',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Perfect Gift']
            },
            {
                name: 'Snake Plant',
                price: '99',
                originalPrice: '149',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Hibiscus',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            },
            {
                name: 'Bougainvillea',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Vastu Friendly', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Areca Palm',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Vastu Friendly', 'Air Purifying']
            },
            {
                name: 'Croton',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Vastu Friendly']
            }
        ],
        'Flowering Plants': [
            {
                name: 'Peace Lily',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Air Purifying', 'Perfect Gift']
            },
            {
                name: 'Anthurium',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Modern Decor', 'Perfect Gift']
            },
            {
                name: 'Orchid',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Kalanchoe',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Begonia',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Geranium',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'African Violet',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Air Purifying']
            },
            {
                name: 'Jasmine (Indoor Variety)',
                price: '299',
                originalPrice: '449',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Bromeliad',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Amaryllis',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Christmas Cactus',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Air Purifying']
            },
            {
                name: 'Crown of Thorns',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Clivia',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Gloxinia',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Flamingo Flower',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Cyclamen',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Impatiens',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Air Purifying']
            },
            {
                name: 'Lipstick Plant',
                price: '299',
                originalPrice: '449',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Hoya',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Modern Decor']
            },
            {
                name: 'Anthurium Lily',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants',
                tags: ['Easy Care', 'Perfect Gift', 'Air Purifying']
            }
        ],
        'Air Purifying': [
            {
                name: 'Snake Plant',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Pet Friendly']
            },
            {
                name: 'Areca Palm',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Spider Plant',
                price: '149',
                originalPrice: '249',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Pet Friendly']
            },
            {
                name: 'Peace Lily',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Rubber Plant',
                price: '599',
                originalPrice: '799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'Aloe Vera',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Perfect Gift']
            },
            {
                name: 'English Ivy',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Pet Friendly']
            },
            {
                name: 'Boston Fern',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            {
                name: 'ZZ Plant',
                price: '349',
                originalPrice: '549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Pet Friendly']
            },
            {
                name: 'Philodendron',
                price: '449',
                originalPrice: '649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying',
                tags: ['Air Purifying', 'Easy Care', 'Modern Decor']
            },
            // Repeat
            { name: 'Snake Plant II', price: '299', originalPrice: '499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Pet Friendly'] },
            { name: 'Areca Palm II', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Spider Plant II', price: '149', originalPrice: '249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Pet Friendly'] },
            { name: 'Peace Lily II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Rubber Plant II', price: '599', originalPrice: '799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'Aloe Vera II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Perfect Gift'] },
            { name: 'English Ivy II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Pet Friendly'] },
            { name: 'Boston Fern II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] },
            { name: 'ZZ Plant II', price: '349', originalPrice: '549', discount: '36% OFF', discountPercent: 36, image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Pet Friendly'] },
            { name: 'Philodendron II', price: '449', originalPrice: '649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying', tags: ['Air Purifying', 'Easy Care', 'Modern Decor'] }
        ],
        'Gardening': [
            {
                name: 'Rose (Gulab)',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Outdoor Blooms', 'Fragrant', 'Full Sun']
            },
            {
                name: 'Marigold (Genda)',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1541604193435-22b40742194b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Outdoor Blooms', 'Pest Repellent', 'Sun Lover']
            },
            {
                name: 'Jasmine (Mogra)',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Outdoor Blooms', 'Aromatic', 'Fragrant']
            },
            {
                name: 'Petunia',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Outdoor Blooms', 'Colorful', 'Sun Lover']
            },
            {
                name: 'Sunflower',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Outdoor Blooms', 'Bright', 'Full Sun']
            },
            {
                name: 'Tulsi (Holy Basil)',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1628172901309-9fc480b067a5?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Home Garden Essentials', 'Air Purifying', 'Vastu Friendly']
            },
            {
                name: 'Curry Leaves (Kadi Patta)',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Home Garden Essentials', 'Culinary Use', 'Nutritious']
            },
            {
                name: 'Aloe Vera',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Home Garden Essentials', 'Medicinal', 'Low Maintenance']
            },
            {
                name: 'Lemon Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1591122137683-1262d1487d7b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Home Garden Essentials', 'Fruit Bearing']
            },
            {
                name: 'Mint (Pudina)',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1533413977504-2070387532ac?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Home Garden Essentials', 'Aromatic']
            },
            {
                name: 'Areca Palm',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Foliage & Greens', 'Modern Decor']
            },
            {
                name: 'Ferns',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Foliage & Greens', 'Moist Soil']
            },
            {
                name: 'Bamboo Palm',
                price: '649',
                originalPrice: '849',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Foliage & Greens', 'Air Purifying']
            },
            {
                name: 'Croton',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1584281729110-3882f7f98e6c?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Foliage & Greens', 'Colorful']
            },
            {
                name: 'Cypress',
                price: '999',
                originalPrice: '1299',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Foliage & Greens', 'Ornamental Tree']
            },
            {
                name: 'Bougainvillea',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1512431707018-8739199d75b3?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Decorative Style', 'Vibrant Flowers']
            },
            {
                name: 'Hibiscus (Gudhal)',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Decorative Style', 'Big Blooms']
            },
            {
                name: 'Coleus',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1584281729110-3882f7f98e6c?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Decorative Style', 'Patterned Leaves']
            },
            {
                name: 'Golden Pothos',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Decorative Style', 'Climber']
            },
            {
                name: 'Song of India',
                price: '449',
                originalPrice: '649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                category: 'Gardening',
                tags: ['Decorative Style', 'Ornamental']
            }
        ],
        'XL Plants': [
            {
                name: 'Fiddle Leaf Fig XL',
                price: '2499',
                originalPrice: '3299',
                discount: '24% OFF',
                discountPercent: 24,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Interior Decor', 'Premium']
            },
            {
                name: 'Monstera Deliciosa XL',
                price: '1899',
                originalPrice: '2499',
                discount: '24% OFF',
                discountPercent: 24,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Lush Green', 'Trending']
            },
            {
                name: 'Areca Palm XL',
                price: '1499',
                originalPrice: '1999',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Air Purifying', 'Statuesque']
            },
            {
                name: 'Rubber Plant Burgundy XL',
                price: '1699',
                originalPrice: '2299',
                discount: '26% OFF',
                discountPercent: 26,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Easy Care', 'Dark Foliage']
            },
            {
                name: 'Bonsai Ficus XL',
                price: '3499',
                originalPrice: '4499',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Masterpiece', 'Artistic']
            },
            {
                name: 'Peace Lily XL',
                price: '1299',
                originalPrice: '1799',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'assets/images/bogo-combo.png',
                category: 'XL Plants',
                tags: ['XL Size', 'Air Purifying', 'White Flowers']
            }
        ],
        'Garden Toolkits': [
            {
                name: 'Pro Gardener Starter Kit',
                price: '1499',
                originalPrice: '2499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1592150621344-82ea42866657?auto=format&fit=crop&w=800&q=80',
                category: 'Garden Toolkits',
                tags: ['Beginner Friendly', 'Essential Tools', 'Best Value']
            },
            {
                name: 'Master Gardeners Belt Set',
                price: '1899',
                originalPrice: '2999',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=800&q=80',
                category: 'Garden Toolkits',
                tags: ['Professional', 'Heavy Duty', 'Complete Set']
            },
            {
                name: 'Bonsai Care Specialist Kit',
                price: '2499',
                originalPrice: '3999',
                discount: '38% OFF',
                discountPercent: 38,
                image: 'https://images.unsplash.com/photo-1512428813833-ed1107380905?auto=format&fit=crop&w=800&q=80',
                category: 'Garden Toolkits',
                tags: ['Bonsai Tools', 'Precision', 'Gift Idea']
            },
            {
                name: 'Kids Discovery Garden Kit',
                price: '999',
                originalPrice: '1499',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1592819076136-11f8450f3810?auto=format&fit=crop&w=800&q=80',
                category: 'Garden Toolkits',
                tags: ['Kids Safe', 'Educational', 'Fun']
            }
        ],
        'Flower Seeds': [
            {
                name: 'Zinnia Elegans Seeds',
                price: '99',
                originalPrice: '349',
                discount: '71% OFF',
                discountPercent: 71,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Easy to Grow', 'Vibrant', 'Summer Bloom']
            },
            {
                name: 'Marigold French Seeds',
                price: '89',
                originalPrice: '299',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1541604193435-22b40742194b?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Low Maintenance', 'Pest Repellent', 'Sun Lover']
            },
            {
                name: 'Cosmos Mixed Seeds',
                price: '79',
                originalPrice: '299',
                discount: '73% OFF',
                discountPercent: 73,
                image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Wildflower Style', 'Graceful', 'Pollinator Friendly']
            },
            {
                name: 'Sunflower Dwarf Seeds',
                price: '119',
                originalPrice: '399',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Cheery', 'Full Sun', 'Great for Kids']
            },
            {
                name: 'Petunia Hybrid Seeds',
                price: '129',
                originalPrice: '449',
                discount: '71% OFF',
                discountPercent: 71,
                image: 'https://images.unsplash.com/photo-1592819076136-11f8450f3810?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Hanging Basket', 'Fragrant', 'Continuous Bloom']
            },
            {
                name: 'Morning Glory Seeds',
                price: '69',
                originalPrice: '249',
                discount: '72% OFF',
                discountPercent: 72,
                image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
                category: 'Flower Seeds',
                tags: ['Climber', 'Rapid Growth', 'Morning Bloom']
            }
        ],
    };

    constructor() { }

    getProducts(category: string): Product[] {
        return this.allProducts[category] || [];
    }

    getAllProductsMap() {
        return this.allProducts;
    }

    getProductBySlug(slug: string): Product | undefined {
        const allCategories = Object.values(this.allProducts);
        for (const categoryProducts of allCategories) {
            const product = categoryProducts.find(p => this.createSlug(p.name) === slug);
            if (product) {
                // Ensure category is set if for some reason it's missing (though our hardcoded data has it)
                if (!product.category) {
                    // Reverse lookup category key
                    const catKey = Object.keys(this.allProducts).find(key => this.allProducts[key] === categoryProducts);
                    if (catKey) product.category = catKey;
                }
                return product;
            }
        }
        return undefined;
    }

    getRelatedProducts(category: string, currentSlug: string): Product[] {
        const categoryProducts = this.allProducts[category] || [];
        // Filter out current product and return top 4
        return categoryProducts
            .filter(p => this.createSlug(p.name) !== currentSlug)
            .slice(0, 4);
    }

    createSlug(name: string): string {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
}
