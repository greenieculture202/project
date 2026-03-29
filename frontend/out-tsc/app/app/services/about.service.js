import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let AboutService = class AboutService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiUrl = '/api';
    }
    getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }
    // Public API
    getAboutSections() {
        return this.http.get(`${this.apiUrl}/about-sections`);
    }
    // Admin API
    getAdminAboutSections() {
        return this.http.get(`${this.apiUrl}/admin/about-sections`, { headers: this.getHeaders() });
    }
    addAboutSection(section) {
        return this.http.post(`${this.apiUrl}/admin/about-sections`, section, { headers: this.getHeaders() });
    }
    updateAboutSection(id, section) {
        return this.http.put(`${this.apiUrl}/admin/about-sections/${id}`, section, { headers: this.getHeaders() });
    }
    deleteAboutSection(id) {
        return this.http.delete(`${this.apiUrl}/admin/about-sections/${id}`, { headers: this.getHeaders() });
    }
};
AboutService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AboutService);
export { AboutService };
//# sourceMappingURL=about.service.js.map