import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let OfferService = class OfferService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiUrl = '/api';
    }
    getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }
    // Public API
    getOffers() {
        return this.http.get(`${this.apiUrl}/offers`);
    }
    // Admin API
    getAllOffersAdmin() {
        return this.http.get(`${this.apiUrl}/admin/offers`, { headers: this.getHeaders() });
    }
    addOffer(offer) {
        return this.http.post(`${this.apiUrl}/admin/offers`, offer, { headers: this.getHeaders() });
    }
    updateOffer(id, offer) {
        return this.http.put(`${this.apiUrl}/admin/offers/${id}`, offer, { headers: this.getHeaders() });
    }
    deleteOffer(id) {
        return this.http.delete(`${this.apiUrl}/admin/offers/${id}`, { headers: this.getHeaders() });
    }
};
OfferService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], OfferService);
export { OfferService };
//# sourceMappingURL=offer.service.js.map