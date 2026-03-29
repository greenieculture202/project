import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
let ProductListingComponent = class ProductListingComponent {
    constructor() {
        this.route = inject(ActivatedRoute);
        this.productService = inject(ProductService);
        this.authService = inject(AuthService);
        this.category = '';
        this.displayCategory = '';
        this.products = [];
        this.userState = null;
        this.isLoading = true;
        this.error = '';
        const viewportScroller = inject(ViewportScroller);
        // Listen to state changes
        this.authService.userState$.subscribe(state => {
            this.userState = state;
            if (this.category)
                this.loadProducts();
        });
        this.route.paramMap.subscribe(params => {
            this.category = params.get('category') || 'Bestsellers';
            // Decode URL parameter if necessary, or map slug to display name
            this.displayCategory = decodeURIComponent(this.category);
            this.loadProducts();
            viewportScroller.scrollToPosition([0, 0]);
        });
    }
    loadProducts() {
        this.isLoading = true;
        this.error = '';
        // Map of slugs to exact category names
        const slugToCategoryMap = {
            'soil--growing-media': 'Soil & Growing Media',
            'soil-growing-media': 'Soil & Growing Media',
            'fertilizers--nutrients': 'Fertilizers & Nutrients',
            'fertilizers-nutrients': 'Fertilizers & Nutrients',
            'gardening-tools': 'Gardening Tools',
            'seeds-plants': 'Seeds',
            'seeds': 'Seeds',
            'accessories-plants': 'Accessories',
            'accessories': 'Accessories',
            'gardening-plants': 'Gardening',
            'pots-planters': 'Pots & Planters',
            'designer-pots': 'Pots & Planters',
            'pots--planters': 'Pots & Planters'
        };
        let categoryName = slugToCategoryMap[this.displayCategory.toLowerCase()];
        if (!categoryName) {
            // Split by hyphens or spaces, capitalize each word
            categoryName = this.displayCategory
                .split(/[-\s]+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
        // Safety fallback just in case observable never emits
        const fallbackTimer = setTimeout(() => {
            if (this.isLoading) {
                this.isLoading = false;
                this.error = 'Request timed out or hung indefinitely. Check console.';
            }
        }, 8000);
        this.productService.getProducts(categoryName, this.userState || '').subscribe({
            next: (products) => {
                clearTimeout(fallbackTimer);
                this.products = products;
                this.isLoading = false;
                if (this.products.length === 0) {
                    this.displayCategory = 'Product Not Found';
                }
                else {
                    this.displayCategory = categoryName;
                }
            },
            error: (err) => {
                clearTimeout(fallbackTimer);
                console.error('Error loading listing:', err);
                this.error = 'Failed to load products. Please check your connection.';
                this.isLoading = false;
            }
        });
    }
    getSlug(name) {
        return this.productService.createSlug(name);
    }
    getTagClass(tag) {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }
};
ProductListingComponent = __decorate([
    Component({
        selector: 'app-product-listing',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './product-listing.html',
        styleUrl: './product-listing.css'
    })
], ProductListingComponent);
export { ProductListingComponent };
//# sourceMappingURL=product-listing.js.map