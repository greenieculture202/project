import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';

export interface Notification {
    _id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    relatedInquiryId?: string;
    subType?: string;
    reminderId?: string;
    product?: {
      id?: string;
      name?: string;
      image?: string;
      stock?: number;
    };
    isRead: boolean;
    createdAt: Date;
}

export interface NotificationState {
    isVisible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'cart';
    layout?: 'standard' | 'cart';
    confirmLabel?: string;
    redirectUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = '/api/user/notifications';

    // For Inquiry Notifications (Navbar)
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    public unreadCount$ = this.notifications$.pipe(
        map(notifications => notifications.filter(n => !n.isRead).length)
    );

    // For Global Toast/Modal Notifications (Original functionality)
    private stateSubject = new BehaviorSubject<NotificationState>({
        isVisible: false,
        title: '',
        message: '',
        type: 'info',
        layout: 'standard',
        confirmLabel: 'CONTINUE'
    });
    public state$ = this.stateSubject.asObservable();

    constructor(private http: HttpClient) {
        // Poll for notifications every 30 seconds if logged in
        interval(30000).pipe(
            startWith(0),
            switchMap(() => this.getNotifications())
        ).subscribe(notifications => {
            if (Array.isArray(notifications)) {
                this.notificationsSubject.next(notifications);
            }
        });
    }

    // Inquiry & User Notifications Methods
    getNotifications(): Observable<Notification[]> {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        if (!token) return new BehaviorSubject<Notification[]>([]).asObservable();
        const headers = new HttpHeaders().set('x-auth-token', token);
        return this.http.get<Notification[]>(this.apiUrl, { headers });
    }

    markAsRead(id: string): Observable<any> {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.put(`${this.apiUrl}/${id}/read`, {}, { headers });
    }

    clearAll(): Observable<any> {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.delete(this.apiUrl, { headers });
    }

    performReminderAction(reminderId: string, action: 'continued' | 'stopped'): Observable<any> {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.post(`/api/user/reminders/${reminderId}/action`, { action }, { headers });
    }

    refresh() {
        this.getNotifications().subscribe(notifications => {
            this.notificationsSubject.next(notifications);
        });
    }

    // Toast/Modal Notification Methods (Original)
    show(message: string, title: string = 'Notification', type: 'success' | 'error' | 'info' | 'warning' | 'cart' = 'info', layout: 'standard' | 'cart' = 'standard', redirectUrl?: string, confirmLabel: string = 'CONTINUE') {
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
}
