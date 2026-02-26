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
                name: 'Peace Lily',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Snake Plant',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                image: 'https://images.unsplash.com/photo-1593418105716-4307a8366dca?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Aloe Vera',
                price: '249',
                originalPrice: '399',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76d21?auto=format&fit=crop&w=600&q=80',
                category: 'Bestsellers'
            },
            {
                name: 'Jade Plant',
                price: '349',
                originalPrice: '499',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
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
                name: 'Peace Lily',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Snake Plant',
                price: '499',
                originalPrice: '699',
                discount: '28% OFF',
                image: 'https://images.unsplash.com/photo-1593418105716-4307a8366dca?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Money Plant',
                price: '299',
                originalPrice: '450',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Areca Palm',
                price: '899',
                originalPrice: '1299',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            },
            {
                name: 'Rubber Plant',
                price: '649',
                originalPrice: '899',
                discount: '27% OFF',
                image: 'https://images.unsplash.com/photo-1520412099561-64839ecd0bb3?auto=format&fit=crop&w=600&q=80',
                category: 'Indoor Plants'
            }
        ],
        'Outdoor Plants': [
            {
                name: 'Ashoka Tree',
                price: '1499',
                originalPrice: '1999',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Neem Tree',
                price: '599',
                originalPrice: '799',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1617135038936-3bc99d69f6f1?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Mango Tree',
                price: '1299',
                originalPrice: '1799',
                discount: '27% OFF',
                image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            },
            {
                name: 'Tulsi Plant',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
                category: 'Outdoor Plants'
            }
        ],
        'Gardening Tools': [
            {
                name: 'Hand Trowel',
                price: '249',
                originalPrice: '399',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening Tools'
            },
            {
                name: 'Pruning Shears',
                price: '599',
                originalPrice: '899',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening Tools'
            },
            {
                name: 'Garden Fork',
                price: '299',
                originalPrice: '450',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1599685315640-9ce50450b27c?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening Tools'
            }
        ],
        'Flowering Plants': [
            {
                name: 'Anthurium Red',
                price: '899',
                originalPrice: '1299',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1512423924558-124e4d50937c?auto=format&fit=crop&w=360&q=80',
                category: 'Flowering Plants'
            },
            {
                name: 'Orchid Pink',
                price: '1499',
                originalPrice: '1999',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1534073737927-85f1df9605d2?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants'
            },
            {
                name: 'Jasmine Plant',
                price: '299',
                originalPrice: '450',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1598910008544-77e48b894170?auto=format&fit=crop&w=600&q=80',
                category: 'Flowering Plants'
            }
        ],
        'Gardening': [
            {
                name: 'Rose Plant',
                price: '349',
                originalPrice: '499',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1558036117-15d82e90bd9d?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening'
            },
            {
                name: 'Hibiscus Red',
                price: '249',
                originalPrice: '399',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
                category: 'Gardening'
            }
        ],
        'Accessories': [
            {
                name: 'Ceramic Pot White',
                price: '499',
                originalPrice: '799',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
                category: 'Accessories'
            },
            {
                name: 'Watering Can',
                price: '399',
                originalPrice: '599',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=600&q=80',
                category: 'Accessories'
            }
        ],
        'Soil & Growing Media': [
            {
                name: 'Organic Potting Mix',
                price: '299',
                originalPrice: '499',
                discount: '40% OFF',
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
                category: 'Soil & Growing Media'
            },
            {
                name: 'Coco Peat Block',
                price: '199',
                originalPrice: '299',
                discount: '33% OFF',
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
                category: 'Soil & Growing Media'
            }
        ],
        'Fertilizers & Nutrients': [
            {
                name: 'Organic Liquid Fertilizer',
                price: '349',
                originalPrice: '499',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
                category: 'Fertilizers & Nutrients'
            },
            {
                name: 'Vermicompost Bag',
                price: '249',
                originalPrice: '399',
                discount: '37% OFF',
                image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
                category: 'Fertilizers & Nutrients'
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
        ],
        'Seeds Kit': [
            {
                name: 'Zinnia Elegans Seeds',
                price: '199',
                originalPrice: '599',
                discount: '71% OFF',
                image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop',
                category: 'Seeds Kit'
            },
            {
                name: 'Marigold French Seeds',
                price: '89',
                originalPrice: '299',
                discount: '70% OFF',
                image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
                category: 'Seeds Kit'
            },
            {
                name: 'Cosmos Mixed Seeds',
                price: '79',
                originalPrice: '299',
                discount: '73% OFF',
                image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop',
                category: 'Seeds Kit'
            },
            {
                name: 'Sunflower Dwarf Seeds',
                price: '119',
                originalPrice: '399',
                discount: '70% OFF',
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400&h=400&fit=crop',
                category: 'Seeds Kit'
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
