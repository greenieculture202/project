
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
    product: Product | undefined;
    route = inject(ActivatedRoute);
    router = inject(Router);
    productService = inject(ProductService);
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    cartService = inject(CartService);

    activeImageIndex = 0;
    showVideo = false;
    relatedProducts: Product[] = [];
    isLoading = true;
    expandedFaqs = new Set<string>();

    planters = [
        { id: 'gropot', name: 'GroPot', price: '₹249', thumbnail: 'https://cdn-icons-png.flaticon.com/64/628/628324.png', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=400&q=60' },
        { id: 'krish', name: 'Krish', price: '₹299', thumbnail: 'https://cdn-icons-png.flaticon.com/64/1892/1892747.png', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=60' },
        { id: 'kyoto', name: 'Kyoto', price: '₹299', thumbnail: 'https://cdn-icons-png.flaticon.com/64/2917/2917995.png', image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=400&q=60' },
        { id: 'lagos', name: 'Lagos', price: '₹349', thumbnail: 'https://cdn-icons-png.flaticon.com/64/1147/1147767.png', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=400&q=60' },
        { id: 'diamond', name: 'Diamond', price: '₹420', thumbnail: 'https://cdn-icons-png.flaticon.com/64/3076/3076376.png', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=60' },
        { id: 'roma', name: 'Roma', price: '₹420', thumbnail: 'https://cdn-icons-png.flaticon.com/64/3079/3079155.png', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=60' }
    ];

    selectedPlanter = 'gropot';
    selectedPrice = '';
    currentPlanterImage = '';
    quantity = 1;

    constructor() { }

    ngOnInit() {
        this.route.params.subscribe((params: any) => {
            const slug = params['id'];
            if (slug) {
                window.scrollTo(0, 0);

                // Check cache for instant load
                const cachedProduct = (this.productService as any).productCache?.get(slug);
                if (cachedProduct) {
                    this.product = cachedProduct;
                    this.isLoading = false;
                    this.setupProductDetails();
                } else {
                    this.isLoading = true;
                }

                this.productService.getProductBySlug(slug).subscribe({
                    next: (product: any) => {
                        this.product = product || undefined;
                        this.isLoading = false;
                        if (this.product) {
                            this.setupProductDetails();
                        }
                    },
                    error: (err: any) => {
                        console.error('Error loading product', err);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    setupProductDetails() {
        if (!this.product) return;
        this.planters[0].price = this.product.price;
        this.selectedPrice = this.product.price;
        this.currentPlanterImage = (this.product as any).hoverImage || this.product.image;

        if (this.product.category) {
            this.productService.getRelatedProducts(this.product.category, 4).subscribe(related => {
                this.relatedProducts = related;
            });
        }
    }

    get thumbnails(): string[] {
        if (!this.product) return [];
        return [this.product.image, ...this.planters.map(p => p.image)];
    }

    get displayImage(): string {
        return this.currentPlanterImage || (this.product?.image ?? '');
    }

    setShowVideo(show: boolean) {
        this.showVideo = show;
    }

    setActiveImage(index: number) {
        this.showVideo = false;
        this.activeImageIndex = index;
        if (index === 0) {
            this.currentPlanterImage = this.product?.image || '';
        } else if (this.planters[index - 1]) {
            this.selectPlanter(this.planters[index - 1].id);
        }
    }

    selectPlanter(planterId: string) {
        this.selectedPlanter = planterId;
        const planter = this.planters.find(p => p.id === planterId);
        if (planter) {
            this.selectedPrice = planter.price;
            this.currentPlanterImage = planter.image;
            this.activeImageIndex = this.planters.findIndex(p => p.id === planterId) + 1;
            this.showVideo = false;
        }
    }

    increaseQuantity() { this.quantity++; }
    decreaseQuantity() { if (this.quantity > 1) this.quantity--; }

    toggleFaq(faqId: string) {
        if (this.expandedFaqs.has(faqId)) this.expandedFaqs.delete(faqId);
        else this.expandedFaqs.add(faqId);
    }

    isFaqExpanded(faqId: string): boolean { return this.expandedFaqs.has(faqId); }

    addToCart() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show('Please login first to add items into cart.', 'Sign In Required', 'info', 'standard', '/login');
            return;
        }
        if (this.product) {
            this.cartService.addItem(this.product, this.quantity, this.selectedPlanter);
            this.notificationService.show(`"${this.product.name}" added to cart.`, 'Success', 'success', 'cart');
        }
    }

    buyNow() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show('Please login first to proceed with the purchase.', 'Sign In Required', 'info', 'standard', '/login');
            return;
        }
        if (this.product) {
            // Add to cart and push to checkout
            this.cartService.addItem(this.product, this.quantity, this.selectedPlanter);
            this.router.navigate(['/checkout']);
        }
    }

    categoryFaqs: { [key: string]: any[] } = {
        'Indoor': [
            { id: 'water', title: 'Water once a week', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Always check your plants before watering, the topsoil should be dry to touch.' },
            { id: 'sunlight', title: 'Needs bright indirect sunlight', icon: 'https://cdn-icons-png.flaticon.com/64/6974/6974854.png', content: 'Place your plants on window sills where it can get the brightest possible indirect light.' },
            { id: 'pets', title: 'Keep out of pet reach', icon: 'https://cdn-icons-png.flaticon.com/64/1998/1998592.png', content: 'Some species can be toxic if ingested.' },
            { id: 'beginner', title: 'Great for beginners', icon: 'https://cdn-icons-png.flaticon.com/64/2491/2491418.png', content: 'Hardy and easy to care for.' }
        ],
        'Outdoor': [
            { id: 'water', title: 'Water daily in summers', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Outdoor plants evaporate water quickly.' },
            { id: 'sunlight', title: 'Thrives in direct sunlight', icon: 'https://cdn-icons-png.flaticon.com/64/6974/6974854.png', content: 'Requires at least 4-6 hours of direct sun.' },
            { id: 'pets', title: 'Safe for garden pets', icon: 'https://cdn-icons-png.flaticon.com/64/1998/1998592.png', content: 'Generally hardy and safe.' },
            { id: 'beginner', title: 'Beginner Friendly', icon: 'https://cdn-icons-png.flaticon.com/64/1162/1162283.png', content: 'Very hardy and difficult to kill.' }
        ]
    };

    get currentFaqs(): any[] {
        if (!this.product?.category) return this.categoryFaqs['Indoor'];
        const cat = this.product.category;
        if (cat.includes('Outdoor')) return this.categoryFaqs['Outdoor'];
        return this.categoryFaqs['Indoor'];
    }

    createSlug(name: string): string { return this.productService.createSlug(name); }
    getTagClass(tag: string): string { return tag.toLowerCase().replace(/\s+/g, '-'); }
}
