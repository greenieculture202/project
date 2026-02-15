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
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Mock video for demo
            },
            {
                name: 'Jade Luck Charm',
                price: '449',
                originalPrice: '499',
                discount: '10% OFF',
                discountPercent: 10,
                image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Peace Lily Purification',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Snake Plant Sansevieria',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Money Plant Golden',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Areca Palm',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Rubber Plant Burgundy',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'ZZ Plant Zamia',
                price: '349',
                originalPrice: '549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Fiddle Leaf Fig',
                price: '899',
                originalPrice: '1299',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1601985705806-8b998a3458ae?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Bamboo Palm',
                price: '649',
                originalPrice: '849',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
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
                category: 'New Arrivals'
            },
            {
                name: 'String of Pearls',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Calathea Roseopicta',
                price: '549',
                originalPrice: '749',
                discount: '26% OFF',
                discountPercent: 26,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Aglaonema Red',
                price: '449',
                originalPrice: '649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Philodendron Birkin',
                price: '999',
                originalPrice: '1299',
                discount: '23% OFF',
                discountPercent: 23,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Begonia Maculata',
                price: '699',
                originalPrice: '899',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Syngonium Pink',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Neon Pothos',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Hoya Kerrii Heart',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            {
                name: 'Orchid Mini',
                price: '899',
                originalPrice: '1199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'New Arrivals'
            },
            // Repeat
            { name: 'Monstera Deliciosa II', price: '799', originalPrice: '999', discount: '20% OFF', discountPercent: 20, image: 'https://images.unsplash.com/photo-1617173945092-1c6622e5b651?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'String of Pearls II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Calathea Roseopicta II', price: '549', originalPrice: '749', discount: '26% OFF', discountPercent: 26, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Aglaonema Red II', price: '449', originalPrice: '649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Philodendron Birkin II', price: '999', originalPrice: '1299', discount: '23% OFF', discountPercent: 23, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Begonia Maculata II', price: '699', originalPrice: '899', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Syngonium Pink II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Neon Pothos II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Hoya Kerrii Heart II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' },
            { name: 'Orchid Mini II', price: '899', originalPrice: '1199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'New Arrivals' }
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
                category: 'Indoor Plants'
            },
            {
                name: 'Satin Pothos',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Boston Fern',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Dracaena Compacta',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Aloe Vera',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Jade Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Rubber Plant',
                price: '599',
                originalPrice: '799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Syngonium',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Areca Palm',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Dieffenbachia',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            // Repeat
            { name: 'Spider Plant II', price: '149', originalPrice: '249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Satin Pothos II', price: '299', originalPrice: '399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Boston Fern II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Dracaena Compacta II', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Aloe Vera II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Jade Plant II', price: '349', originalPrice: '449', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Rubber Plant II', price: '599', originalPrice: '799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Syngonium II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Areca Palm II', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
            { name: 'Dieffenbachia II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' }
        ],
        'Outdoor Plants': [
            {
                name: 'Bougainvillea',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Hibiscus',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Jasmine',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Rose Plant',
                price: '349',
                originalPrice: '449',
                discount: '22% OFF',
                discountPercent: 22,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Marigold',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Tulsi Holy Basil',
                price: '99',
                originalPrice: '149',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Curry Leaf Plant',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Ashoka Tree',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Neem Plant',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Mango Plant',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                discountPercent: 37,
                image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            // Repeat
            { name: 'Bougainvillea II', price: '299', originalPrice: '499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Hibiscus II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Jasmine II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Rose Plant II', price: '349', originalPrice: '449', discount: '22% OFF', discountPercent: 22, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Marigold II', price: '149', originalPrice: '199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Tulsi Holy Basil II', price: '99', originalPrice: '149', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Curry Leaf Plant II', price: '129', originalPrice: '199', discount: '35% OFF', discountPercent: 35, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Ashoka Tree II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Neem Plant II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' },
            { name: 'Mango Plant II', price: '499', originalPrice: '799', discount: '37% OFF', discountPercent: 37, image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Outdoor Plants' }
        ],
        'Money Plants': [
            {
                name: 'Golden Money Plant',
                price: '149',
                originalPrice: '199',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Marble Queen Pathos',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Money Plant Njoy',
                price: '299',
                originalPrice: '399',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Neon Money Plant',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Big Leaf Money Plant',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Money Plant Variegated',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Green Money Plant',
                price: '129',
                originalPrice: '199',
                discount: '35% OFF',
                discountPercent: 35,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Satin Money Plant',
                price: '299',
                originalPrice: '449',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Manjula Money Plant',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            {
                name: 'Cebu Blue Pothos',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Money Plants'
            },
            // Repeat
            { name: 'Golden Money Plant II', price: '149', originalPrice: '199', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Marble Queen Pathos II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Money Plant Njoy II', price: '299', originalPrice: '399', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Neon Money Plant II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Big Leaf Money Plant II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Money Plant Variegated II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Green Money Plant II', price: '129', originalPrice: '199', discount: '35% OFF', discountPercent: 35, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Satin Money Plant II', price: '299', originalPrice: '449', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Manjula Money Plant II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' },
            { name: 'Cebu Blue Pothos II', price: '599', originalPrice: '899', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Money Plants' }
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
                category: 'Air Purifying'
            },
            {
                name: 'Areca Palm',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Spider Plant',
                price: '149',
                originalPrice: '249',
                discount: '40% OFF',
                discountPercent: 40,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Peace Lily',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Rubber Plant',
                price: '599',
                originalPrice: '799',
                discount: '25% OFF',
                discountPercent: 25,
                image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Aloe Vera',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'English Ivy',
                price: '249',
                originalPrice: '349',
                discount: '28% OFF',
                discountPercent: 28,
                image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Boston Fern',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                discountPercent: 33,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'ZZ Plant',
                price: '349',
                originalPrice: '549',
                discount: '36% OFF',
                discountPercent: 36,
                image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            {
                name: 'Philodendron',
                price: '449',
                originalPrice: '649',
                discount: '30% OFF',
                discountPercent: 30,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
                category: 'Air Purifying'
            },
            // Repeat
            { name: 'Snake Plant II', price: '299', originalPrice: '499', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1599598425947-f3eb24cc3c8c?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Areca Palm II', price: '499', originalPrice: '699', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1612365319830-bd028886d34e?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Spider Plant II', price: '149', originalPrice: '249', discount: '40% OFF', discountPercent: 40, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Peace Lily II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1616690248297-25e2213d29c4?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Rubber Plant II', price: '599', originalPrice: '799', discount: '25% OFF', discountPercent: 25, image: 'https://images.unsplash.com/photo-1598880940371-c756e015ee16?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Aloe Vera II', price: '199', originalPrice: '299', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'English Ivy II', price: '249', originalPrice: '349', discount: '28% OFF', discountPercent: 28, image: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Boston Fern II', price: '399', originalPrice: '599', discount: '33% OFF', discountPercent: 33, image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1620127370217-062e7f3b5c65?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'ZZ Plant II', price: '349', originalPrice: '549', discount: '36% OFF', discountPercent: 36, image: 'https://images.unsplash.com/photo-1632207191677-8446985f9d65?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' },
            { name: 'Philodendron II', price: '449', originalPrice: '649', discount: '30% OFF', discountPercent: 30, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', hoverImage: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80', category: 'Air Purifying' }
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
