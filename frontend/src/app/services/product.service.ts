import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
    _id?: string;
    image: string;
    hoverImage?: string;
    name: string;
    price: string;
    originalPrice?: string;
    discount?: string;
    discountPercent?: number;
    category?: string;
    videoUrl?: string;
    tags?: string[];
    slug?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api';

    // Fallback mock data in case backend is not available
    private fallbackProducts: { [key: string]: Product[] } = {
        'Bestsellers': [
            {
                name: 'Majestic Zen Garden',
                price: '1999',
                originalPrice: '2499',
                discount: '20% OFF',
                discountPercent: 20,
                image: 'https://tse2.mm.bing.net/th/id/OIP.X3jDS9J58Q4ilo4vgjh-RAHaE5?rs=1&pid=ImgDetMain&o=7&rm=3',
                hoverImage: 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg',
                category: 'Bestsellers',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                tags: ['Easy Care', 'Modern Decor', 'Perfect Gift']
            }
        ]
    };

    // Get all products or products by category
    getProducts(category?: string, limit?: number): Observable<Product[]> {
        let url = `${this.apiUrl}/products`;
        const params: string[] = [];

        if (category) {
            params.push(`category=${encodeURIComponent(category)}`);
        }
        if (limit) {
            params.push(`limit=${limit}`);
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return this.http.get<Product[]>(url).pipe(
            catchError(error => {
                console.error('Error fetching products:', error);
                // Return fallback data if backend is unavailable
                return of(category ? (this.fallbackProducts[category] || []) : []);
            })
        );
    }

    // Get all products grouped by category
    getAllProductsMap(): Observable<{ [key: string]: Product[] }> {
        return this.http.get<{ [key: string]: Product[] }>(`${this.apiUrl}/products/map`).pipe(
            catchError(error => {
                console.error('Error fetching product map:', error);
                return of(this.fallbackProducts);
            })
        );
    }

    // Cache for product details
    private productCache = new Map<string, Product>();

    // Get product by slug
    getProductBySlug(slug: string): Observable<Product | null> {
        if (this.productCache.has(slug)) {
            return of(this.productCache.get(slug)!);
        }

        return this.http.get<Product>(`${this.apiUrl}/products/slug/${slug}`).pipe(
            map(product => {
                if (product) {
                    this.productCache.set(slug, product);
                }
                return product;
            }),
            catchError(error => {
                console.error('Error fetching product by slug:', error);
                return of(null);
            })
        );
    }

    // Get product by name (for backward compatibility)
    getProductByName(name: string): Observable<Product | null> {
        const slug = this.convertToSlug(name);
        return this.getProductBySlug(slug);
    }

    // Helper method to convert name to slug
    private convertToSlug(name: string): string {
        if (!name) return '';
        return name
            .toLowerCase()
            .replace(/\(([^)]+)\)/g, '$1') // Remove parentheses but keep content
            .replace(/[^a-z0-9\s-]/g, '') // Remove remaining special characters
            .trim()
            .replace(/\s+/g, '-'); // Replace spaces with hyphens
    }

    // Get categories
    getCategories(): Observable<string[]> {
        return this.getAllProductsMap().pipe(
            map(productMap => Object.keys(productMap))
        );
    }

    // Public helper method to convert name to slug (for components)
    createSlug(name: string): string {
        return this.convertToSlug(name);
    }

    // Search products efficiently
    searchProducts(term: string): Observable<Product[]> {
        if (!term || term.length < 2) return of([]);
        return this.http.get<Product[]>(`${this.apiUrl}/products/search?q=${encodeURIComponent(term)}`).pipe(
            map(products => products.map(p => ({ ...p, slug: p.slug || this.convertToSlug(p.name) })))
        );
    }

    // Get related products by category
    getRelatedProducts(category?: string, limit: number = 4): Observable<Product[]> {
        if (!category) {
            return of([]);
        }
        // Use the limit param in the API call
        return this.http.get<Product[]>(`${this.apiUrl}/products?category=${encodeURIComponent(category)}&limit=${limit}`);
    }
}
