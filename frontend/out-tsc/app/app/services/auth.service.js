import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { NotificationService } from './notification.service';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.apiUrl = '/api/auth';
        this.isLoggedInSubject = new BehaviorSubject(this.isLoggedIn());
        this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
        this.isAdminSubject = new BehaviorSubject(sessionStorage.getItem('is_admin') === 'true');
        this.isAdmin$ = this.isAdminSubject.asObservable();
        this.currentUserSubject = new BehaviorSubject(this.getUserName());
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.profilePicSubject = new BehaviorSubject(sessionStorage.getItem('user_pic'));
        this.profilePic$ = this.profilePicSubject.asObservable();
        this.userStateSubject = new BehaviorSubject(sessionStorage.getItem('user_state'));
        this.userState$ = this.userStateSubject.asObservable();
        this.cartService = inject(CartService);
        this.notificationService = inject(NotificationService);
        // Safeguard: Clear legacy mock token if it still exists in browser session
        if (sessionStorage.getItem('auth_token') === 'admin-token') {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('is_admin');
            this.isLoggedInSubject.next(false);
            this.isAdminSubject.next(false);
        }
    }
    isLoggedIn() {
        return !!sessionStorage.getItem('auth_token');
    }
    getUserName() {
        return sessionStorage.getItem('user_name');
    }
    // Register user via Backend
    registerUser(userData) {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }
    // Login user via Backend
    login(credentials) {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(tap(res => {
            // Save token and user info in sessionStorage (for browser-close logout)
            sessionStorage.setItem('auth_token', res.token);
            sessionStorage.setItem('user_name', res.user.fullName);
            sessionStorage.setItem('user_id', res.user._id);
            sessionStorage.setItem('user_pic', res.user.profilePic || '');
            sessionStorage.setItem('user_state', res.user.state || '');
            sessionStorage.setItem('is_admin', 'false');
            this.isLoggedInSubject.next(true);
            this.isAdminSubject.next(false);
            this.currentUserSubject.next(res.user.fullName);
            this.profilePicSubject.next(res.user.profilePic || null);
            this.userStateSubject.next(res.user.state || null);
            // Sync cart from backend after login
            this.cartService.syncWithBackend();
            this.notificationService.refresh();
        }));
    }
    setAdmin(isAdmin, name = 'Admin') {
        if (isAdmin) {
            sessionStorage.setItem('is_admin', 'true');
            sessionStorage.setItem('user_name', name);
            this.isLoggedInSubject.next(true);
            this.isAdminSubject.next(true);
            this.currentUserSubject.next(name);
        }
        else {
            sessionStorage.removeItem('is_admin');
            this.isAdminSubject.next(false);
        }
    }
    requestGoogleOTP(idToken) {
        return this.http.post(`${this.apiUrl}/google-login/request-otp`, { idToken });
    }
    verifyGoogleOTP(email, otp) {
        return this.http.post(`${this.apiUrl}/google-login/verify-otp`, { email, otp }).pipe(tap(res => {
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
        }));
    }
    googleLogin(idToken) {
        return this.http.post(`${this.apiUrl}/google-login`, { idToken }).pipe(tap(res => {
            sessionStorage.setItem('auth_token', res.token);
            sessionStorage.setItem('user_name', res.user.fullName);
            sessionStorage.setItem('user_pic', res.user.profilePic || '');
            sessionStorage.setItem('user_state', res.user.state || '');
            sessionStorage.setItem('is_admin', 'false');
            this.isLoggedInSubject.next(true);
            this.isAdminSubject.next(false);
            this.currentUserSubject.next(res.user.fullName);
            this.profilePicSubject.next(res.user.profilePic || null);
            this.userStateSubject.next(res.user.state || null);
            this.cartService.syncWithBackend();
            this.notificationService.refresh();
        }));
    }
    logout() {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_pic');
        sessionStorage.removeItem('user_state');
        sessionStorage.removeItem('is_admin');
        this.isLoggedInSubject.next(false);
        this.isAdminSubject.next(false);
        this.currentUserSubject.next(null);
        this.profilePicSubject.next(null);
        this.userStateSubject.next(null);
        this.cartService.clear();
    }
    updateUserLocalInfo(name, pic) {
        sessionStorage.setItem('user_name', name);
        this.currentUserSubject.next(name);
        if (pic !== undefined) {
            sessionStorage.setItem('user_pic', pic);
            this.profilePicSubject.next(pic);
        }
    }
    getCurrentUser() {
        return this.currentUserSubject.value;
    }
    get currentUserId() {
        return sessionStorage.getItem('user_id');
    }
    isAdmin() {
        return this.isAdminSubject.value;
    }
    getToken() {
        return sessionStorage.getItem('auth_token');
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map