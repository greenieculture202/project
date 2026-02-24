import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<string | null>(this.getUserName());
    currentUser$ = this.currentUserSubject.asObservable();

    private cartService = inject(CartService);

    constructor(private http: HttpClient) { }

    private hasToken(): boolean {
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

                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(res.user.fullName);

                // Sync cart from backend after login
                this.cartService.syncWithBackend();
            })
        );
    }

    googleLogin(idToken: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/google-login`, { idToken }).pipe(
            tap(res => {
                sessionStorage.setItem('auth_token', res.token);
                sessionStorage.setItem('user_name', res.user.fullName);
                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(res.user.fullName);
                this.cartService.syncWithBackend();
            })
        );
    }

    logout() {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_name');
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
        this.cartService.clear();
    }

    getCurrentUser(): string | null {
        return this.currentUserSubject.value;
    }
}
