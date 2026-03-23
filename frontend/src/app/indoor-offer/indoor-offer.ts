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

    indoorPlants: Product[] = [];

    offers: Offer[] = [];

    ngOnInit() {
        // Fetch products that have the unique G-INDOOR-6-SEC tag/category
        this.productService.getProducts('G-INDOOR-6-SEC', undefined, 6).subscribe(products => {
            if (products) {
                this.indoorPlants = products;
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
