import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, NotificationState } from '../services/notification.service';
import { CartService } from '../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notification-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-modal.html',
    styleUrl: './notification-modal.css'
})
export class NotificationModalComponent implements OnInit, OnDestroy {
    notificationService = inject(NotificationService);
    cartService = inject(CartService);
    router = inject(Router);

    state: NotificationState = {
        isVisible: false,
        title: '',
        message: '',
        type: 'info'
    };

    private sub: Subscription | undefined;

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
}
