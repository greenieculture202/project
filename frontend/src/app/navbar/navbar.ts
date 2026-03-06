import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

import { NotificationService, Notification } from '../services/notification.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
    searchTerm: string = '';
    searchResults: Product[] = [];
    showResults: boolean = false;
    showNotifications: boolean = false;
    unreadCount: number = 0;
    notifications: Notification[] = [];
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private productService: ProductService,
        private router: Router,
        public authService: AuthService,
        private cartService: CartService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        // Setup debounced search
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term.trim().length > 1) {
                    return this.productService.searchProducts(term);
                } else {
                    return [];
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (results) => {
                console.warn(`[Search-Backend] Received ${results.length} products from server`);
                this.searchResults = results;
                this.showResults = this.searchResults.length > 0 || this.searchTerm.trim().length > 1;
            },
            error: (err) => {
                console.error('Search error:', err);
                this.showResults = false;
            }
        });

        // Notifications subscription
        this.notificationService.notifications$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(notifications => {
            this.notifications = notifications;
            this.unreadCount = notifications.filter(n => !n.isRead).length;
        });
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }

    markAsRead(notification: Notification) {
        if (!notification.isRead) {
            this.notificationService.markAsRead(notification._id).subscribe(() => {
                this.notificationService.refresh();
            });
        }
        this.showNotifications = false;
        // Optionally navigate to the inquiry/details
    }

    clearAllNotifications() {
        this.notificationService.clearAll().subscribe(() => {
            this.notificationService.refresh();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get cartCount() {
        return this.cartService.totalItems();
    }

    toggleCart() {
        this.cartService.toggle();
    }

    onSearch() {
        console.log(`[Search-Input] User typed: "${this.searchTerm}"`);
        this.searchSubject.next(this.searchTerm);
    }

    selectProduct(product: Product) {
        console.warn(`[Search] Selected product: ${product.name}`);
        this.router.navigate(['/product', product.slug || '']);
        this.showResults = false;
        this.searchTerm = '';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    navigateToFaq() {
        this.router.navigateByUrl('/faq/all');
    }
}
