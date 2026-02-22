import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:5005/api/auth';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<string | null>(this.getUserName());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    private hasToken(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    private getUserName(): string | null {
        return localStorage.getItem('user_name');
    }

    // Register user via Backend
    registerUser(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    // Login user via Backend
    login(credentials: { email: string, password?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => {
                // Save token and user info (fullName for display)
                localStorage.setItem('auth_token', res.token);
                localStorage.setItem('user_name', res.user.fullName);

                this.isLoggedInSubject.next(true);
                this.currentUserSubject.next(res.user.fullName);
            })
        );
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): string | null {
        return this.currentUserSubject.value;
    }
}
