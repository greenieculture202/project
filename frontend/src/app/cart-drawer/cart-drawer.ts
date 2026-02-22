import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';

@Component({
    selector: 'app-cart-drawer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart-drawer.html',
    styleUrl: './cart-drawer.css'
})
export class CartDrawerComponent {
    cartService = inject(CartService);
    router = inject(Router);

    get items() {
        return this.cartService.items();
    }

    get isOpen() {
        return this.cartService.isOpen();
    }

    get totalItems() {
        return this.cartService.totalItems();
    }

    get totalAmount() {
        return this.cartService.totalAmount();
    }

    get totalSavings() {
        return this.cartService.totalSavings();
    }

    close() {
        this.cartService.close();
    }

    updateQuantity(item: CartItem, delta: number) {
        this.cartService.updateQuantity(item.id, item.quantity + delta);
    }

    removeItem(item: CartItem) {
        this.cartService.removeItem(item.id);
    }

    onCheckout() {
        this.cartService.close();
        this.router.navigate(['/checkout']);
    }

    getTagClass(tag: string): string {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }
}
