import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';

@Component({
    selector: 'app-indoor-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './indoor-offer.html',
    styleUrls: ['./indoor-offer.css']
})
export class IndoorOfferComponent implements OnInit {
    private productService = inject(ProductService);
    private offerService = inject(OfferService);

    indoorPlants: Product[] = [
        { name: 'Peace Lily', price: '399', originalPrice: '599', image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
        { name: 'Snake Plant', price: '499', originalPrice: '699', image: 'https://images.unsplash.com/photo-1593418105716-4307a8366dca?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
        { name: 'Areca Palm', price: '899', originalPrice: '1299', image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' },
        { name: 'Rubber Plant', price: '649', originalPrice: '899', image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3?auto=format&fit=crop&w=600&q=80', category: 'Indoor Plants' }
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
        // Fetch products that have the unique G-INDOOR-6-SEC tag/category
        this.productService.getProducts('G-INDOOR-6-SEC', 6).subscribe(products => {
            if (products && products.length > 0) {
                this.indoorPlants = products;
                if (products.length < 6) {
                    this.productService.getProducts('Indoor Plants', 6 - products.length).subscribe(extra => {
                        this.indoorPlants = [...this.indoorPlants, ...extra];
                    });
                }
            } else {
                // Fallback to general category
                this.productService.getProducts('Indoor Plants', 6).subscribe(p => {
                    if (p && p.length > 0) this.indoorPlants = p;
                });
            }
        });

        this.offerService.getOffers().subscribe(offers => {
            if (offers && offers.length > 0) {
                this.offers = offers.filter(o => o.ctaLink !== '/indoor-offer').slice(0, 2);
            }
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
