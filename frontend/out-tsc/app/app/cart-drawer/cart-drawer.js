import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
let CartDrawerComponent = class CartDrawerComponent {
    constructor() {
        this.cartService = inject(CartService);
        this.router = inject(Router);
    }
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
    updateQuantity(item, delta) {
        this.cartService.updateQuantity(item.id, item.quantity + delta);
    }
    removeItem(item) {
        this.cartService.removeItem(item.id);
    }
    onCheckout() {
        this.cartService.close();
        this.router.navigate(['/checkout']);
    }
    getTagClass(tag) {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }
};
CartDrawerComponent = __decorate([
    Component({
        selector: 'app-cart-drawer',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './cart-drawer.html',
        styleUrl: './cart-drawer.css'
    })
], CartDrawerComponent);
export { CartDrawerComponent };
//# sourceMappingURL=cart-drawer.js.map