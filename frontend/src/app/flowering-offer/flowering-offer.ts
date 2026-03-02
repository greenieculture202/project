import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';

@Component({
    selector: 'app-flowering-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './flowering-offer.html',
    styleUrls: ['./flowering-offer.css']
})
export class FloweringOfferComponent implements OnInit {
    private productService = inject(ProductService);
    private offerService = inject(OfferService);

    flowerSeeds: Product[] = [
        { name: 'Marigold Seeds', price: '49', originalPrice: '99', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80', category: 'Flower Seeds' },
        { name: 'Sunflower Seeds', price: '59', originalPrice: '120', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&h=600&fit=crop', category: 'Flower Seeds' },
        { name: 'Zinnia Seeds', price: '79', originalPrice: '199', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop', category: 'Flower Seeds' },
        { name: 'Petunia Seeds', price: '89', originalPrice: '250', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80', category: 'Flower Seeds' }
    ];

    offers: Offer[] = [
        {
            badge: '🌿 EXCLUSIVE DEAL', title: 'BOGO OFFER', subtitle: 'Buy 2 XL Plants',
            discountLine: '& GET 1 MEDIUM PLANT FREE', image: '/images/bogo_offer_v2.jpg',
            cardBg: '#f0fdf4', accentColor: '#16a34a', accentLight: '#dcfce7', accentText: '#14532d',
            tag: 'BOGO', tagBg: '#fbbf24', tagText: '#78350f', ctaLink: '/bogo-offer'
        },
        {
            badge: '🏺 INDOOR SPECIAL', title: 'INDOOR JUNGLE', subtitle: 'Buy Any 2 Indoor Plants',
            discountLine: '& GET A DESIGNER CERAMIC POT FREE', image: '/images/indoor_jungle_offer.jpg',
            cardBg: '#f5f3ff', accentColor: '#7c3aed', accentLight: '#ede9fe', accentText: '#4c1d95',
            tag: 'FREE POT', tagBg: '#a78bfa', tagText: '#fff', ctaLink: '/indoor-offer'
        }
    ];

    ngOnInit() {
        // Fetch products that have the unique G-FLOWER-6-SEC tag/category
        this.productService.getProducts('G-FLOWER-6-SEC', 6).subscribe(products => {
            if (products && products.length > 0) {
                this.flowerSeeds = products;
                if (products.length < 6) {
                    this.productService.getProducts('Flowering Plants', 6 - products.length).subscribe(extra => {
                        this.flowerSeeds = [...this.flowerSeeds, ...extra];
                    });
                }
            } else {
                // Fallback to general category
                this.productService.getProducts('Flowering Plants', 6).subscribe(p => {
                    if (p && p.length > 0) this.flowerSeeds = p;
                });
            }
        });

        this.offerService.getOffers().subscribe(offers => {
            if (offers && offers.length > 0) {
                this.offers = offers.filter(o => o.ctaLink !== '/flowering-offer').slice(0, 2);
            }
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
