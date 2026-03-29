import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { CartService } from '../services/cart.service';
let NotificationModalComponent = class NotificationModalComponent {
    constructor() {
        this.notificationService = inject(NotificationService);
        this.cartService = inject(CartService);
        this.router = inject(Router);
        this.state = {
            isVisible: false,
            title: '',
            message: '',
            type: 'info',
            layout: 'standard',
            confirmLabel: 'CONTINUE'
        };
    }
    ngOnInit() {
        this.sub = this.notificationService.state$.subscribe(state => {
            this.state = state;
        });
    }
    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
    onConfirm() {
        this.notificationService.hide();
        if (this.state.redirectUrl) {
            this.router.navigate([this.state.redirectUrl]);
        }
    }
    onClose() {
        // Optional: Hide on overlay click
        this.notificationService.hide();
    }
    onViewCart() {
        this.notificationService.hide();
        this.cartService.open();
    }
};
NotificationModalComponent = __decorate([
    Component({
        selector: 'app-notification-modal',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './notification-modal.html',
        styleUrl: './notification-modal.css'
    })
], NotificationModalComponent);
export { NotificationModalComponent };
//# sourceMappingURL=notification-modal.js.map