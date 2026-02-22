import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface OfferCard {
    id: number;
    badge: string;
    title: string;
    subtitle: string;
    discountLine: string;
    description: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    image: string;
    cardBg: string;        // card background color (light)
    accentColor: string;   // button + highlight color
    accentLight: string;   // light tint for pills/features
    accentText: string;    // text color on accent bg
    tag: string;
    tagBg: string;
    tagText: string;
    timer: string;
    timerBg: string;
}

@Component({
    selector: 'app-offers-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './offers-page.html',
    styleUrls: ['./offers-page.css']
})
export class OffersPageComponent {
    offers: OfferCard[] = [
        {
            id: 1,
            badge: '🌿 EXCLUSIVE DEAL',
            title: 'BOGO OFFER',
            subtitle: 'Buy 2 XL Plants',
            discountLine: '& GET 1 MEDIUM PLANT FREE',
            description: 'Upgrade your home jungle with our majestic XL plant collection. Buy any 2 and we\'ll gift you a premium Greenie Medium Plant — absolutely free!',
            features: ['Any 2 XL Plants qualify', 'Free plant worth ₹499+', 'Auto added to cart', 'Limited time offer'],
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
            id: 2,
            badge: '🏺 INDOOR SPECIAL',
            title: 'INDOOR JUNGLE',
            subtitle: 'Buy Any 2 Indoor Plants',
            discountLine: '& GET A DESIGNER CERAMIC POT FREE',
            description: 'Transform your living space into a lush indoor sanctuary. Select any 2 premium indoor plants and receive a beautiful hand-glazed ceramic pot as our gift to you!',
            features: ['Choose from 4 pot colors', 'Pot worth ₹399 FREE', 'Air purifying plants', 'Beginner friendly'],
            ctaText: 'CHOOSE YOUR PLANTS',
            ctaLink: '/indoor-offer',
            image: '/images/indoor_jungle_offer.jpg',
            cardBg: '#f5f3ff',
            accentColor: '#7c3aed',
            accentLight: '#ede9fe',
            accentText: '#4c1d95',
            tag: 'FREE POT',
            tagBg: '#a78bfa',
            tagText: '#fff',
            timer: 'Hot Deal!',
            timerBg: '#ede9fe'
        },
        {
            id: 3,
            badge: '🛠️ PRO TOOLKIT SALE',
            title: 'GARDEN ESSENTIALS',
            subtitle: 'Professional Garden Toolkits',
            discountLine: 'FLAT 40% OFF — ALL KITS',
            description: 'Stop buying individual tools that don\'t match. Get our curated professional-grade toolkits, perfectly assembled for every gardening need — now at a massive 40% discount!',
            features: ['Professional grade steel', 'Ergonomic handles', 'Complete starter to pro kits', 'Free carrying case'],
            ctaText: 'SHOP TOOLKITS NOW',
            ctaLink: '/garden-offer',
            image: '/images/garden_essentials_offer.jpg',
            cardBg: '#fffbeb',
            accentColor: '#d97706',
            accentLight: '#fef3c7',
            accentText: '#78350f',
            tag: '40% OFF',
            tagBg: '#f97316',
            tagText: '#fff',
            timer: 'Best Seller!',
            timerBg: '#fef3c7'
        },
        {
            id: 4,
            badge: '🌸 FLOWERING BONANZA',
            title: 'FLOWERING BONANZA',
            subtitle: 'Premium Flower Seeds @ 70% OFF',
            discountLine: '+ FREE ORGANIC FERTILIZER PACK',
            description: 'Grow a riot of colors in your garden! Our premium flower seeds are at an all-time low price of 70% off — plus we\'re adding a 100g Organic Nutri-Boost fertilizer to every order, free!',
            features: ['95% germination rate', 'Non-GMO & organic', '100g fertilizer FREE (₹99 value)', '15+ vibrant varieties'],
            ctaText: 'START PLANTING',
            ctaLink: '/flowering-offer',
            image: '/images/flowering_bonanza_offer.jpg',
            cardBg: '#fdf2f8',
            accentColor: '#db2777',
            accentLight: '#fce7f3',
            accentText: '#831843',
            tag: '70% OFF',
            tagBg: '#f472b6',
            tagText: '#fff',
            timer: 'Limited Stock!',
            timerBg: '#fce7f3'
        }
    ];
}
