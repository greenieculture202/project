import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { CartService } from '../services/cart.service';
import { OFFER_RULES, CATEGORY_TO_OFFER } from '../services/offer-rules';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
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
    isDescriptionExpanded = false;
    expandedFaqs = new Set<string>();

    toggleDescription() {
        this.isDescriptionExpanded = !this.isDescriptionExpanded;
    }

    selectedWeight = '';
    selectedPrice = '';
    currentPlanterImage = '';
    quantity = 1;
    isGift = false;

    seedWeights: any[] = [];

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

        const cat = this.product.category || '';
        const isWeightBased = cat.includes('Seeds') ||
            cat.includes('Soil') ||
            cat.includes('Fertilizers') ||
            cat.includes('Nutrients');

        if (isWeightBased) {
            this.setupWeightVariants();
        } else {
            this.selectedPrice = this.product.price;
            this.currentPlanterImage = this.product.image;
        }

        if (this.product.category) {
            this.productService.getRelatedProducts(this.product.category, 4).subscribe(related => {
                this.relatedProducts = related;
            });
        }
    }

    setupWeightVariants() {
        if (!this.product) return;

        if (this.product.variants && this.product.variants.length > 0) {
            this.seedWeights = this.product.variants;
        } else {
            const basePrice = parseFloat(String(this.product.price).replace(/[^\d.]/g, '')) || 50;
            this.seedWeights = [
                { name: '250g', price: `₹${basePrice}` },
                { name: '500g', price: `₹${Math.round(basePrice * 1.8)}` },
                { name: '1kg', price: `₹${Math.round(basePrice * 3.2)}` },
                { name: '2kg', price: `₹${Math.round(basePrice * 6)}` },
                { name: '5kg', price: `₹${Math.round(basePrice * 14)}` },
                { name: '10kg', price: `₹${Math.round(basePrice * 26)}` }
            ];
        }

        this.selectedWeight = this.seedWeights[0].name;
        this.selectedPrice = this.seedWeights[0].price;
    }

    get thumbnails(): string[] {
        if (!this.product) return [];
        const allImages = [this.product.image, ...(this.product.images || [])];
        return [...new Set(allImages)];
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

        const additionalImages = this.product?.images || [];
        const totalProductPics = 1 + additionalImages.length;

        if (index === 0) {
            this.currentPlanterImage = this.product?.image || '';
        } else if (index < totalProductPics) {
            this.currentPlanterImage = additionalImages[index - 1];
        }
    }

    selectWeight(weightName: string) {
        this.selectedWeight = weightName;
        const weight = this.seedWeights.find(w => w.name === weightName);
        if (weight) {
            this.selectedPrice = weight.price;
        }
    }

    increaseQuantity() {
        if (this.quantity < 20) {
            this.quantity++;
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    onQuantityChange() {
        if (this.quantity > 20) {
            this.quantity = 20;
        } else if (this.quantity < 1 && this.quantity !== null) {
            this.quantity = 1;
        }
    }

    get isLimitReached(): boolean {
        return this.quantity >= 20;
    }

    toggleFaq(faqId: string) {
        if (this.expandedFaqs.has(faqId)) this.expandedFaqs.delete(faqId);
        else this.expandedFaqs.add(faqId);
    }

    isFaqExpanded(faqId: string): boolean {
        return this.expandedFaqs.has(faqId);
    }

    getCleanCategory(cat: string | undefined): string {
        if (!cat) return '';
        if (cat === 'Accessories Plants') return 'Accessories';
        if (cat === 'Gardening Plants') return 'Gardening';
        if (cat === 'Seeds Plants') return 'Seeds';
        return cat;
    }

    addToCart() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show('Please login first to add items into cart.', 'Sign In Required', 'info', 'standard', '/login');
            return;
        }
        if (this.product) {
            if (this.product.stock !== undefined && this.product.stock <= 0) {
                this.notificationService.show(`"${this.product.name}" is currently out of stock.`, 'Out of Stock', 'warning', 'standard');
                return;
            }

            const cat = this.product.category || '';
            const isWeightBased = cat.includes('Seeds') || cat.includes('Soil') || cat.includes('Fertilizers') || cat.includes('Nutrients');
            const weight = isWeightBased ? this.selectedWeight : undefined;
            const productToBag = { ...this.product, price: this.selectedPrice };

            this.cartService.addItem(productToBag, this.quantity, undefined, weight, this.isGift);
            this.notificationService.show(`"${this.product.name}" added to cart.`, 'Success', 'success', 'cart');
        }
    }

    buyNow() {
        if (!this.authService.getCurrentUser()) {
            this.notificationService.show('Please login first to proceed with the purchase.', 'Sign In Required', 'info', 'standard', '/login');
            return;
        }
        if (this.product) {
            if (this.product.stock !== undefined && this.product.stock <= 0) {
                this.notificationService.show(`"${this.product.name}" is currently out of stock.`, 'Out of Stock', 'warning', 'standard');
                return;
            }

            const cat = this.product.category || '';
            const isWeightBased = cat.includes('Seeds') || cat.includes('Soil') || cat.includes('Fertilizers') || cat.includes('Nutrients');
            const weight = isWeightBased ? this.selectedWeight : undefined;
            const productToBag = { ...this.product, price: this.selectedPrice };

            this.cartService.addItem(productToBag, this.quantity, undefined, weight, this.isGift);
            this.router.navigate(['/checkout']);
        }
    }

    categoryFaqs: { [key: string]: any[] } = {
        'Indoor': [
            { id: 'water', title: 'Water once a week', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Always check your plants before watering, the topsoil should be dry to touch.' },
            { id: 'sunlight', title: 'Needs bright indirect sunlight', icon: 'https://cdn-icons-png.flaticon.com/64/6974/6974854.png', content: 'Place your plants on window sills where it can get the brightest possible indirect light.' },
            { id: 'beginner', title: 'Great for beginners', icon: 'https://cdn-icons-png.flaticon.com/64/2491/2491418.png', content: 'Hardy and easy to care for, making them perfect for first-time plant parents.' }
        ],
        'Outdoor': [
            { id: 'water', title: 'Water daily in summers', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Outdoor plants evaporate water quickly due to wind and sun exposure.' },
            { id: 'sunlight', title: 'Thrives in direct sunlight', icon: 'https://cdn-icons-png.flaticon.com/64/6974/6974854.png', content: 'Requires at least 4-6 hours of direct sun to maintain health and growth.' },
            { id: 'beginner', title: 'Beginner Friendly', icon: 'https://cdn-icons-png.flaticon.com/64/1162/1162283.png', content: 'Very hardy varieties that are difficult to kill even with minimal attention.' }
        ],
        'Flowering': [
            { id: 'sunlight', title: 'Abundant Sunlight', icon: 'https://cdn-icons-png.flaticon.com/64/6974/6974854.png', content: 'Needs 6+ hours of bright light daily to produce vibrant, long-lasting blooms.' },
            { id: 'fertilizer', title: 'Blooming Fertilizer', icon: 'https://cdn-icons-png.flaticon.com/64/2650/2650645.png', content: 'Apply phosphorous-rich food every 2 weeks during peak bloom season.' },
            { id: 'deadheading', title: 'Deadheading Advice', icon: 'https://cdn-icons-png.flaticon.com/64/1518/1518915.png', content: 'Regularly remove faded flowers to encourage the plant to produce new blooms.' }
        ],
        'Seeds': [
            { id: 'germination', title: 'Germination Time', icon: 'https://cdn-icons-png.flaticon.com/64/2913/2913474.png', content: 'Most varieties sprout within 7-14 days given the right temperature and moisture.' },
            { id: 'sowing', title: 'Sowing Depth', icon: 'https://cdn-icons-png.flaticon.com/64/1518/1518881.png', content: 'Sow approximately 1/4 inch deep in well-draining, nutrient-rich potting soil.' },
            { id: 'moisture', title: 'Moisture Control', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Keep the seedbed consistently moist but not waterlogged until sprouts appear.' }
        ],
        'Soil': [
            { id: 'step1', title: 'Prepare Your Pot', icon: 'https://cdn-icons-png.flaticon.com/64/1518/1518881.png', content: 'Ensure your pot has drainage holes. Fill the bottom 1/3 with fresh soil mix.' },
            { id: 'step2', title: 'Fill & Plant', icon: 'https://cdn-icons-png.flaticon.com/64/1518/1518915.png', content: 'Place your plant, then fill the remaining space with soil, leaving an inch at the top for watering.' },
            { id: 'step3', title: 'First Watering', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Water thoroughly after repotting to settle the soil and eliminate air pockets around roots.' }
        ],
        'Fertilizer': [
            { id: 'step1', title: 'Dilute Properly', icon: 'https://cdn-icons-png.flaticon.com/64/2650/2650645.png', content: 'Mix the recommended amount with water as per package instructions. Never over-fertilize.' },
            { id: 'step2', title: 'Apply to Soil', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105807.png', content: 'Pour the mixture evenly around the base of the plant, ensuring it reaches the root zone.' },
            { id: 'step3', title: 'Feeding Schedule', icon: 'https://cdn-icons-png.flaticon.com/64/2491/2491418.png', content: 'Repeat every 2-4 weeks during the active growing season (Spring/Summer) for best results.' }
        ],
        'Tools': [
            { id: 'step1', title: 'Check Sharpness', icon: 'https://cdn-icons-png.flaticon.com/64/1162/1162283.png', content: 'Ensure blades are clean and sharp before use to make precise cuts that heal quickly.' },
            { id: 'step2', title: 'Hold Firmly', icon: 'https://cdn-icons-png.flaticon.com/64/3105/3105835.png', content: 'Use the ergonomic grip for maximum control. Keep fingers away from cutting edges.' },
            { id: 'step3', title: 'Clean & Storage', icon: 'https://cdn-icons-png.flaticon.com/64/2910/2910795.png', content: 'Wipe clean after use and store in a dry place. Apply oil to joints periodically.' }
        ],
        'Accessories': [
            { id: 'step1', title: 'Placement', icon: 'https://cdn-icons-png.flaticon.com/64/1998/1998592.png', content: 'Position the accessory where it complements your plant without obstructing its growth.' },
            { id: 'step2', title: 'Installation', icon: 'https://cdn-icons-png.flaticon.com/64/2913/2913474.png', content: 'For stakes or supports, insert firmly into soil. For decor, ensure stable placement.' },
            { id: 'step3', title: 'Maintenance', icon: 'https://cdn-icons-png.flaticon.com/64/2491/2491418.png', content: 'Dust or wipe down periodically to keep the accessory looking its best alongside your plants.' }
        ]
    };

    get currentFaqs(): any[] {
        if (!this.product?.category) return this.categoryFaqs['Indoor'];
        const cat = this.product.category;
        if (cat.includes('Soil') || cat.includes('Media')) return this.categoryFaqs['Soil'];
        if (cat.includes('Fertilizer') || cat.includes('Nutrient')) return this.categoryFaqs['Fertilizer'];
        if (cat.includes('Tools') || cat.includes('Gardening')) return this.categoryFaqs['Tools'];
        if (cat.includes('Access')) return this.categoryFaqs['Accessories'];
        if (cat.includes('Outdoor')) return this.categoryFaqs['Outdoor'];
        if (cat.includes('Flowering')) return this.categoryFaqs['Flowering'];
        if (cat.includes('Seeds')) return this.categoryFaqs['Seeds'];
        return this.categoryFaqs['Indoor'];
    }

    isHowToUseCategory(): boolean {
        if (!this.product?.category) return false;
        const cat = this.product.category;
        return cat.includes('Soil') || cat.includes('Media') || cat.includes('Fertilizer') ||
            cat.includes('Nutrient') || cat.includes('Tools') || cat.includes('Gardening') ||
            cat.includes('Access');
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }

    getTagClass(tag: string): string {
        return tag.toLowerCase().replace(/\s+/g, '-');
    }

    hasOfferTag(product: Product): boolean {
        if (!product || !product.tags) return false;
        const offerTags = OFFER_RULES.map(r => r.code);
        return product.tags.some(tag => offerTags.includes(tag));
    }

    getOfferBenefit(product: Product): string {
        if (!product) return '';
        const offerTags = OFFER_RULES.map(r => r.code);
        const code = product.tags?.find(tag => offerTags.includes(tag)) ||
            (product.category ? CATEGORY_TO_OFFER[product.category] : null);

        if (code) {
            const rule = OFFER_RULES.find(r => r.code === code);
            return rule ? rule.shortBenefit : '';
        }
        return '';
    }
}
