import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Placement {
    _id?: string;
    name: string;
    description: string;
    image: string;
    videoUrl: string;
    features: string[];
    badge: string;
    categoryRoute: string;
    isLocal?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PlacementService {
    private http = inject(HttpClient);
    private apiUrl = '/api';

    // Public API
    getPlacements(): Observable<Placement[]> {
        return this.http.get<Placement[]>(`${this.apiUrl}/placements`);
    }

    // Admin API
    getAdminPlacements(): Observable<Placement[]> {
        return this.http.get<Placement[]>(`${this.apiUrl}/admin/placements`);
    }

    addPlacement(placement: Placement): Observable<Placement> {
        return this.http.post<Placement>(`${this.apiUrl}/admin/placements`, placement);
    }

    updatePlacement(id: string, placement: Placement): Observable<Placement> {
        return this.http.put<Placement>(`${this.apiUrl}/admin/placements/${id}`, placement);
    }

    deletePlacement(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/placements/${id}`);
    }
}
