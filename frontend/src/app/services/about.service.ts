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
}

@Injectable({
    providedIn: 'root'
})
export class AboutService {
    private http = inject(HttpClient);
    private apiUrl = '/api';

    // Public API
    getAboutSections(): Observable<AboutSection[]> {
        return this.http.get<AboutSection[]>(`${this.apiUrl}/about-sections`);
    }

    // Admin API
    getAdminAboutSections(): Observable<AboutSection[]> {
        return this.http.get<AboutSection[]>(`${this.apiUrl}/admin/about-sections`);
    }

    addAboutSection(section: AboutSection): Observable<AboutSection> {
        return this.http.post<AboutSection>(`${this.apiUrl}/admin/about-sections`, section);
    }

    updateAboutSection(id: string, section: AboutSection): Observable<AboutSection> {
        return this.http.put<AboutSection>(`${this.apiUrl}/admin/about-sections/${id}`, section);
    }

    deleteAboutSection(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/about-sections/${id}`);
    }
}
