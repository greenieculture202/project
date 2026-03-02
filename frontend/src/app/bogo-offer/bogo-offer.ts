import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';

@Component({
    selector: 'app-bogo-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './bogo-offer.html',
    styleUrls: ['./bogo-offer.css']
})
export class BogoOfferComponent implements OnInit {
    private productService = inject(ProductService);
    private offerService = inject(OfferService);

    xlPlants: Product[] = [
        { name: 'Fiddle Leaf Fig XL', price: '2499', originalPrice: '3299', image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80', category: 'XL Plants' },
        { name: 'Rubber Plant XL', price: '1999', originalPrice: '2799', image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3?auto=format&fit=crop&w=800&q=80', category: 'XL Plants' },
        { name: 'Monstera Deliciosa XL', price: '2999', originalPrice: '3999', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', category: 'XL Plants' },
        { name: 'Bird of Paradise XL', price: '3499', originalPrice: '4499', image: 'https://images.unsplash.com/photo-1617135038936-3bc99d69f6f1?auto=format&fit=crop&w=800&q=80', category: 'XL Plants' }
    ];

    offers: Offer[] = [
        {
            badge: '🏺 INDOOR SPECIAL', title: 'INDOOR JUNGLE', subtitle: 'Buy Any 2 Indoor Plants',
            discountLine: '& GET A DESIGNER CERAMIC POT FREE', image: '/images/indoor_jungle_offer.jpg',
            cardBg: '#f5f3ff', accentColor: '#7c3aed', accentLight: '#ede9fe', accentText: '#4c1d95',
            tag: 'FREE POT', tagBg: '#a78bfa', tagText: '#fff', ctaLink: '/indoor-offer'
        },
        {
            badge: '🌸 FLOWERING BONANZA', title: 'FLOWERING BONANZA', subtitle: 'Premium Flower Seeds @ 70% OFF',
            discountLine: '+ FREE ORGANIC FERTILIZER PACK', image: '/images/flowering_bonanza_offer.jpg',
            cardBg: '#fdf2f8', accentColor: '#db2777', accentLight: '#fce7f3', accentText: '#831843',
            tag: '70% OFF', tagBg: '#f472b6', tagText: '#fff', ctaLink: '/flowering-offer'
        }
    ];

    ngOnInit() {
        // Fetch products tagged with G-BOGO-6-SECTION, limit to 4
        this.productService.getProducts('G-BOGO-6-SECTION', 4).subscribe(products => {
            if (products && products.length > 0) {
                this.xlPlants = products;
                // If fewer than 4 items are found, pad with our specific XL plants
                if (products.length < 4) {
                    const needed = 4 - products.length;
                    const fallbacks = [
                        { name: 'Fiddle Leaf Fig XL', price: '2499', originalPrice: '3299', image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894', category: 'XL Plants' },
                        { name: 'Rubber Plant XL', price: '1999', originalPrice: '2799', image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3', category: 'XL Plants' },
                        { name: 'Monstera Deliciosa XL', price: '2999', originalPrice: '3999', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b', category: 'XL Plants' },
                        { name: 'Bird of Paradise XL', price: '3499', originalPrice: '4499', image: 'https://images.unsplash.com/photo-1617135038936-3bc99d69f6f1', category: 'XL Plants' }
                    ];
                    this.xlPlants = [...this.xlPlants, ...fallbacks.slice(0, needed)];
                }
            } else {
                // If no specific tagged products found, use our default 4 XL plants
                this.xlPlants = [
                    { name: 'Fiddle Leaf Fig XL', price: '2499', originalPrice: '3299', image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894', category: 'XL Plants' },
                    { name: 'Rubber Plant XL', price: '1999', originalPrice: '2799', image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3', category: 'XL Plants' },
                    { name: 'Monstera Deliciosa XL', price: '2999', originalPrice: '3999', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b', category: 'XL Plants' },
                    { name: 'Bird of Paradise XL', price: '3499', originalPrice: '4499', image: 'https://images.unsplash.com/photo-1617135038936-3bc99d69f6f1', category: 'XL Plants' }
                ];
            }
        });

        this.offerService.getOffers().subscribe(offers => {
            if (offers && offers.length > 0) {
                this.offers = offers.filter(o => o.ctaLink !== '/bogo-offer').slice(0, 2);
            }
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
