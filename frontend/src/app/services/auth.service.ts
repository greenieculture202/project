import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public apiUrl = '/api/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(sessionStorage.getItem('is_admin') === 'true');
    isAdmin$ = this.isAdminSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<string | null>(this.getUserName());
    currentUser$ = this.currentUserSubject.asObservable();

    private profilePicSubject = new BehaviorSubject<string | null>(sessionStorage.getItem('user_pic'));
    profilePic$ = this.profilePicSubject.asObservable();

    private cartService = inject(CartService);
    private notificationService = inject(NotificationService);

    constructor(private http: HttpClient) {
        // Safeguard: Clear legacy mock token if it still exists in browser session
        if (sessionStorage.getItem('auth_token') === 'admin-token') {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('is_admin');
            this.isLoggedInSubject.next(false);
            this.isAdminSubject.next(false);
        }
    }

    isLoggedIn(): boolean {
        return !!sessionStorage.getItem('auth_token');
    }

    private getUserName(): string | null {
        return sessionStorage.getItem('user_name');
    }

    // Register user via Backend
    registerUser(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    // Login user via Backend
    login(credentials: { email: string, password?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => {
                // Save token and user info in sessionStorage (for browser-close logout)
                sessionStorage.setItem('auth_token', res.token);
                sessionStorage.setItem('user_name', res.user.fullName);
                sessionStorage.setItem('user_id', res.user._id);
                sessionStorage.setItem('user_pic', res.user.profilePic || '');
                sessionStorage.setItem('is_admin', 'false');

                this.isLoggedInSubject.next(true);
                this.isAdminSubject.next(false);
                this.currentUserSubject.next(res.user.fullName);
                this.profilePicSubject.next(res.user.profilePic || null);

                // Sync cart from backend after login
                this.cartService.syncWithBackend();
                this.notificationService.refresh();
            })
        );
    }

    setAdmin(isAdmin: boolean, name: string = 'Admin') {
        if (isAdmin) {
            sessionStorage.setItem('is_admin', 'true');
            sessionStorage.setItem('user_name', name);
            this.isLoggedInSubject.next(true);
            this.isAdminSubject.next(true);
            this.currentUserSubject.next(name);
        } else {
            sessionStorage.removeItem('is_admin');
            this.isAdminSubject.next(false);
        }
    }

    requestGoogleOTP(idToken: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/google-login/request-otp`, { idToken });
    }

    verifyGoogleOTP(email: string, otp: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/google-login/verify-otp`, { email, otp }).pipe(
            tap(res => {
                sessionStorage.setItem('auth_token', res.token);
                sessionStorage.setItem('user_name', res.user.fullName);
                sessionStorage.setItem('user_id', res.user._id);
                sessionStorage.setItem('user_pic', res.user.profilePic || '');
                sessionStorage.setItem('is_admin', 'false');
                this.isLoggedInSubject.next(true);
                this.isAdminSubject.next(false);
                this.currentUserSubject.next(res.user.fullName);
                this.profilePicSubject.next(res.user.profilePic || null);
                this.cartService.syncWithBackend();
                this.notificationService.refresh();
            })
        );
    }

    googleLogin(idToken: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/google-login`, { idToken }).pipe(
            tap(res => {
                sessionStorage.setItem('auth_token', res.token);
                sessionStorage.setItem('user_name', res.user.fullName);
                sessionStorage.setItem('user_pic', res.user.profilePic || '');
                sessionStorage.setItem('is_admin', 'false');
                this.isLoggedInSubject.next(true);
                this.isAdminSubject.next(false);
                this.currentUserSubject.next(res.user.fullName);
                this.profilePicSubject.next(res.user.profilePic || null);
                this.cartService.syncWithBackend();
                this.notificationService.refresh();
            })
        );
    }

    logout() {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_pic');
        sessionStorage.removeItem('is_admin');
        this.isLoggedInSubject.next(false);
        this.isAdminSubject.next(false);
        this.currentUserSubject.next(null);
        this.profilePicSubject.next(null);
        this.cartService.clear();
        localStorage.removeItem('ai_plant_chat_history');
    }

    updateUserLocalInfo(name: string, pic?: string) {
        sessionStorage.setItem('user_name', name);
        this.currentUserSubject.next(name);
        if (pic !== undefined) {
            sessionStorage.setItem('user_pic', pic);
            this.profilePicSubject.next(pic);
        }
    }

    getCurrentUser(): string | null {
        return this.currentUserSubject.value;
    }

    get currentUserId(): string | null {
        return sessionStorage.getItem('user_id');
    }

    isAdmin(): boolean {
        return this.isAdminSubject.value;
    }

}
