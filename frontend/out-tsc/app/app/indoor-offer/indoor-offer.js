import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { OfferService } from '../services/offer.service';
let IndoorOfferComponent = class IndoorOfferComponent {
    constructor() {
        this.productService = inject(ProductService);
        this.offerService = inject(OfferService);
        this.indoorPlants = [];
        this.offers = [];
    }
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
    createSlug(name) {
        return this.productService.createSlug(name);
    }
};
IndoorOfferComponent = __decorate([
    Component({
        selector: 'app-indoor-offer',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './indoor-offer.html',
        styleUrls: ['./indoor-offer.css']
    })
], IndoorOfferComponent);
export { IndoorOfferComponent };
//# sourceMappingURL=indoor-offer.js.map