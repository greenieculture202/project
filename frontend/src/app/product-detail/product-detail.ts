
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

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
    productService = inject(ProductService);
    activeImageIndex = 0;
    showVideo = false; // State to toggle video view
    relatedProducts: Product[] = [];

    // Ugaoo-style planters with pot icons and plant images
    planters = [
        {
            id: 'gropot',
            name: 'GroPot',
            price: '₹249',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/628/628324.png',
            // Grey simple pot
            image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'krish',
            name: 'Krish',
            price: '₹299',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/1892/1892747.png',
            // White ceramic pot
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'kyoto',
            name: 'Kyoto',
            price: '₹299',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/2917/2917995.png',
            // Striped pot
            image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'lagos',
            name: 'Lagos',
            price: '₹349',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/1147/1147767.png',
            // Pot with legs/stand
            image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'diamond',
            name: 'Diamond',
            price: '₹420',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/3076/3076376.png',
            // Geometric/diamond pot
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'roma',
            name: 'Roma',
            price: '₹420',
            thumbnail: 'https://cdn-icons-png.flaticon.com/128/3079/3079155.png',
            // Classic roma pot
            image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80'
        }
    ];

    // Selected planter and its image
    selectedPlanter = 'gropot';
    selectedPrice = '';
    currentPlanterImage = '';
    quantity = 1;
    expandedFeature: string | null = null;

    constructor() {
        this.route.params.subscribe(params => {
            const slug = params['id'];
            if (slug) {
                this.product = this.productService.getProductBySlug(slug);
                if (this.product) {
                    // Set first planter price to product price
                    this.planters[0].price = this.product.price;
                    this.selectedPrice = this.product.price;
                    // Set initial planter image
                    this.currentPlanterImage = this.planters[0].image;

                    // Fetch related products
                    console.log('Fetching related products for category:', this.product.category);
                    if (this.product.category) {
                        this.relatedProducts = this.productService.getRelatedProducts(this.product.category, slug);
                        console.log('Related products found:', this.relatedProducts.length);
                    }
                }
            }
        });
    }

    get thumbnails(): string[] {
        if (!this.product) return [];
        // Show planter images as thumbnails
        return this.planters.map(p => p.image);
    }

    get displayImage(): string {
        // Show current planter's image (plant in selected pot)
        return this.currentPlanterImage || (this.product?.image ?? '');
    }

    setShowVideo(show: boolean) {
        this.showVideo = show;
    }

    setActiveImage(index: number) {
        this.showVideo = false; // Switch back to image view
        this.activeImageIndex = index;
        // Also update current planter when thumbnail clicked
        if (this.planters[index]) {
            this.selectPlanter(this.planters[index].id);
        }
    }

    // Planter selection - changes pot image while plant stays same
    selectPlanter(planterId: string) {
        this.selectedPlanter = planterId; // Changed from selectedPlanterId to selectedPlanter
        const planter = this.planters.find(p => p.id === planterId);
        if (planter) {
            this.selectedPrice = planter.price; // Retained from original
            this.currentPlanterImage = planter.image;
            // Update active thumbnail index
            this.activeImageIndex = this.planters.findIndex(p => p.id === planterId);
            this.showVideo = false; // Ensure video is hidden when selecting planter
        }
    }

    // Quantity handlers
    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    // Cart and Buy actions
    addToCart() {
        alert(`Added ${this.quantity} x ${this.product?.name} (${this.selectedPlanter}) to cart!`);
    }

    buyNow() {
        alert(`Proceeding to buy ${this.quantity} x ${this.product?.name} (${this.selectedPlanter})!`);
    }

    // Toggle feature expansion
    toggleFeature(feature: string) {
        if (this.expandedFeature === feature) {
            this.expandedFeature = null;
        } else {
            this.expandedFeature = feature;
        }
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
