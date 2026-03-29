import { __decorate } from "tslib";
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
let ProductTabsComponent = class ProductTabsComponent {
    constructor() {
        this.productService = inject(ProductService);
        this.authService = inject(AuthService);
        this.router = inject(Router);
        this.tabs = ['Bestsellers', 'New Arrivals', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Gardening'];
        this.activeTab = 'Bestsellers';
        this.showArrows = true;
        this.products = [];
        this.loadProducts();
    }
    get currentProducts() {
        return this.products;
    }
    get userState() {
        return sessionStorage.getItem('user_state');
    }
    ngAfterViewInit() {
        // Initialize scroll position
    }
    loadProducts() {
        const userState = sessionStorage.getItem('user_state') || undefined;
        // Subscribe to the Observable from the service
        // Limit to 6 products as requested
        this.productService.getProducts(this.activeTab, userState, 6).subscribe(products => {
            this.products = products; // Show all products
        });
    }
    setActiveTab(tab) {
        this.activeTab = tab;
        this.loadProducts();
        // Reset scroll when changing tab
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollLeft = 0;
        }
    }
    scrollLeft() {
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }
    scrollRight() {
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }
    getSlug(name) {
        return this.productService.createSlug(name);
    }
    getTagClass(tag) {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }
};
__decorate([
    ViewChild('sliderRef')
], ProductTabsComponent.prototype, "sliderRef", void 0);
ProductTabsComponent = __decorate([
    Component({
        selector: 'app-product-tabs',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './product-tabs.html',
        styleUrl: './product-tabs.css'
    })
], ProductTabsComponent);
export { ProductTabsComponent };
//# sourceMappingURL=product-tabs.js.map