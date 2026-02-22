import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
    size?: string;
    planter?: string;
    tags?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);
    private apiUrl = 'http://127.0.0.1:5000/api/cart';

    private itemsSignal = signal<CartItem[]>([]);
    private isOpenSignal = signal(false);

    items = computed(() => this.itemsSignal());
    isOpen = computed(() => this.isOpenSignal());

    totalItems = computed(() => this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0));

    totalAmount = computed(() => this.itemsSignal().reduce((acc, item) => acc + (item.price * item.quantity), 0));

    totalSavings = computed(() => {
        return this.itemsSignal().reduce((acc, item) => {
            if (item.originalPrice) {
                return acc + ((item.originalPrice - item.price) * item.quantity);
            }
            return acc;
        }, 0);
    });

    open() {
        this.isOpenSignal.set(true);
    }

    close() {
        this.isOpenSignal.set(false);
    }

    toggle() {
        this.isOpenSignal.set(!this.isOpenSignal());
    }
    constructor() {
        // Load initial state from LocalStorage (for guests or quick start)
        const savedCart = localStorage.getItem('cart_items');
        if (savedCart) {
            try {
                this.itemsSignal.set(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing saved cart', e);
            }
        }

        // Persist change to LocalStorage and Backend (if logged in)
        effect(() => {
            const currentItems = this.itemsSignal();
            localStorage.setItem('cart_items', JSON.stringify(currentItems));

            // Only save to backend if token exists
            if (sessionStorage.getItem('auth_token')) {
                this.saveToBackend(currentItems);
            }
        });
    }

    syncWithBackend() {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        const headers = new HttpHeaders().set('x-auth-token', token);
        this.http.get<CartItem[]>(this.apiUrl, { headers }).subscribe({
            next: (items) => {
                if (items && items.length > 0) {
                    this.itemsSignal.set(items);
                }
            },
            error: (err) => console.error('Error syncing cart from backend:', err)
        });
    }

    private saveToBackend(items: CartItem[]) {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        const headers = new HttpHeaders().set('x-auth-token', token);
        this.http.post(this.apiUrl, { cart: items }, { headers }).subscribe({
            error: (err) => console.error('Error saving cart to backend:', err)
        });
    }

    addItem(product: any, quantity: number, planter?: string) {
        const currentItems = this.itemsSignal();

        // Robust price parsing: Extract all digits and decimal points
        const parsePrice = (priceStr: any) => {
            if (typeof priceStr === 'number') return priceStr;
            const clean = String(priceStr || '0').replace(/[^\d.]/g, '');
            return parseFloat(clean) || 0;
        };

        const price = parsePrice(product.price);
        const originalPrice = product.originalPrice ? parsePrice(product.originalPrice) : undefined;

        const productId = product.id || product._id;
        const existingItemIndex = currentItems.findIndex(item =>
            item.productId === productId && item.planter === planter
        );

        if (existingItemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += quantity;
            this.itemsSignal.set(updatedItems);
        } else {
            const newItem: CartItem = {
                id: Math.random().toString(36).substr(2, 9),
                productId: productId,
                name: product.name,
                price: price,
                originalPrice: originalPrice,
                image: product.image,
                quantity: quantity,
                planter: planter,
                tags: product.tags
            };
            this.itemsSignal.set([...currentItems, newItem]);
        }

        // Removed automatic open() as per user request
        // this.open();
    }

    removeItem(itemId: string) {
        this.itemsSignal.set(this.itemsSignal().filter(item => item.id !== itemId));
    }

    updateQuantity(itemId: string, quantity: number) {
        if (quantity < 1) {
            this.removeItem(itemId);
            return;
        }

        const updatedItems = this.itemsSignal().map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        this.itemsSignal.set(updatedItems);
    }

    clear() {
        this.itemsSignal.set([]);
    }
}
