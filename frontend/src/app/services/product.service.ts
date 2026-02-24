import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

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
    private apiUrl = '/api';

    // Fallback mock data in case backend is not available
    private fallbackProducts: { [key: string]: Product[] } = {
        'Bestsellers': [
            {
                name: 'Offline-Majestic Zen Garden',
                price: '1999',
                originalPrice: '2499',
                discount: '20% OFF',
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            }
        ],
        'XL Plants': [
            {
                name: 'Fiddle Leaf Fig XL',
                price: '2499',
                originalPrice: '3299',
                discount: '24% OFF',
                image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            },
            {
                name: 'Rubber Plant XL',
                price: '1999',
                originalPrice: '2799',
                discount: '28% OFF',
                image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            },
            {
                name: 'Monstera Deliciosa XL',
                price: '2999',
                originalPrice: '3999',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            },
            {
                name: 'Bird of Paradise XL',
                price: '3499',
                originalPrice: '4499',
                discount: '22% OFF',
                image: 'https://images.unsplash.com/photo-1617135038936-3bc99d69f6f1?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            },
            {
                name: 'Snake Plant XL',
                price: '1799',
                originalPrice: '2299',
                discount: '21% OFF',
                image: 'https://images.unsplash.com/photo-1593418105716-4307a8366dca?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            },
            {
                name: 'Dragon Tree XL',
                price: '2199',
                originalPrice: '2999',
                discount: '26% OFF',
                image: 'https://images.unsplash.com/photo-1544436484-935035bb2ed7?auto=format&fit=crop&w=800&q=80',
                category: 'XL Plants'
            }
        ],
        'Indoor Plants': [
            {
                name: 'Offline-Peace Lily',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            }
        ],
        'Gardening Tools': [
            {
                name: 'Offline-Professional Trowel',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening Tools'
            }
        ],
        'Flower Seeds': [
            {
                name: 'Offline-Marigold Seeds',
                price: '49',
                originalPrice: '99',
                discount: '50% OFF',
                image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80',
                category: 'Flower Seeds'
            }
        ]
    };

    // Get all products or products by category
    getProducts(category?: string, limit?: number): Observable<Product[]> {
        const cacheKey = `${category || 'all'}-${limit || 'none'}`;
        if (this.categoryCache.has(cacheKey)) {
            return of(this.categoryCache.get(cacheKey)!);
        }

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
            timeout(10000), // Enforce 10 seconds timeout so spinner clears
            map(products => {
                // Populate individual cache
                products.forEach(p => {
                    const slug = p.slug || this.convertToSlug(p.name);
                    this.productCache.set(slug, p);
                });
                // Populate category cache
                this.categoryCache.set(cacheKey, products);
                return products;
            }),
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
            map(productMap => {
                Object.values(productMap).forEach(products => {
                    products.forEach(p => {
                        const slug = p.slug || this.convertToSlug(p.name);
                        this.productCache.set(slug, p);
                    });
                });
                return productMap;
            }),
            catchError(error => {
                console.error('Error fetching product map:', error);
                return of(this.fallbackProducts);
            })
        );
    }

    // Cache for products by category/query
    private categoryCache = new Map<string, Product[]>();

    // Cache for product details
    private productCache = new Map<string, Product>();

    // Get product by slug
    getProductBySlug(slug: string): Observable<Product | null> {
        if (this.productCache.has(slug)) {
            return of(this.productCache.get(slug)!);
        }

        return this.http.get<Product>(`${this.apiUrl}/products/slug/${slug}`).pipe(
            map(product => {
                if (product && product._id) {
                    this.productCache.set(slug, product);
                    return product;
                }
                return null;
            }),
            catchError(error => {
                console.error('Error fetching product by slug:', error);

                // Fallback attempt: if backend fails, check if we have it in our static fallback list
                for (const category in this.fallbackProducts) {
                    const found = this.fallbackProducts[category].find(
                        p => (p.slug === slug) || (this.convertToSlug(p.name) === slug)
                    );
                    if (found) {
                        this.productCache.set(slug, found);
                        return of(found);
                    }
                }

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

    private categoriesCache: string[] | null = null;

    // Get categories
    getCategories(): Observable<string[]> {
        if (this.categoriesCache) {
            return of(this.categoriesCache);
        }
        return this.http.get<string[]>(`${this.apiUrl}/products/categories`).pipe(
            map(categories => {
                this.categoriesCache = categories;
                return categories;
            }),
            catchError(error => {
                console.error('Error fetching categories:', error);
                // Fallback to static list if available
                return of(Object.keys(this.fallbackProducts));
            })
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
            map(products => products.map(p => {
                const sl = p.slug || this.convertToSlug(p.name);
                const prod = { ...p, slug: sl };
                this.productCache.set(sl, prod);
                return prod;
            }))
        );
    }

    // Get related products by category
    getRelatedProducts(category?: string, limit: number = 4): Observable<Product[]> {
        if (!category) {
            return of([]);
        }

        const cacheKey = `related-${category}-${limit}`;
        if (this.categoryCache.has(cacheKey)) {
            return of(this.categoryCache.get(cacheKey)!);
        }

        // Use the limit param in the API call
        return this.http.get<Product[]>(`${this.apiUrl}/products?category=${encodeURIComponent(category)}&limit=${limit}`).pipe(
            map(products => {
                products.forEach(p => {
                    const slug = p.slug || this.convertToSlug(p.name);
                    this.productCache.set(slug, p);
                });
                this.categoryCache.set(cacheKey, products);
                return products;
            })
        );
    }
}
