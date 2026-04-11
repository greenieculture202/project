import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { OFFER_RULES, CATEGORY_TO_OFFER } from '../services/offer-rules';



@Component({
    selector: 'app-product-tabs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-tabs.html',
    styleUrl: './product-tabs.css'
})
export class ProductTabsComponent implements AfterViewInit {
    @ViewChild('sliderRef') sliderRef!: ElementRef;

    productService = inject(ProductService);
    authService = inject(AuthService);
    router = inject(Router);


    tabs = ['Bestsellers', 'XL Plants', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Gardening'];
    activeTab = 'Bestsellers';
    showArrows = true;

    products: Product[] = [];

    constructor() {
        this.loadProducts();
    }

    get currentProducts() {
        return this.products;
    }

    get userState(): string | null {
        return sessionStorage.getItem('user_state');
    }

    ngAfterViewInit() {
        // Initialize scroll position
    }

    loadProducts() {
        const userState = sessionStorage.getItem('user_state') || undefined;
        // Subscribe to the Observable from the service
        // Limit to 10 products as requested
        this.productService.getProducts(this.activeTab, userState, 10).subscribe(products => {
            this.products = products; // Show all products
        });
    }

    setActiveTab(tab: string) {
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
        const offerTags = OFFER_RULES.map(r => r.code);
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
