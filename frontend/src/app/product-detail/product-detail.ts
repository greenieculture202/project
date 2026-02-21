
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css'
})
export class ProductDetailComponent {
    product: Product | undefined;
    route = inject(ActivatedRoute);
    router = inject(Router);
    productService = inject(ProductService);
    authService = inject(AuthService);
    notificationService = inject(NotificationService);

    activeImageIndex = 0;
    showVideo = false; // State to toggle video view
    relatedProducts: Product[] = [];
    isLoading = true; // Loading state
    expandedFaqs = new Set<string>(); // Tracks open FAQ sections

    // Ugaoo-style planters with pot icons and plant images
    planters = [
        {
            id: 'gropot',
            name: 'GroPot',
            price: '₹249',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/628/628324.png',
            image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'krish',
            name: 'Krish',
            price: '₹299',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/1892/1892747.png',
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'kyoto',
            name: 'Kyoto',
            price: '₹299',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/2917/2917995.png',
            image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'lagos',
            name: 'Lagos',
            price: '₹349',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/1147/1147767.png',
            image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'diamond',
            name: 'Diamond',
            price: '₹420',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/3076/3076376.png',
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'roma',
            name: 'Roma',
            price: '₹420',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/3079/3079155.png',
            image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
        }
    ];

    selectedPlanter = 'gropot';
    selectedPrice = '';
    currentPlanterImage = '';
    quantity = 1;

    constructor() {
        this.route.params.subscribe(params => {
            const slug = params['id'];
            if (slug) {
                window.scrollTo(0, 0);
                this.isLoading = true;
                this.productService.getProductBySlug(slug).subscribe({
                    next: (product) => {
                        this.product = product || undefined;
                        this.isLoading = false;
                        if (this.product) {
                            this.planters[0].price = this.product.price;
                            this.selectedPrice = this.product.price;
                            this.currentPlanterImage = this.planters[0].image;
                            if (this.product.category) {
                                this.productService.getRelatedProducts(this.product.category, 4).subscribe(related => {
                                    this.relatedProducts = related;
                                });
                            }
                        }
                    },
                    error: (err) => {
                        console.error('Error loading product', err);
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    get thumbnails(): string[] {
        if (!this.product) return [];
        return this.planters.map(p => p.image);
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
        if (this.planters[index]) {
            this.selectPlanter(this.planters[index].id);
        }
    }

    selectPlanter(planterId: string) {
        this.selectedPlanter = planterId;
        const planter = this.planters.find(p => p.id === planterId);
        if (planter) {
            this.selectedPrice = planter.price;
            this.currentPlanterImage = planter.image;
            this.activeImageIndex = this.planters.findIndex(p => p.id === planterId);
            this.showVideo = false;
        }
    }

    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    toggleFaq(faqId: string) {
        if (this.expandedFaqs.has(faqId)) {
            this.expandedFaqs.delete(faqId);
        } else {
            this.expandedFaqs.add(faqId);
        }
    }

    isFaqExpanded(faqId: string): boolean {
        return this.expandedFaqs.has(faqId);
    }

    addToCart() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show(
                'Please login first to add items to your cart.',
                'Sign In Required',
                'info',
                'standard',
                '/login'
            );
            return;
        }
        this.notificationService.show(
            `Successfully added ${this.quantity} x ${this.product?.name} to your botanical collection!`,
            'Added to Cart',
            'success',
            'cart'
        );
    }

    buyNow() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show(
                'Please login first to proceed with the purchase.',
                'Sign In Required',
                'info',
                'standard',
                '/login'
            );
            return;
        }
        this.notificationService.show(
            `Proceeding to checkout for ${this.quantity} x ${this.product?.name}.`,
            'Checkout',
            'success',
            'cart'
        );
    }

    categoryFaqs: { [key: string]: any[] } = {
        'Indoor': [
            { id: 'water', title: 'Water once a week', icon: 'https://cdn-icons-png.flaticon.com/128/3105/3105807.png', content: 'Always check your plants before watering, the topsoil should be dry to touch. Indoor plants generally need less water.' },
            { id: 'sunlight', title: 'Needs bright indirect sunlight', icon: 'https://cdn-icons-png.flaticon.com/128/6974/6974854.png', content: 'Place your plants on window sills where it can get the brightest possible indirect light. Avoid direct harsh sun.' },
            { id: 'pets', title: 'Keep out of pet reach', icon: 'https://cdn-icons-png.flaticon.com/128/1998/1998592.png', content: 'This plant and your furry friends cannot become the best buds. Some species can be toxic if ingested.' },
            { id: 'beginner', title: 'Needs Gardening experience', icon: 'https://cdn-icons-png.flaticon.com/128/2491/2491418.png', content: 'This plant is slightly delicate and rewarding with the right care. Perfect for those who love monitoring their plants.' }
        ],
        'Outdoor': [
            { id: 'water', title: 'Water daily in summers', icon: 'https://cdn-icons-png.flaticon.com/128/3105/3105807.png', content: 'Outdoor plants evaporate water quickly. Check soil twice a day during peak summer.' },
            { id: 'sunlight', title: 'Thrives in direct sunlight', icon: 'https://cdn-icons-png.flaticon.com/128/6974/6974854.png', content: 'Requires at least 4-6 hours of direct morning or filtered afternoon sun for the best growth.' },
            { id: 'pets', title: 'Safe for garden pets', icon: 'https://cdn-icons-png.flaticon.com/128/1998/1998592.png', content: 'Generally outdoor hardy plants are safe, but always monitor your pets around new greenery.' },
            { id: 'beginner', title: 'Beginner Friendly', icon: 'https://cdn-icons-png.flaticon.com/128/1162/1162283.png', content: 'Very hardy and difficult to kill. Great for first-time gardeners.' }
        ],
        'Flowering': [
            { id: 'water', title: 'Keep soil moist', icon: 'https://cdn-icons-png.flaticon.com/128/3105/3105807.png', content: 'Flowering plants need consistent moisture to support bloom production. Don\'t let it dry out completely.' },
            { id: 'sunlight', title: 'Needs 6+ hours of sun', icon: 'https://cdn-icons-png.flaticon.com/128/6974/6974854.png', content: 'Sunlight is the fuel for flowers. More sun usually means more vibrant and frequent blooms.' },
            { id: 'pets', title: 'Fragrant & Pet safe', icon: 'https://cdn-icons-png.flaticon.com/128/1998/1998592.png', content: 'Beautiful and safe for your home environment. Enjoy the fragrance worry-free.' },
            { id: 'beginner', title: 'Flowering expert', icon: 'https://cdn-icons-png.flaticon.com/128/2491/2491418.png', content: 'Needs deadheading (pruning spent flowers) to keep blooming throughout the season.' }
        ]
    };

    get currentFaqs(): any[] {
        if (!this.product?.category) return this.categoryFaqs['Indoor'];
        const cat = this.product.category;
        if (cat.includes('Outdoor')) return this.categoryFaqs['Outdoor'];
        if (cat.includes('Flowering')) return this.categoryFaqs['Flowering'];
        if (cat.includes('Indoor')) return this.categoryFaqs['Indoor'];
        return this.categoryFaqs['Indoor'];
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
