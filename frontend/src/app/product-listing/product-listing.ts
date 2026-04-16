import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { OFFER_RULES, CATEGORY_TO_OFFER } from '../services/offer-rules';

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
    private authService = inject(AuthService);

    category: string = '';
    displayCategory: string = '';
    products: Product[] = [];
    userState: string | null = null;

    constructor() {
        const viewportScroller = inject(ViewportScroller);

        // Listen to state changes
        this.authService.userState$.subscribe(state => {
            this.userState = state;
            if (this.category) this.loadProducts();
        });

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

        // Commented out to allow service-side caching for faster navigation
        // this.productService.clearCache();

        // Map of slugs to exact category names
        const slugToCategoryMap: { [key: string]: string } = {
            'soil--growing-media': 'Soil & Growing Media',
            'soil-growing-media': 'Soil & Growing Media',
            'fertilizers--nutrients': 'Fertilizers & Nutrients',
            'fertilizers-nutrients': 'Fertilizers & Nutrients',
            'gardening-tools': 'Gardening Tools',
            'hand-tools': 'Hand Tools',
            'cutting-tools': 'Cutting Tools',
            'digging-tools': 'Digging Tools',
            'power-tools': 'Power Tools',
            'seeds-plants': 'Seeds',
            'seeds': 'Seeds',
            'accessories-plants': 'Accessories',
            'accessories': 'Accessories',
            'gardening-plants': 'Gardening',
            'indoor-plants': 'Indoor Plants',
            'outdoor-plants': 'Outdoor Plants',
            'flowering-plants': 'Flowering Plants',
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

        // Safety fallback - increased to 20s to give backend enough time
        const fallbackTimer = setTimeout(() => {
            if (this.isLoading) {
                this.isLoading = false;
                this.error = 'Request timed out or hung indefinitely. Check console.';
            }
        }, 20000);

        this.productService.getProducts(categoryName, this.userState || '').subscribe({
            next: (products: any[]) => {
                clearTimeout(fallbackTimer);
                this.products = products;
                this.isLoading = false;
                if (this.products.length === 0) {
                    this.displayCategory = 'Product Not Found';
                } else {
                    this.displayCategory = categoryName;
                }
            },
            error: (err: any) => {
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

    hasOfferTag(product: Product): boolean {
        if (!product || !product.tags) return false;
        const offerTags = OFFER_RULES.map(r => r.code);
        return product.tags.some(tag => offerTags.includes(tag));
    }

    getOfferBenefit(product: Product): string {
        if (!product) return '';
        const offerTags = OFFER_RULES.map(tag => tag.code);
        const code = product.tags?.find(tag => offerTags.includes(tag)) ||
            (product.category ? CATEGORY_TO_OFFER[product.category] : null);

        if (code) {
            const rule = OFFER_RULES.find(r => r.code === code);
            return rule ? rule.shortBenefit : '';
        }
        return '';
    }

    isZoomCategory(product: Product): boolean {
        if (!product || !product.category) return false;
        const cat = product.category.toLowerCase();
        return cat.includes('seed') || cat.includes('soil') || cat.includes('fertilizer') || cat.includes('nutrient') || cat.includes('media');
    }
}
