import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AboutSection {
    _id?: string;
    type: string;
    title: string;
    content: string;
    icon: string;
    image: string;
    author: string;
    order?: number;
    createdAt?: Date;
    isImmediate?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AboutService {
    private http = inject(HttpClient);
    private apiUrl = '/api';

    private getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }

    // Public API
    getAboutSections(): Observable<AboutSection[]> {
        return this.http.get<AboutSection[]>(`${this.apiUrl}/about-sections`);
    }

    // Admin API
    getAdminAboutSections(): Observable<AboutSection[]> {
        return this.http.get<AboutSection[]>(`${this.apiUrl}/admin/about-sections`, { headers: this.getHeaders() });
    }

    addAboutSection(section: AboutSection): Observable<AboutSection> {
        return this.http.post<AboutSection>(`${this.apiUrl}/admin/about-sections`, section, { headers: this.getHeaders() });
    }

    updateAboutSection(id: string, section: AboutSection): Observable<AboutSection> {
        return this.http.put<AboutSection>(`${this.apiUrl}/admin/about-sections/${id}`, section, { headers: this.getHeaders() });
    }

    deleteAboutSection(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/about-sections/${id}`, { headers: this.getHeaders() });
    }
}
