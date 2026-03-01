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

    // Public API
    getFaqs(): Observable<Faq[]> {
        return this.http.get<Faq[]>(`${this.apiUrl}/faqs`);
    }

    // Admin API
    getAdminFaqs(): Observable<Faq[]> {
        return this.http.get<Faq[]>(`${this.apiUrl}/admin/faqs`);
    }

    addFaq(faq: Faq): Observable<Faq> {
        return this.http.post<Faq>(`${this.apiUrl}/admin/faqs`, faq);
    }

    updateFaq(id: string, faq: Faq): Observable<Faq> {
        return this.http.put<Faq>(`${this.apiUrl}/admin/faqs/${id}`, faq);
    }

    deleteFaq(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/faqs/${id}`);
    }
}
