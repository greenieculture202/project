import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offer {
    _id?: string;
    badge: string;
    title: string;
    subtitle: string;
    discountLine?: string;
    description?: string;
    features?: string[];
    ctaText?: string;
    ctaLink?: string;
    image: string;
    cardBg?: string;
    accentColor?: string;
    accentLight?: string;
    accentText?: string;
    tag?: string;
    tagBg?: string;
    tagText?: string;
    timer?: string;
    timerBg?: string;
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private http = inject(HttpClient);
    private apiUrl = '/api';

    private getHeaders() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
        return { 'x-auth-token': token };
    }

    // Public API
    getOffers(): Observable<Offer[]> {
        return this.http.get<Offer[]>(`${this.apiUrl}/offers`);
    }

    // Admin API
    getAllOffersAdmin(): Observable<Offer[]> {
        return this.http.get<Offer[]>(`${this.apiUrl}/admin/offers`, { headers: this.getHeaders() });
    }

    addOffer(offer: Offer): Observable<Offer> {
        return this.http.post<Offer>(`${this.apiUrl}/admin/offers`, offer, { headers: this.getHeaders() });
    }

    updateOffer(id: string, offer: Offer): Observable<Offer> {
        return this.http.put<Offer>(`${this.apiUrl}/admin/offers/${id}`, offer, { headers: this.getHeaders() });
    }

    deleteOffer(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/offers/${id}`, { headers: this.getHeaders() });
    }
}
