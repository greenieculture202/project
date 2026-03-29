import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { OfferService } from '../services/offer.service';
let GardenOfferComponent = class GardenOfferComponent {
    constructor() {
        this.productService = inject(ProductService);
        this.offerService = inject(OfferService);
        this.gardenTools = [];
        this.offers = [];
    }
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
    createSlug(name) {
        return this.productService.createSlug(name);
    }
};
GardenOfferComponent = __decorate([
    Component({
        selector: 'app-garden-offer',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './garden-offer.html',
        styleUrls: ['./garden-offer.css']
    })
], GardenOfferComponent);
export { GardenOfferComponent };
//# sourceMappingURL=garden-offer.js.map