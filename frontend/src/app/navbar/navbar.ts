import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent {
    private productService = inject(ProductService);
    private router = inject(Router);

    searchTerm: string = '';
    searchResults: Product[] = [];
    showResults: boolean = false;

    // To close search results when clicking outside
    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.search-container')) {
            this.showResults = false;
        }
    }

    onSearch() {
        if (!this.searchTerm.trim()) {
            this.searchResults = [];
            this.showResults = false;
            return;
        }

        const term = this.searchTerm.toLowerCase().trim();
        const allProductsMap = this.productService.getAllProductsMap();
        const flatProducts: Product[] = [];

        // Flatten all products from all categories
        Object.values(allProductsMap).forEach(products => {
            flatProducts.push(...products);
        });

        // Filter by name, remove duplicates (by name), and filter out "II" versions if original exists
        // Actually, just filtering by name and taking unique ones
        const seenNames = new Set<string>();
        this.searchResults = flatProducts
            .filter(product => {
                const name = product.name.toLowerCase();
                if (name.includes(term) && !seenNames.has(name)) {
                    seenNames.add(name);
                    return true;
                }
                return false;
            })
            .slice(0, 8); // Limit to 8 results for better UI
        console.log("search result", this.searchResults);
        this.showResults = this.searchResults.length > 0;

    }

    selectProduct(product: Product) {
        const slug = this.productService.createSlug(product.name);
        this.router.navigate(['/product', slug]);
        this.searchTerm = '';
        this.showResults = false;
    }
}
