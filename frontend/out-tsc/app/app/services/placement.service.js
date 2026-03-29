import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
let PlacementService = class PlacementService {
    constructor() {
        this.http = inject(HttpClient);
        this.apiUrl = '/api';
    }
    getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }
    // Public API
    getPlacements() {
        return this.http.get(`${this.apiUrl}/placements`);
    }
    // Admin API
    getAdminPlacements() {
        return this.http.get(`${this.apiUrl}/admin/placements`, { headers: this.getHeaders() });
    }
    addPlacement(placement) {
        return this.http.post(`${this.apiUrl}/admin/placements`, placement, { headers: this.getHeaders() });
    }
    updatePlacement(id, placement) {
        return this.http.put(`${this.apiUrl}/admin/placements/${id}`, placement, { headers: this.getHeaders() });
    }
    deletePlacement(id) {
        return this.http.delete(`${this.apiUrl}/admin/placements/${id}`, { headers: this.getHeaders() });
    }
};
PlacementService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], PlacementService);
export { PlacementService };
//# sourceMappingURL=placement.service.js.map