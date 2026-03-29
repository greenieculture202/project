import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { OfferService } from '../services/offer.service';
let FloweringOfferComponent = class FloweringOfferComponent {
    constructor() {
        this.productService = inject(ProductService);
        this.offerService = inject(OfferService);
        this.flowerSeeds = [];
        this.offers = [];
    }
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
    createSlug(name) {
        return this.productService.createSlug(name);
    }
};
FloweringOfferComponent = __decorate([
    Component({
        selector: 'app-flowering-offer',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './flowering-offer.html',
        styleUrls: ['./flowering-offer.css']
    })
], FloweringOfferComponent);
export { FloweringOfferComponent };
//# sourceMappingURL=flowering-offer.js.map