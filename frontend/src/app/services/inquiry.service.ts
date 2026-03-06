import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inquiry {
    _id?: string;
    userId?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    reply?: {
        content: string;
        repliedAt: Date;
        adminId: string;
    };
    status: 'Pending' | 'Replied';
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class InquiryService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    submitInquiry(inquiry: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/inquiries`, inquiry);
    }

    getAllInquiries(): Observable<Inquiry[]> {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.get<Inquiry[]>(`${this.apiUrl}/admin/inquiries`, { headers });
    }

    replyToInquiry(id: string, content: string): Observable<any> {
        const token = sessionStorage.getItem('auth_token');
        const headers = new HttpHeaders().set('x-auth-token', token || '');
        return this.http.put(`${this.apiUrl}/admin/inquiries/${id}/reply`, { content }, { headers });
    }
}
