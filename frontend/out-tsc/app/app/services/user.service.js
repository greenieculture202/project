import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
let UserService = class UserService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiUrl = '/api/user';
    }
    getHeaders() {
        // Try sessionStorage first (normal login), fall back to localStorage
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        if (!token) {
            console.warn('[UserService] No auth token found in sessionStorage or localStorage!');
        }
        return new HttpHeaders({
            'x-auth-token': token
        });
    }
    getDashboardData() {
        return this.http.get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
    }
    getOrders() {
        return this.http.get(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
    }
    placeOrder(orderData) {
        return this.http.post(`${this.apiUrl}/orders`, orderData, { headers: this.getHeaders() });
    }
    getUserProfile() {
        return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
    }
    updateUserProfile(profileData) {
        return this.http.put(`${this.apiUrl}/profile`, profileData, { headers: this.getHeaders() });
    }
    // Admin Methods
    getAllUsers() {
        return this.http.get('/api/admin/users', { headers: this.getHeaders() });
    }
    deleteUser(id) {
        return this.http.delete(`/api/admin/users/${id}`, { headers: this.getHeaders() });
    }
    updateOrderStatus(orderId, status) {
        return this.http.put(`/api/admin/orders/${orderId}/status`, { status }, { headers: this.getHeaders() });
    }
    blockUser(id, isBlocked) {
        return this.http.put(`/api/admin/users/${id}/block`, { isBlocked }, { headers: this.getHeaders() });
    }
    getPublicCouriers() {
        return this.http.get('/api/couriers/public');
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map