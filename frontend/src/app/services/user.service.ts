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
        const token = sessionStorage.getItem('auth_token');
        return new HttpHeaders({
            'x-auth-token': token || ''
        });
    }

    getDashboardData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
    }

    getOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
    }

    // Admin Methods
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>('/api/admin/users');
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`/api/admin/users/${id}`);
    }
}
