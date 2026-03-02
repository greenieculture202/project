import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';

@Component({
    selector: 'app-garden-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './garden-offer.html',
    styleUrls: ['./garden-offer.css']
})
export class GardenOfferComponent implements OnInit {
    private productService = inject(ProductService);
    private offerService = inject(OfferService);

    gardenTools: Product[] = [
        { name: 'Professional Tool Kit', price: '1299', originalPrice: '2199', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', category: 'Gardening Tools' },
        { name: 'Bonsai Tool Set', price: '899', originalPrice: '1499', image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', category: 'Gardening Tools' },
        { name: 'Pruning Essentials', price: '599', originalPrice: '999', image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80', category: 'Gardening Tools' },
        { name: 'Master Gardener Set', price: '2499', originalPrice: '4199', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80', category: 'Gardening Tools' }
    ];

    offers: Offer[] = [
        {
            badge: '🌿 EXCLUSIVE DEAL', title: 'BOGO OFFER', subtitle: 'Buy 2 XL Plants',
            discountLine: '& GET 1 MEDIUM PLANT FREE', image: '/images/bogo_offer_v2.jpg',
            cardBg: '#f0fdf4', accentColor: '#16a34a', accentLight: '#dcfce7', accentText: '#14532d',
            tag: 'BOGO', tagBg: '#fbbf24', tagText: '#78350f', ctaLink: '/bogo-offer'
        },
        {
            badge: '🌸 FLOWERING BONANZA', title: 'FLOWERING BONANZA', subtitle: 'Premium Flower Seeds @ 70% OFF',
            discountLine: '+ FREE ORGANIC FERTILIZER PACK', image: '/images/flowering_bonanza_offer.jpg',
            cardBg: '#fdf2f8', accentColor: '#db2777', accentLight: '#fce7f3', accentText: '#831843',
            tag: '70% OFF', tagBg: '#f472b6', tagText: '#fff', ctaLink: '/flowering-offer'
        }
    ];

    ngOnInit() {
        // Fetch products that have the unique G-GARDEN-6-SEC tag/category
        this.productService.getProducts('G-GARDEN-6-SEC', 6).subscribe(products => {
            if (products && products.length > 0) {
                this.gardenTools = products;
                if (products.length < 6) {
                    this.productService.getProducts('Gardening Tools', 6 - products.length).subscribe(extra => {
                        this.gardenTools = [...this.gardenTools, ...extra];
                    });
                }
            } else {
                // Fallback to general category
                this.productService.getProducts('Gardening Tools', 6).subscribe(p => {
                    if (p && p.length > 0) this.gardenTools = p;
                });
            }
        });

        this.offerService.getOffers().subscribe(offers => {
            if (offers && offers.length > 0) {
                this.offers = offers.filter(o => o.ctaLink !== '/garden-offer').slice(0, 2);
            }
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
