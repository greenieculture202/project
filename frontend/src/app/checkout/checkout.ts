import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);

    items = this.cartService.items;
    totalAmount = this.cartService.totalAmount;
    totalSavings = this.cartService.totalSavings;

    contactEmail = '';
    firstName = '';
    lastName = '';
    address = '';
    city = '';
    stateName = 'Gujarat';
    pinCode = '';
    phone = '';

    selectedPayment = 'razorpay';

    ngOnInit() {
        // Redirect if cart is empty
        if (this.cartService.totalItems() === 0) {
            this.router.navigate(['/']);
            return;
        }

        // Pre-fill email if user is logged in
        const user = this.authService.getCurrentUser();
        if (user) {
            // Since we only store fullName, we use a placeholder or hope they fill it
            this.contactEmail = '';
        }
    }

    onPayNow() {
        console.log('Processing payment via', this.selectedPayment);
        // Implement payment logic or redirect to success
        alert('Thank you for your order! This is a demo checkout.');
        this.cartService.clear();
        this.router.navigate(['/']);
    }
}
