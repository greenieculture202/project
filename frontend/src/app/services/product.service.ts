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
        'Vegetable Seeds': [
            {
                name: 'Spinach (Palak) Seeds',
                price: '49',
                originalPrice: '149',
                discount: '67% OFF',
                discountPercent: 67,
                image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Easy to Grow', 'Nutritious', 'Quick Harvest']
            },
            {
                name: 'Tomato Hybrid Seeds',
                price: '79',
                originalPrice: '249',
                discount: '68% OFF',
                discountPercent: 68,
                image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['High Yield', 'Disease Resistant', 'Juicy']
            },
            {
                name: 'Chilli (Mirch) Seeds',
                price: '59',
                originalPrice: '199',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Spicy', 'Organic', 'High Yield']
            },
            {
                name: 'Coriander (Dhaniya) Seeds',
                price: '39',
                originalPrice: '129',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Aromatic', 'Fast Growing', 'Kitchen Essential']
            },
            {
                name: 'Carrot Seeds',
                price: '69',
                originalPrice: '229',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Sweet', 'Crunchy', 'Vitamin Rich']
            },
            {
                name: 'Radish (Mooli) Seeds',
                price: '45',
                originalPrice: '149',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1616684000065-a2b7eda0c0b6?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Quick Harvest', 'Crisp', 'Easy Care']
            },
            {
                name: 'Cucumber Seeds',
                price: '55',
                originalPrice: '179',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Refreshing', 'Summer Crop', 'Hydrating']
            },
            {
                name: 'Brinjal (Baingan) Seeds',
                price: '65',
                originalPrice: '219',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Purple Beauty', 'Versatile', 'High Yield']
            },
            {
                name: 'Capsicum (Shimla Mirch) Seeds',
                price: '89',
                originalPrice: '299',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Colorful', 'Sweet', 'Vitamin C']
            },
            {
                name: 'Okra (Bhindi) Seeds',
                price: '49',
                originalPrice: '159',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Tender', 'Nutritious', 'Summer Favorite']
            },
            {
                name: 'Pumpkin Seeds',
                price: '75',
                originalPrice: '249',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1569976710208-b52636b52c09?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Large Fruit', 'Healthy', 'Versatile']
            },
            {
                name: 'Bottle Gourd (Lauki) Seeds',
                price: '55',
                originalPrice: '179',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&w=800&q=80',
                category: 'Vegetable Seeds',
                tags: ['Healthy', 'Cooling', 'Easy to Grow']
            }
        ],
        'Fruit Seeds': [
            {
                name: 'Mango (Aam) Seeds',
                price: '99',
                originalPrice: '349',
                discount: '71% OFF',
                discountPercent: 71,
                image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['King of Fruits', 'Sweet', 'Tropical']
            },
            {
                name: 'Papaya Seeds',
                price: '69',
                originalPrice: '229',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Digestive', 'Fast Growing', 'Nutritious']
            },
            {
                name: 'Guava (Amrood) Seeds',
                price: '79',
                originalPrice: '259',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Vitamin C', 'Aromatic', 'Easy Care']
            },
            {
                name: 'Watermelon Seeds',
                price: '89',
                originalPrice: '299',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784720?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Summer Delight', 'Juicy', 'Refreshing']
            },
            {
                name: 'Pomegranate (Anaar) Seeds',
                price: '119',
                originalPrice: '399',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Antioxidant', 'Ruby Red', 'Healthy']
            },
            {
                name: 'Lemon (Nimbu) Seeds',
                price: '59',
                originalPrice: '199',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Citrus', 'Vitamin C', 'Refreshing']
            },
            {
                name: 'Strawberry Seeds',
                price: '129',
                originalPrice: '449',
                discount: '71% OFF',
                discountPercent: 71,
                image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Sweet', 'Delicate', 'Garden Favorite']
            },
            {
                name: 'Banana Plant Seeds',
                price: '99',
                originalPrice: '329',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Tropical', 'Energy Rich', 'Fast Growing']
            },
            {
                name: 'Grapes Seeds',
                price: '149',
                originalPrice: '499',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1599819177331-6d0b2238e2f6?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Vine', 'Sweet', 'Antioxidant']
            },
            {
                name: 'Orange Seeds',
                price: '79',
                originalPrice: '259',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
                category: 'Fruit Seeds',
                tags: ['Citrus', 'Juicy', 'Vitamin Boost']
            }
        ],
        'Herb Seeds': [
            {
                name: 'Basil (Tulsi) Seeds',
                price: '45',
                originalPrice: '149',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Sacred', 'Aromatic', 'Medicinal']
            },
            {
                name: 'Mint (Pudina) Seeds',
                price: '39',
                originalPrice: '129',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Refreshing', 'Fast Growing', 'Culinary']
            },
            {
                name: 'Fenugreek (Methi) Seeds',
                price: '35',
                originalPrice: '119',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Nutritious', 'Medicinal', 'Kitchen Herb']
            },
            {
                name: 'Parsley Seeds',
                price: '49',
                originalPrice: '159',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1616684000065-a2b7eda0c0b6?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Garnish', 'Vitamin Rich', 'Fresh Flavor']
            },
            {
                name: 'Oregano Seeds',
                price: '55',
                originalPrice: '179',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Italian Herb', 'Aromatic', 'Pizza Essential']
            },
            {
                name: 'Thyme Seeds',
                price: '59',
                originalPrice: '199',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Fragrant', 'Medicinal', 'Culinary']
            },
            {
                name: 'Rosemary Seeds',
                price: '69',
                originalPrice: '229',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Woody', 'Aromatic', 'Memory Booster']
            },
            {
                name: 'Sage Seeds',
                price: '65',
                originalPrice: '219',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Medicinal', 'Savory', 'Garden Herb']
            },
            {
                name: 'Dill Seeds',
                price: '45',
                originalPrice: '149',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Feathery', 'Aromatic', 'Pickle Spice']
            },
            {
                name: 'Chives Seeds',
                price: '49',
                originalPrice: '159',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?auto=format&fit=crop&w=800&q=80',
                category: 'Herb Seeds',
                tags: ['Mild Onion', 'Garnish', 'Easy to Grow']
            }
        ],
        'Microgreen Seeds': [
            {
                name: 'Mustard (Sarson) Microgreens',
                price: '59',
                originalPrice: '199',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Spicy', 'Nutrient Dense', 'Quick Harvest']
            },
            {
                name: 'Radish Microgreens',
                price: '55',
                originalPrice: '179',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Peppery', 'Crunchy', '7-Day Harvest']
            },
            {
                name: 'Broccoli Microgreens',
                price: '79',
                originalPrice: '259',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Superfood', 'Antioxidant', 'Healthy']
            },
            {
                name: 'Sunflower Microgreens',
                price: '69',
                originalPrice: '229',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Nutty', 'Crunchy', 'Protein Rich']
            },
            {
                name: 'Pea Shoots Microgreens',
                price: '65',
                originalPrice: '219',
                discount: '70% OFF',
                discountPercent: 70,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Sweet', 'Tender', 'Vitamin Rich']
            },
            {
                name: 'Amaranth Microgreens',
                price: '75',
                originalPrice: '249',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Colorful', 'Nutritious', 'Unique']
            },
            {
                name: 'Kale Microgreens',
                price: '85',
                originalPrice: '279',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Superfood', 'Mineral Rich', 'Healthy']
            },
            {
                name: 'Beetroot Microgreens',
                price: '69',
                originalPrice: '229',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Colorful', 'Sweet', 'Iron Rich']
            },
            {
                name: 'Cress Microgreens',
                price: '49',
                originalPrice: '159',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Peppery', 'Fast Growing', 'Salad Topper']
            },
            {
                name: 'Wheatgrass Seeds',
                price: '55',
                originalPrice: '179',
                discount: '69% OFF',
                discountPercent: 69,
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=800&q=80',
                category: 'Microgreen Seeds',
                tags: ['Detox', 'Juice', 'Superfood']
            }
        ],
        'Seeds Kit': [
            {
                name: 'Kitchen Garden Starter Kit',
                price: '499',
                originalPrice: '999',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Beginner Friendly', '10 Varieties', 'Complete Set']
            },
            {
                name: 'Herb Garden Collection',
                price: '399',
                originalPrice: '799',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['8 Herbs', 'Aromatic', 'Culinary']
            },
            {
                name: 'Microgreens Starter Pack',
                price: '599',
                originalPrice: '1199',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Superfood', '12 Varieties', 'Quick Harvest']
            },
            {
                name: 'Flower Garden Mix',
                price: '449',
                originalPrice: '899',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Colorful', '15 Flowers', 'Pollinator Friendly']
            },
            {
                name: 'Vegetable Garden Bundle',
                price: '699',
                originalPrice: '1399',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['20 Varieties', 'Organic', 'High Yield']
            },
            {
                name: 'Balcony Garden Kit',
                price: '549',
                originalPrice: '1099',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Space Saving', 'Container Friendly', '12 Seeds']
            },
            {
                name: 'Kids Gardening Kit',
                price: '349',
                originalPrice: '699',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Educational', 'Easy to Grow', 'Fun']
            },
            {
                name: 'Organic Farming Kit',
                price: '899',
                originalPrice: '1799',
                discount: '50% OFF',
                discountPercent: 50,
                image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
                category: 'Seeds Kit',
                tags: ['Certified Organic', '25 Varieties', 'Premium']
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
