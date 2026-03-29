import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let FaqService = class FaqService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiUrl = '/api';
    }
    getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }
    // Public API
    getFaqs() {
        return this.http.get(`${this.apiUrl}/faqs`);
    }
    // Admin API
    getAdminFaqs() {
        return this.http.get(`${this.apiUrl}/admin/faqs`, { headers: this.getHeaders() });
    }
    addFaq(faq) {
        return this.http.post(`${this.apiUrl}/admin/faqs`, faq, { headers: this.getHeaders() });
    }
    updateFaq(id, faq) {
        return this.http.put(`${this.apiUrl}/admin/faqs/${id}`, faq, { headers: this.getHeaders() });
    }
    deleteFaq(id) {
        return this.http.delete(`${this.apiUrl}/admin/faqs/${id}`, { headers: this.getHeaders() });
    }
};
FaqService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FaqService);
export { FaqService };
//# sourceMappingURL=faq.service.js.map