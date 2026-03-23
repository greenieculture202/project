import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';

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
    isLoading: boolean = false;
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
                const trimmed = term.trim();
                if (trimmed.length > 1) {
                    this.isLoading = true;
                    this.showResults = true;
                    return this.productService.searchProducts(trimmed);
                } else {
                    this.isLoading = false;
                    this.showResults = false;
                    return of([]);
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (results) => {
                this.isLoading = false;
                this.searchResults = results;
                // Keep showResults true if we have results OR if we are still searching
                this.showResults = this.searchTerm.trim().length > 1;
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Search error:', err);
                this.showResults = false;
            }
        });

        // Notifications subscription
        this.notificationService.notifications$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(notifications => {
            const newUnreadCount = notifications.filter(n => !n.isRead).length;
            
            // Play sound if a NEW notification arrives
            if (newUnreadCount > this.unreadCount) {
                this.playNotificationSound();
            }
            
            this.notifications = notifications;
            this.unreadCount = newUnreadCount;
        });
    }

    private playNotificationSound() {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
        } catch (err) {
            console.warn('Could not play notification sound:', err);
        }
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
        if (this.searchTerm.trim().length === 0) {
            this.clearSearch();
            return;
        }
        console.log(`[Search-Input] User typed: "${this.searchTerm}"`);
        this.searchSubject.next(this.searchTerm);
    }

    clearSearch() {
        this.searchTerm = '';
        this.searchResults = [];
        this.showResults = false;
        this.isLoading = false;
        this.searchSubject.next('');
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
