import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
let NavbarComponent = class NavbarComponent {
    constructor(productService, router, authService, cartService, notificationService) {
        this.productService = productService;
        this.router = router;
        this.authService = authService;
        this.cartService = cartService;
        this.notificationService = notificationService;
        this.searchTerm = '';
        this.searchResults = [];
        this.showResults = false;
        this.isLoading = false;
        this.showNotifications = false;
        this.unreadCount = 0;
        this.notifications = [];
        this.searchSubject = new Subject();
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        // Setup debounced search
        this.searchSubject.pipe(debounceTime(400), distinctUntilChanged(), switchMap(term => {
            const trimmed = term.trim();
            if (trimmed.length > 1) {
                this.isLoading = true;
                this.showResults = true;
                return this.productService.searchProducts(trimmed);
            }
            else {
                this.isLoading = false;
                this.showResults = false;
                return of([]);
            }
        }), takeUntil(this.destroy$)).subscribe({
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
        this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
            const newUnreadCount = notifications.filter(n => !n.isRead).length;
            // Play sound if a NEW notification arrives
            if (newUnreadCount > this.unreadCount) {
                this.playNotificationSound();
            }
            this.notifications = notifications;
            this.unreadCount = newUnreadCount;
        });
    }
    playNotificationSound() {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
        }
        catch (err) {
            console.warn('Could not play notification sound:', err);
        }
    }
    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
    }
    markAsRead(notification) {
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
    selectProduct(product) {
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
};
NavbarComponent = __decorate([
    Component({
        selector: 'app-navbar',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterModule],
        templateUrl: './navbar.html',
        styleUrl: './navbar.css'
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.js.map