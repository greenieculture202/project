import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Faq {
    _id?: string;
    question: string;
    answer: string;
    category: string;
    order?: number;
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class FaqService {
    private http = inject(HttpClient);
    private apiUrl = '/api';

    private getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }

    // Public API
    getFaqs(): Observable<Faq[]> {
        return this.http.get<Faq[]>(`${this.apiUrl}/faqs`);
    }

    // Admin API
    getAdminFaqs(): Observable<Faq[]> {
        return this.http.get<Faq[]>(`${this.apiUrl}/admin/faqs`, { headers: this.getHeaders() });
    }

    addFaq(faq: Faq): Observable<Faq> {
        return this.http.post<Faq>(`${this.apiUrl}/admin/faqs`, faq, { headers: this.getHeaders() });
    }

    updateFaq(id: string, faq: Faq): Observable<Faq> {
        return this.http.put<Faq>(`${this.apiUrl}/admin/faqs/${id}`, faq, { headers: this.getHeaders() });
    }

    deleteFaq(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/faqs/${id}`, { headers: this.getHeaders() });
    }
}
