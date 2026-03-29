import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';

@Component({
    selector: 'app-cart-drawer',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

    get appliedOffer() {
        return this.cartService.appliedOffer();
    }

    get potentialOffer() {
        return this.cartService.potentialOffer();
    }

    close() {
        this.cartService.close();
    }

    updateQuantity(item: CartItem, delta: number) {
        const newQty = item.quantity + delta;
        // Limit button clicks to 10. Manual entry allows up to 20.
        if (delta > 0 && item.quantity >= 10) return;
        
        if (newQty >= 1 && newQty <= 20) {
            this.cartService.updateQuantity(item.id, newQty);
        }
    }

    onQuantityChange(item: CartItem) {
        if (item.quantity > 20) {
            item.quantity = 20;
        } else if (item.quantity < 1 && item.quantity !== null) {
            item.quantity = 1;
        }
        this.cartService.updateQuantity(item.id, item.quantity);
    }

    isLimitReached(item: CartItem): boolean {
        return item.quantity >= 20;
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
