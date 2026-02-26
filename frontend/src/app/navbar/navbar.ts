import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent {
    searchTerm: string = '';
    searchResults: Product[] = [];
    showResults: boolean = false;

    constructor(
        private productService: ProductService,
        private router: Router,
        public authService: AuthService,
        private cartService: CartService
    ) { }

    get cartCount() {
        return this.cartService.totalItems();
    }

    toggleCart() {
        this.cartService.toggle();
    }

    onSearch() {
        if (this.searchTerm.trim().length > 1) {
            this.productService.searchProducts(this.searchTerm).subscribe((results: any[]) => {
                this.searchResults = results;
                this.showResults = true;
            });
        } else {
            this.showResults = false;
        }
    }

    selectProduct(product: Product) {
        this.router.navigate(['/product', product.slug || '']);
        this.showResults = false;
        this.searchTerm = '';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    navigateToFaq() {
        this.router.navigate(['/']).then(() => {
            setTimeout(() => {
                const el = document.getElementById('faq-section');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }
}
