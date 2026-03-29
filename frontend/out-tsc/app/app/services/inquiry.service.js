import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
let InquiryService = class InquiryService {
    constructor(http) {
        this.http = http;
        this.apiUrl = '/api';
    }
    submitInquiry(inquiry) {
        return this.http.post(`${this.apiUrl}/inquiries`, inquiry);
    }
    getAllInquiries() {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.get(`${this.apiUrl}/admin/inquiries`, { headers });
    }
    replyToInquiry(id, content) {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.put(`${this.apiUrl}/admin/inquiries/${id}/reply`, { content }, { headers });
    }
};
InquiryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], InquiryService);
export { InquiryService };
//# sourceMappingURL=inquiry.service.js.map