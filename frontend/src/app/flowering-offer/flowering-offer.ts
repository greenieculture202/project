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

    flowerSeeds: Product[] = [];

    offers: Offer[] = [];

    ngOnInit() {
        // Fetch products that have the unique G-FLOWER-6-SEC tag/category
        this.productService.getProducts('G-FLOWER-6-SEC', undefined, 6).subscribe(products => {
            if (products) {
                this.flowerSeeds = products;
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
