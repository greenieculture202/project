import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { OfferService } from '../services/offer.service';
let BogoOfferComponent = class BogoOfferComponent {
    constructor() {
        this.productService = inject(ProductService);
        this.offerService = inject(OfferService);
        this.xlPlants = [];
        this.offers = [];
    }
    ngOnInit() {
        // Fetch products tagged with G-BOGO-6-SECTION, limit to 4
        this.productService.getProducts('G-BOGO-6-SECTION', undefined, 4).subscribe(products => {
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
    createSlug(name) {
        return this.productService.createSlug(name);
    }
};
BogoOfferComponent = __decorate([
    Component({
        selector: 'app-bogo-offer',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './bogo-offer.html',
        styleUrls: ['./bogo-offer.css']
    })
], BogoOfferComponent);
export { BogoOfferComponent };
//# sourceMappingURL=bogo-offer.js.map