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

    gardenTools: Product[] = [];

    offers: Offer[] = [];

    ngOnInit() {
        // Fetch products that have the unique G-GARDEN-6-SEC tag/category
        this.productService.getProducts('G-GARDEN-6-SEC', undefined, 6).subscribe(products => {
            if (products) {
                this.gardenTools = products;
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
