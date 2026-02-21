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

    loadProducts() {
        // Map of slugs to exact category names (for categories with special characters)
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

        // First check if we have a direct mapping
        let categoryName = slugToCategoryMap[this.displayCategory.toLowerCase()];

        // If no direct mapping, convert slug to proper category name (e.g., 'vegetable-seeds' -> 'Vegetable Seeds')
        if (!categoryName) {
            categoryName = this.displayCategory
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        this.productService.getProducts(categoryName).subscribe(products => {
            this.products = products;

            // If no products found (bad URL), maybe redirect or show empty
            if (this.products.length === 0) {
                this.displayCategory = 'Product Not Found';
            } else {
                // Update display category to proper name
                this.displayCategory = categoryName;
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
