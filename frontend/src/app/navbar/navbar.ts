import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';

import { NotificationService, Notification } from '../services/notification.service';
import { AiService } from '../services/ai.service';

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
        private notificationService: NotificationService,
        private aiService: AiService
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

        // Notifications subscription with audio alert
        this.notificationService.notifications$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(notifications => {
            const hasNew = notifications.length > this.notifications.length && 
                           notifications.some(n => !n.isRead);
            
            if (hasNew) {
                this.playNotificationSound();
            }

            this.notifications = notifications;
            this.unreadCount = notifications.filter(n => !n.isRead).length;
        });
    }

    private playNotificationSound() {
        try {
            // Using a standard notification sound URL since local assets might not have the file yet
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.warn('Audio play blocked by browser policies', e));
        } catch (err) {
            console.error('Audio error:', err);
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
        
        // Handle specialized notification clicks
        if (notification.type === 'Reminder') {
          const plantName = notification.product?.name || 'Plant';
          this.aiService.triggerChat(`Aapne kaha tha ki mujhe mere **${plantName}** ka follow-up check karna chahiye. Kya aap mujhe aur recommendations de sakte hain?`, true);
        }
    }

    handleReminderAction(notification: Notification, action: 'continued' | 'stopped') {
        if (!notification.reminderId) return;
        
        this.notificationService.performReminderAction(notification.reminderId, action).subscribe({
            next: (res) => {
                console.log(`Reminder ${action}:`, res);
                
                // [Local Update] Mark notifications as read locally for instant feedback
                const targetPlant = notification.product?.name;
                this.notifications = this.notifications.map(n => {
                    if (n.reminderId === notification.reminderId || (n.type === 'Reminder' && n.product?.name === targetPlant)) {
                        return { ...n, isRead: true };
                    }
                    return n;
                });
                this.unreadCount = this.notifications.filter(n => !n.isRead).length;

                // Show feedback message based on action
                if (action === 'continued') {
                    alert("✅ Dhanyawad! Ab aapko 3 din ke baad agla reminder show hoga.");
                } else {
                    alert("🛑 Aapka reminder ab stop ho chuka hai.");
                }

                // If no more unread notifications, close the panel
                if (this.unreadCount === 0) {
                    this.showNotifications = false;
                }

                // Refresh background to sync with server
                this.notificationService.refresh();
            },
            error: (err) => {
              console.error(`Error ${action} reminder:`, err);
              alert("Kuch galat hua. Kripya dobara koshish karein.");
            }
        });
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
