import { __decorate } from "tslib";
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { inject } from '@angular/core';
let OffersPageComponent = class OffersPageComponent {
    constructor() {
        this.offerService = inject(OfferService);
        this.cdr = inject(ChangeDetectorRef);
        this.ngZone = inject(NgZone);
        this.offers = [
            {
                badge: '🌿 EXCLUSIVE DEAL', title: 'BOGO OFFER', subtitle: 'Buy 2 XL Plants',
                discountLine: '& GET 1 MEDIUM PLANT FREE',
                description: 'Upgrade your home jungle with our majestic XL plant collection. Buy any 2 and we\'ll gift you a premium Greenie Medium Plant — absolutely free!',
                features: ['Any 2 XL Plants qualify', 'Free plant worth ₹499+', 'Auto added to cart', 'Limited time offer'],
                ctaText: 'GRAB THIS DEAL', ctaLink: '/bogo-offer', image: '/images/bogo_offer_v2.jpg',
                cardBg: '#f0fdf4', accentColor: '#16a34a', accentLight: '#dcfce7', accentText: '#14532d',
                tag: 'BOGO', tagBg: '#fbbf24', tagText: '#78350f', timer: 'Ends Soon!', timerBg: '#dcfce7'
            },
            {
                badge: '🏺 INDOOR SPECIAL', title: 'INDOOR JUNGLE', subtitle: 'Buy Any 2 Indoor Plants',
                discountLine: '& GET A DESIGNER CERAMIC POT FREE',
                description: 'Transform your living space into a lush indoor sanctuary.',
                features: ['Choose from 4 pot colors', 'Pot worth ₹399 FREE', 'Air purifying plants', 'Beginner friendly'],
                ctaText: 'CHOOSE YOUR PLANTS', ctaLink: '/indoor-offer', image: '/images/indoor_jungle_offer.jpg',
                cardBg: '#f5f3ff', accentColor: '#7c3aed', accentLight: '#ede9fe', accentText: '#4c1d95',
                tag: 'FREE POT', tagBg: '#a78bfa', tagText: '#fff', timer: 'Hot Deal!', timerBg: '#ede9fe'
            },
            {
                badge: '🛠️ PRO TOOLKIT SALE', title: 'GARDEN ESSENTIALS', subtitle: 'Professional Garden Toolkits',
                discountLine: 'FLAT 40% OFF — ALL KITS',
                description: 'Get our curated professional-grade toolkits at a massive 40% discount!',
                features: ['Professional grade steel', 'Ergonomic handles', 'Complete starter to pro kits', 'Free carrying case'],
                ctaText: 'SHOP TOOLKITS NOW', ctaLink: '/garden-offer', image: '/images/garden_essentials_offer.jpg',
                cardBg: '#fffbeb', accentColor: '#d97706', accentLight: '#fef3c7', accentText: '#78350f',
                tag: '40% OFF', tagBg: '#f97316', tagText: '#fff', timer: 'Best Seller!', timerBg: '#fef3c7'
            },
            {
                badge: '🌸 FLOWERING BONANZA', title: 'FLOWERING BONANZA', subtitle: 'Premium Flower Seeds @ 70% OFF',
                discountLine: '+ FREE ORGANIC FERTILIZER PACK',
                description: 'Our premium flower seeds at 70% off — plus a 100g Organic Nutri-Boost fertilizer free!',
                features: ['95% germination rate', 'Non-GMO & organic', '100g fertilizer FREE (₹99 value)', '15+ vibrant varieties'],
                ctaText: 'START PLANTING', ctaLink: '/flowering-offer', image: '/images/flowering_bonanza_offer.jpg',
                cardBg: '#fdf2f8', accentColor: '#db2777', accentLight: '#fce7f3', accentText: '#831843',
                tag: '70% OFF', tagBg: '#f472b6', tagText: '#fff', timer: 'Limited Stock!', timerBg: '#fce7f3'
            }
        ];
        this.isLoading = false;
        // Fallback if API is unreachable
        this.fallbackOffers = []; // (Already moved to initial state)
    }
    ngOnInit() {
        this.offerService.getOffers().subscribe({
            next: (data) => {
                this.ngZone.run(() => {
                    if (data && data.length > 0) {
                        this.offers = data;
                    }
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error fetching offers:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
};
OffersPageComponent = __decorate([
    Component({
        selector: 'app-offers-page',
        standalone: true,
        imports: [CommonModule, RouterModule],
        templateUrl: './offers-page.html',
        styleUrls: ['./offers-page.css']
    })
], OffersPageComponent);
export { OffersPageComponent };
//# sourceMappingURL=offers-page.js.map