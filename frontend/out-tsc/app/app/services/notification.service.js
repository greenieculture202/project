import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
let NotificationService = class NotificationService {
    constructor(http) {
        this.http = http;
        this.apiUrl = '/api/user/notifications';
        // For Inquiry Notifications (Navbar)
        this.notificationsSubject = new BehaviorSubject([]);
        this.notifications$ = this.notificationsSubject.asObservable();
        this.unreadCount$ = this.notifications$.pipe(map(notifications => notifications.filter(n => !n.isRead).length));
        // For Global Toast/Modal Notifications (Original functionality)
        this.stateSubject = new BehaviorSubject({
            isVisible: false,
            title: '',
            message: '',
            type: 'info',
            layout: 'standard',
            confirmLabel: 'CONTINUE'
        });
        this.state$ = this.stateSubject.asObservable();
        // Poll for notifications every 30 seconds if logged in
        interval(30000).pipe(startWith(0), switchMap(() => this.getNotifications())).subscribe(notifications => {
            if (Array.isArray(notifications)) {
                this.notificationsSubject.next(notifications);
            }
        });
    }
    // Inquiry & User Notifications Methods
    getNotifications() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        if (!token)
            return new BehaviorSubject([]).asObservable();
        const headers = new HttpHeaders().set('x-auth-token', token);
        return this.http.get(this.apiUrl, { headers });
    }
    markAsRead(id) {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.put(`${this.apiUrl}/${id}/read`, {}, { headers });
    }
    clearAll() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.delete(this.apiUrl, { headers });
    }
    refresh() {
        this.getNotifications().subscribe(notifications => {
            this.notificationsSubject.next(notifications);
        });
    }
    // Toast/Modal Notification Methods (Original)
    show(message, title = 'Notification', type = 'info', layout = 'standard', redirectUrl, confirmLabel = 'CONTINUE') {
        this.stateSubject.next({
            isVisible: true,
            title,
            message,
            type,
            layout,
            confirmLabel,
            redirectUrl
        });
        // Auto-hide after 5 seconds for non-error/non-cart toasts
        if (type !== 'error' && type !== 'cart') {
            setTimeout(() => this.hide(), 5000);
        }
    }
    hide() {
        this.stateSubject.next({
            ...this.stateSubject.value,
            isVisible: false
        });
    }
};
NotificationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationService);
export { NotificationService };
//# sourceMappingURL=notification.service.js.map