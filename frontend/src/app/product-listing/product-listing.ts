import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-product-listing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-listing.html',
    styleUrl: './product-listing.css'
})
export class ProductListingComponent {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);

    category: string = '';
    displayCategory: string = '';
    products: Product[] = [];

    constructor() {
        const viewportScroller = inject(ViewportScroller);
        this.route.paramMap.subscribe(params => {
            this.category = params.get('category') || 'Bestsellers';
            // Decode URL parameter if necessary, or map slug to display name
            this.displayCategory = decodeURIComponent(this.category);
            this.loadProducts();
            viewportScroller.scrollToPosition([0, 0]);
        });
    }

    isLoading: boolean = true;
    error: string = '';

    loadProducts() {
        this.isLoading = true;
        this.error = '';

        // Map of slugs to exact category names
        const slugToCategoryMap: { [key: string]: string } = {
            'soil--growing-media': 'Soil & Growing Media',
            'soil-growing-media': 'Soil & Growing Media',
            'fertilizers--nutrients': 'Fertilizers & Nutrients',
            'fertilizers-nutrients': 'Fertilizers & Nutrients',
            'gardening-tools': 'Gardening Tools',
            'seeds-plants': 'Seeds',
            'accessories-plants': 'Accessories',
            'gardening-plants': 'Gardening'
        };

        let categoryName = slugToCategoryMap[this.displayCategory.toLowerCase()];

        if (!categoryName) {
            categoryName = this.displayCategory
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        // Safety fallback just in case observable never emits
        const fallbackTimer = setTimeout(() => {
            if (this.isLoading) {
                this.isLoading = false;
                this.error = 'Request timed out or hung indefinitely. Check console.';
            }
        }, 8000);

        this.productService.getProducts(categoryName).subscribe({
            next: (products) => {
                clearTimeout(fallbackTimer);
                this.products = products;
                this.isLoading = false;
                if (this.products.length === 0) {
                    this.displayCategory = 'Product Not Found';
                } else {
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

    getSlug(name: string): string {
        return this.productService.createSlug(name);
    }

    getTagClass(tag: string): string {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }
}
