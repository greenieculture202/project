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

    xlPlants: Product[] = [];

    offers: Offer[] = [];

    ngOnInit() {
        // Fetch products tagged with G-BOGO-6-SECTION, limit to 4
        this.productService.getProducts('G-BOGO-6-SECTION', 4).subscribe(products => {
            if (products) {
                this.xlPlants = products;
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
