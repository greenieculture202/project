import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = '/api/user';

    private getHeaders() {
        // Try sessionStorage first (normal login), fall back to localStorage
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        if (!token) {
            console.warn('[UserService] No auth token found in sessionStorage or localStorage!');
        }
        return new HttpHeaders({
            'x-auth-token': token
        });
    }

    getDashboardData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
    }

    getOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
    }

    placeOrder(orderData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders`, orderData, { headers: this.getHeaders() });
    }

    getUserProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
    }

    updateUserProfile(profileData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, profileData, { headers: this.getHeaders() });
    }

    // Admin Methods
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>('/api/admin/users', { headers: this.getHeaders() });
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`/api/admin/users/${id}`, { headers: this.getHeaders() });
    }
}
