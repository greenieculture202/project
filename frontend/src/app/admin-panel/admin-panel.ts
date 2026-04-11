import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';
import { PlacementService, Placement } from '../services/placement.service';
import { FaqService, Faq } from '../services/faq.service';
import { AboutService, AboutSection } from '../services/about.service';
import { InquiryService, Inquiry } from '../services/inquiry.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './admin-panel.html',
    styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
    searchTerm: string = '';
    activeMainCategory: string = 'Plants';
    activeCompanionGroup: string = 'All';
    // showDetailModal handles user details viewing

    authService = inject(AuthService);
    userService = inject(UserService);
    productService = inject(ProductService);
    offerService = inject(OfferService);
    placementService = inject(PlacementService);
    faqService = inject(FaqService);
    aboutService = inject(AboutService);
    inquiryService = inject(InquiryService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    cdr = inject(ChangeDetectorRef);
    ngZone = inject(NgZone);
    http = inject(HttpClient);
    notiService = inject(NotificationService);

    activeTab: string = 'dashboard';
    faqs: Faq[] = [];
    isLoadingFaqs: boolean = false;
    showAddFaqModal: boolean = false;
    isDownloading: boolean = false;
    isEditingFaq: boolean = false;
    editingFaqId: string | null = null;
    newFaq: Faq = {
        question: '',
        answer: '',
        category: 'Orders',
        order: 0
    };
    faqCategoryFilter: string = 'All';
    faqCategories: string[] = ['Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];
    userFilter: string = 'All';
    userSearchQuery: string = '';
    users: any[] = [];
    orders: any[] = [];
    selectedOrder: any = null;
    showOrderModal: boolean = false;
    showInvoiceModal: boolean = false;
    orderSearchQuery: string = '';
    orderStatusFilter: string = 'All';
    paymentSummary: any = {
        total: 0,
        cod: 0,
        online: 0,
        codPercentage: 0,
        onlinePercentage: 0
    };
    hoveredPaymentSegment: any = null;
    isLoadingOrders: boolean = false;
    backendRevenue: number = 0;

    // Admin Payment View State
    adminPaymentFilterMethod: string = 'All';
    adminPaymentStats: any = {
        totalRevenue: 0,
        codCount: 0,
        onlineCount: 0,
        codRevenue: 0,
        onlineRevenue: 0,
        codPercentage: 0,
        onlinePercentage: 0,
        totalOrders: 0,
        // Settlement tracking
        totalOwedToCouriers: 0,
        totalPaidToCouriers: 0,
        totalPendingToCouriers: 0,
        totalCollectedFromCouriers: 0,
        totalPendingFromCouriers: 0
    };
    couriers: any[] = [];
    courierFees: { [key: string]: number } = {};

    isLoading: boolean = false;
    productMap: { [key: string]: any[] } = {};
    isLoadingProducts: boolean = false;
    productCategoryFilter: string = 'All';

    // Settings
    settingsMessage: string = '';
    settingsError: string = '';
    newAdminMessage: string = '';
    newAdminError: string = '';
    isSettingsSubmitting: boolean = false;
    isNewAdminSubmitting: boolean = false;
    currentAdminSettings = {
        fullName: '',
        oldPassword: '',
        newPassword: ''
    };
    newAdminPayload = {
        fullName: '',
        email: '',
        password: '',
        currentAdminPassword: ''
    };
    showAddAdminModal: boolean = false;

    // Inquiries
    inquiries: Inquiry[] = [];
    isLoadingInquiries: boolean = false;
    showReplyModal: boolean = false;
    selectedInquiry: Inquiry | null = null;
    replyContent: string = '';

    today: Date = new Date();

    // Offers
    offers: Offer[] = [];
    isLoadingOffers: boolean = false;
    showAddOfferModal: boolean = false;
    isEditingOffer: boolean = false;
    editingOfferId: string | null = null;
    newOffer: any = {
        badge: '',
        title: '',
        subtitle: '',
        discountLine: '',
        description: '',
        features: ['', '', ''],
        ctaText: 'GRAB THIS DEAL',
        ctaLink: '/',
        image: '',
        cardBg: '#f0fdf4',
        accentColor: '#16a34a',
        accentLight: '#dcfce7',
        accentText: '#14532d',
        tag: '',
        tagBg: '#fbbf24',
        tagText: '#78350f',
        timer: 'Ends Soon!',
        timerBg: '#dcfce7'
    };

    // Placements (Video Placements)
    placements: Placement[] = [];
    isLoadingPlacements: boolean = false;
    showAddPlacementModal: boolean = false;
    isEditingPlacement: boolean = false;
    editingPlacementId: string | null = null;
    newPlacement: Placement = {
        name: '',
        description: '',
        image: '',
        videoUrl: '',
        features: ['', '', ''],
        badge: 'NEW PLACEMENT',
        categoryRoute: '/products/plants'
    };

    // About Us
    aboutSections: AboutSection[] = [];
    isLoadingAbout: boolean = false;
    showAddAboutModal: boolean = false;
    isEditingAbout: boolean = false;
    editingAboutId: string | null = null;
    newAboutSection: AboutSection = {
        type: 'journey',
        title: '',
        content: '',
        icon: '',
        image: '',
        author: '',
        order: 0
    };
    aboutSectionTypes: string[] = ['journey', 'value', 'stat', 'quote', 'founder'];

    // Associated Products Modal
    showAssociatedProductsModal: boolean = false;
    associatedProducts: any[] = [];
    activeOfferCode: string = '';
    activeOfferBadge: string = '';

    // Courier Messaging
    showCourierReplyModal: boolean = false;
    currentReplyCourierName: string = '';
    courierReplyMessage: string = '';
    inquiryActiveSubTab: 'customers' | 'couriers' = 'customers';
    showAddProductToOfferModal: boolean = false;
    addProductSearchTerm: string = '';
    allProductsList: any[] = [];
    showItemsPopup: boolean = false;
    showConversionModal: boolean = false;
    selectedOrderItems: any[] = [];
    selectedOrderForItems: any = null;

    // Offer Codes (Admin Only)
    offerSectionCodes: any[] = [
        {
            name: 'BOGO Offer Page',
            page: '/bogo-offer',
            cardsCount: 4,
            code: 'G-BOGO-6-SECTION',
            badge: 'BOGO',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        },
        {
            name: 'Indoor Jungle Page',
            page: '/indoor-offer',
            cardsCount: 20,
            code: 'G-INDOOR-6-SEC',
            badge: 'ELITE PICK',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        },
        {
            name: 'Garden Essentials Page',
            page: '/garden-offer',
            cardsCount: 20,
            code: 'G-GARDEN-6-SEC',
            badge: 'KIT SAVINGS',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        },
        {
            name: 'Flowering Bonanza Page',
            page: '/flowering-offer',
            cardsCount: 20,
            code: 'G-FLOWER-6-SEC',
            badge: 'SALE',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        }
    ];

    // Navbar definitions for smarter counting/filtering
    readonly navbarDefinitions: any = {
        'Pots & Planters': [
            'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters',
            'Self-Watering Pots', 'Grow Bags', 'Metal Planters', 'Wooden Planters',
            'Wall-Mounted Planters', 'Balcony Railing Planters', 'Decorative Planters',
            'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters'
        ],
        'Watering Equipment': [
            'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle',
            'Drip Irrigation Kit', 'Sprinkler', 'Water Pump', 'Mist Sprayer',
            'Automatic Water Timer', 'Soaker Hose', 'Water Pipe', 'Hose Connector',
            'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer'
        ],
        'Support & Protection': [
            'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net',
            'Shade Net', 'Frost Cover', 'Plant Cover Bag', 'Tree Guard',
            'Bamboo Stakes', 'Wire Support Ring', 'Plant Tie', 'Mulching Sheet',
            'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen'
        ],
        'Lighting Equipment': [
            'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
            'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel',
            'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light',
            'Smart Grow Light', 'Light Controller', 'Heat Lamp'
        ],
        'Decorative & Display': [
            'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger',
            'Garden Statue', 'Decorative Stones', 'Pebbles', 'Plant Tray',
            'Moss Decoration', 'Terrarium Glass', 'Garden Lights', 'Balcony Stand',
            'Vertical Frame', 'Garden Border Fence', 'Plant Labels'
        ],
        'Soil Types': ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix'],
        'Organic Amendments': ['Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure'],
        'Growth Media': ['Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'],
        'Organic Fertilizers': ['Organic Fertilizer', 'Vermicompost', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer'],
        'Chemical Fertilizers': ['Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix'],
        'Plant Boosters': ['Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'],
        'Hand Tools': ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter'],
        'Cutting Tools': ['Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife'],
        'Digging Tools': ['Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder'],
        'Power Tools': ['Lawn Mower']
    };

    readonly mainCategoryGroups: { [key: string]: { key: string, label: string }[] } = {
        'Plants': [
            { key: 'Indoor Plants', label: 'Indoor' },
            { key: 'Outdoor Plants', label: 'Outdoor' },
            { key: 'Bestsellers', label: 'Bestsellers' },
            { key: 'Flowering Plants', label: 'Flowering' },
            { key: 'Gardening', label: 'Gardening' },
            { key: 'XL Plants', label: 'XL Plants' },
            { key: 'Air Purifying Plants', label: 'Air Purifying' }
        ],
        'Seeds': [
            { key: 'Vegetable Seeds', label: 'Vegetable Seeds' },
            { key: 'Fruit Seeds', label: 'Fruit Seeds' },
            { key: 'Herb Seeds', label: 'Herb Seeds' },
            { key: 'Seeds Kit', label: 'Seeds Kit' },
            { key: 'Flower Seeds', label: 'Flower Seeds' },
            { key: 'Microgreen Seeds', label: 'Microgreen Seeds' }
        ],
        'Accessories': [
            { key: 'Pots & Planters', label: 'Pots & Planters' },
            { key: 'Watering Equipment', label: 'Watering Equipment' },
            { key: 'Support & Protection', label: 'Support & Protection' },
            { key: 'Lighting Equipment', label: 'Lighting Equipment' },
            { key: 'Decorative & Display', label: 'Decorative & Display' },
            // Pots & Planters
            { key: 'Plastic Pots', label: 'Plastic Pots' },
            { key: 'Ceramic Pots', label: 'Ceramic Pots' },
            { key: 'Terracotta Pots', label: 'Terracotta Pots' },
            { key: 'Hanging Planters', label: 'Hanging Planters' },
            { key: 'Self-Watering Pots', label: 'Self-Watering Pots' },
            { key: 'Grow Bags', label: 'Grow Bags' },
            { key: 'Metal Planters', label: 'Metal Planters' },
            { key: 'Wooden Planters', label: 'Wooden Planters' },
            { key: 'Wall-Mounted Planters', label: 'Wall-Mounted Planters' },
            { key: 'Balcony Railing Planters', label: 'Balcony Railing Planters' },
            { key: 'Decorative Planters', label: 'Decorative Planters' },
            { key: 'Seedling Trays', label: 'Seedling Trays' },
            { key: 'Nursery Pots', label: 'Nursery Pots' },
            { key: 'Vertical Garden Pots', label: 'Vertical Garden Pots' },
            { key: 'Large Outdoor Planters', label: 'Large Outdoor Planters' },
            // Watering Equipment
            { key: 'Watering Can', label: 'Watering Can' },
            { key: 'Spray Bottle', label: 'Spray Bottle' },
            { key: 'Garden Hose', label: 'Garden Hose' },
            { key: 'Hose Nozzle', label: 'Hose Nozzle' },
            { key: 'Drip Irrigation Kit', label: 'Drip Irrigation Kit' },
            { key: 'Sprinkler', label: 'Sprinkler' },
            { key: 'Water Pump', label: 'Water Pump' },
            { key: 'Mist Sprayer', label: 'Mist Sprayer' },
            { key: 'Automatic Water Timer', label: 'Automatic Water Timer' },
            { key: 'Soaker Hose', label: 'Soaker Hose' },
            { key: 'Water Pipe', label: 'Water Pipe' },
            { key: 'Hose Connector', label: 'Hose Connector' },
            { key: 'Water Tank', label: 'Water Tank' },
            { key: 'Self-Watering Spikes', label: 'Self-Watering Spikes' },
            { key: 'Pressure Sprayer', label: 'Pressure Sprayer' },
            // Support & Protection
            { key: 'Plant Support Stick', label: 'Plant Support Stick' },
            { key: 'Trellis', label: 'Trellis' },
            { key: 'Plant Clips', label: 'Plant Clips' },
            { key: 'Garden Net', label: 'Garden Net' },
            { key: 'Shade Net', label: 'Shade Net' },
            { key: 'Frost Cover', label: 'Frost Cover' },
            { key: 'Plant Cover Bag', label: 'Plant Cover Bag' },
            { key: 'Tree Guard', label: 'Tree Guard' },
            { key: 'Bamboo Stakes', label: 'Bamboo Stakes' },
            { key: 'Wire Support Ring', label: 'Wire Support Ring' },
            { key: 'Plant Tie', label: 'Plant Tie' },
            { key: 'Mulching Sheet', label: 'Mulching Sheet' },
            { key: 'Bird Net', label: 'Bird Net' },
            { key: 'Greenhouse Cover', label: 'Greenhouse Cover' },
            { key: 'Wind Protection Screen', label: 'Wind Protection Screen' },
            // Lighting Equipment
            { key: 'LED Grow Light', label: 'LED Grow Light' },
            { key: 'Full Spectrum Light', label: 'Full Spectrum Light' },
            { key: 'UV Grow Light', label: 'UV Grow Light' },
            { key: 'Grow Light Bulb', label: 'Grow Light Bulb' },
            { key: 'Hanging Grow Lamp', label: 'Hanging Grow Lamp' },
            { key: 'Clip Grow Light', label: 'Clip Grow Light' },
            { key: 'Light Timer', label: 'Light Timer' },
            { key: 'Reflector Panel', label: 'Reflector Panel' },
            { key: 'Grow Light Stand', label: 'Grow Light Stand' },
            { key: 'Solar Garden Light', label: 'Solar Garden Light' },
            { key: 'Tube Grow Light', label: 'Tube Grow Light' },
            { key: 'Seedling Grow Light', label: 'Seedling Grow Light' },
            { key: 'Smart Grow Light', label: 'Smart Grow Light' },
            { key: 'Light Controller', label: 'Light Controller' },
            { key: 'Heat Lamp', label: 'Heat Lamp' },
            // Decorative & Display
            { key: 'Plant Stand', label: 'Plant Stand' },
            { key: 'Hanging Basket', label: 'Hanging Basket' },
            { key: 'Wall Shelf', label: 'Wall Shelf' },
            { key: 'Macrame Hanger', label: 'Macrame Hanger' },
            { key: 'Garden Statue', label: 'Garden Statue' },
            { key: 'Decorative Stones', label: 'Decorative Stones' },
            { key: 'Pebbles', label: 'Pebbles' },
            { key: 'Plant Tray', label: 'Plant Tray' },
            { key: 'Moss Decoration', label: 'Moss Decoration' },
            { key: 'Terrarium Glass', label: 'Terrarium Glass' },
            { key: 'Garden Lights', label: 'Garden Lights' },
            { key: 'Balcony Stand', label: 'Balcony Stand' },
            { key: 'Vertical Frame', label: 'Vertical Frame' },
            { key: 'Garden Border Fence', label: 'Garden Border Fence' },
            { key: 'Plant Labels', label: 'Plant Labels' },
            // Soil & Growing Media
            { key: 'Soil Types', label: 'Soil Types' },
            { key: 'Organic Amendments', label: 'Organic Amendments' },
            { key: 'Growth Media', label: 'Growth Media' },
            { key: 'Garden Soil', label: 'Garden Soil' },
            { key: 'Potting Mix', label: 'Potting Mix' },
            { key: 'Red Soil', label: 'Red Soil' },
            { key: 'Black Soil', label: 'Black Soil' },
            { key: 'Sand Mix', label: 'Sand Mix' },
            { key: 'Coco Peat', label: 'Coco Peat' },
            { key: 'Vermicompost', label: 'Vermicompost' },
            { key: 'Peat Moss', label: 'Peat Moss' },
            { key: 'Compost', label: 'Compost' },
            { key: 'Organic Manure', label: 'Organic Manure' },
            { key: 'Perlite', label: 'Perlite' },
            { key: 'Vermiculite', label: 'Vermiculite' },
            { key: 'Hydroponic Media', label: 'Hydroponic Media' },
            { key: 'Mulch', label: 'Mulch' },
            { key: 'Leaf Mold', label: 'Leaf Mold' },
            // Fertilizers & Nutrients
            { key: 'Organic Fertilizers', label: 'Organic Fertilizers' },
            { key: 'Chemical Fertilizers', label: 'Chemical Fertilizers' },
            { key: 'Plant Boosters', label: 'Plant Boosters' },
            { key: 'Organic Fertilizer', label: 'Organic Fertilizer' },
            { key: 'Bone Meal', label: 'Bone Meal' },
            { key: 'Compost Tea', label: 'Compost Tea' },
            { key: 'Bio Fertilizer', label: 'Bio Fertilizer' },
            { key: 'Liquid Fertilizer', label: 'Liquid Fertilizer' },
            { key: 'NPK Fertilizer', label: 'NPK Fertilizer' },
            { key: 'Urea', label: 'Urea' },
            { key: 'Slow Release Fertilizer', label: 'Slow Release Fertilizer' },
            { key: 'Micronutrient Mix', label: 'Micronutrient Mix' },
            { key: 'Plant Growth Booster', label: 'Plant Growth Booster' },
            { key: 'Flower Booster', label: 'Flower Booster' },
            { key: 'Root Booster', label: 'Root Booster' },
            { key: 'Seaweed Extract', label: 'Seaweed Extract' },
            { key: 'Fish Emulsion', label: 'Fish Emulsion' },
            { key: 'Humic Acid', label: 'Humic Acid' },
            // Gardening Tools
            { key: 'Hand Tools', label: 'Hand Tools' },
            { key: 'Cutting Tools', label: 'Cutting Tools' },
            { key: 'Digging Tools', label: 'Digging Tools' },
            { key: 'Power Tools', label: 'Power Tools' },
            { key: 'Hand Trowel', label: 'Hand Trowel' },
            { key: 'Garden Fork', label: 'Garden Fork' },
            { key: 'Soil Scoop', label: 'Soil Scoop' },
            { key: 'Dibber', label: 'Dibber' },
            { key: 'Transplanter', label: 'Transplanter' },
            { key: 'Pruning Shears', label: 'Pruning Shears' },
            { key: 'Hedge Cutter', label: 'Hedge Cutter' },
            { key: 'Garden Scissors', label: 'Garden Scissors' },
            { key: 'Garden Knife', label: 'Garden Knife' },
            { key: 'Rake', label: 'Rake' },
            { key: 'Shovel', label: 'Shovel' },
            { key: 'Spade', label: 'Spade' },
            { key: 'Hoe', label: 'Hoe' },
            { key: 'Weeder', label: 'Weeder' },
            { key: 'Lawn Mower', label: 'Lawn Mower' }
        ]
    };

    showDetailModal: boolean = false;
    showAddProductModal: boolean = false;
    isEditingProduct: boolean = false;
    editingProductId: string | null = null;
    selectedUser: any = null;

    newProduct: any = {
        name: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: '',
        image: '',
        images: ['', '', '', ''], // 4 additional images
        description: '',
        tags: '',
        stock: 0
    };

    // Duplicate Check State
    showDuplicateModal: boolean = false;
    duplicateProduct: any = null;

    // Tracking and Courier Fields
    selectedCourier: string = '';
    trackingNumber: string = '';
    expectedDeliveryDate: string = '';
    courierOptions: string[] = []; // Fetched from DB

    // Tracking Generation Limits
    // Store: { [orderId]: { count: number, lockUntil: number } }
    trackingGenLimits: { [key: string]: { count: number, lockUntil: number } } = {};

    // Success Modal State
    showSuccessModal: boolean = false;
    successModalData: any = {
        name: '',
        path: '',
        image: '',
        type: 'added' // 'added' or 'updated'
    };

    isSubmitting: boolean = false;

    // State to Courier Mapping (Populated dynamically via DB)
    public courierStateMapping: { [key: string]: string[] } = {};

    isShaking: boolean = false;
    showCourierMismatchError: boolean = false;
    suggestedCourier: string = '';

    extractState(order: any): string {
        const addrState = order.userId?.state || order.state || '';
        if (addrState) return addrState;

        const address = (order.userId?.address || order.shippingAddress || '').toLowerCase();
        const city = (order.userId?.city || '').toLowerCase();

        for (const courier in this.courierStateMapping) {
            for (const state of this.courierStateMapping[courier]) {
                if (address.includes(state.toLowerCase()) || city.includes(state.toLowerCase())) {
                    return state;
                }
            }
        }
        return 'Unknown';
    }

    get orderedCourierOptions(): string[] {
        // Return exactly 3 companies as requested
        // Ensure the recommended/selected one is first
        const recommended = this.selectedCourier;
        let options = [...this.courierOptions];

        // Ensure we have at least the primary 3 if DB is empty or has fewer
        if (options.length === 0) {
            options = ['Delhivery', 'BlueDart', 'Ecom Express'];
        }

        if (recommended) {
            options = options.filter(o => o !== recommended);
            options.unshift(recommended);
        }

        return options.slice(0, 3);
    }

    onCourierChange() {
        if (!this.selectedCourier || !this.selectedOrder) {
            this.showCourierMismatchError = false;
            return;
        }

        const orderState = this.extractState(this.selectedOrder);
        const allowedStates = this.courierStateMapping[this.selectedCourier] || [];

        if (!allowedStates.includes(orderState)) {
            this.suggestedCourier = this.findRecommendedCourier(orderState);
            this.showCourierMismatchError = true;
            this.isShaking = true;
            setTimeout(() => this.isShaking = false, 500);
        } else {
            this.showCourierMismatchError = false;
            this.suggestedCourier = '';
        }
        this.cdr.detectChanges();
    }

    findRecommendedCourier(state: string): string {
        for (const courier in this.courierStateMapping) {
            if (this.courierStateMapping[courier].includes(state)) {
                return courier;
            }
        }
        return '';
    }

    // Delete Confirmation Modal State
    showDeleteModal: boolean = false;
    deleteSuccess: boolean = false;
    deleteTarget: { id: string; name: string; image?: string; type?: 'product' | 'placement' | 'offer' | 'faq' | 'about' } = { id: '', name: '', type: 'product' };

    private toggleBodyScroll(lock: boolean) {
        if (lock) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }


    get filteredUsers() {
        let filtered = this.users;
        
        // Filter by Login Type
        if (this.userFilter !== 'All') {
            filtered = filtered.filter(u => u.method === this.userFilter);
        }
        
        // Filter by Search Query (Name or Email)
        if (this.userSearchQuery) {
            const query = this.userSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(u => 
                (u.name && u.name.toLowerCase().includes(query)) || 
                (u.email && u.email.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }

    stats = [
        { label: 'Total Orders', value: '0', icon: 'shopping-cart', color: '#4f46e5', trend: '+12% this week', targetTab: 'orders' },
        { label: 'Total Sales', value: '₹0', icon: 'wallet', color: '#10b981', trend: 'Lifetime revenue', targetTab: 'payment' },
        { label: 'Conversion Rate', value: '0%', icon: 'chart-line', color: '#f59e0b', trend: 'Based on deliveries', targetTab: 'dashboard' },
        { label: 'Total Products', value: '0', icon: 'box', color: '#8b5cf6', trend: 'In inventory', targetTab: 'products' }
    ];

    orderStats = [
        { label: 'TOTAL VOLUME', value: '0', icon: 'shopping-bag', color: '#4f46e5', trend: '+12% this week' },
        { label: 'REVENUE FLOW', value: '₹0', icon: 'rupee-sign', color: '#10b981', trend: 'Verified' },
        { label: 'IN PIPELINE', value: '0', icon: 'spinner', color: '#f59e0b', trend: 'Active now' },
        { label: 'FULFILLED', value: '0', icon: 'check-double', color: '#8b5cf6', trend: '99.8% Success' }
    ];

    dashboardTrends: any[] = [
        { day: 'Mon', count: 0, visualHeight: 10 },
        { day: 'Tue', count: 0, visualHeight: 10 },
        { day: 'Wed', count: 0, visualHeight: 10 },
        { day: 'Thu', count: 0, visualHeight: 10 },
        { day: 'Fri', count: 0, visualHeight: 10 },
        { day: 'Sat', count: 0, visualHeight: 10 },
        { day: 'Sun', count: 0, visualHeight: 10 }
    ];

    fulfillmentRate: number = 0;
    donutDashArray: string = '0 100';
    pieChartStyle: string = '';
    salesPieChartStyle: string = '';
    lineChartPath: string = '';
    areaChartPath: string = '';

    // Detailed Interactive Sales Chart
    salesSlices: any[] = [];
    daySlices: any[] = [];
    hoveredSalesSegment: any = null;
    totalSalesItems: number = 0;
    totalWeeklyOrders: number = 0;
    newUsersThisWeek: number = 0;
    newUsersPercentage: number = 0;

    // Notification State
    hasNotifications: boolean = false;
    unreadNotificationsCount: number = 0;
    showNotiMenu: boolean = false;
    private lastOrderCount: number = -1;
    private pollingInterval: any;

    // REAL DATA CONVERSION METRICS
    realConversion = {
        visitors: 0,
        orders: 0,
        successfulOrders: 0,
        convRate: 0,
        cartRate: 0,
        checkoutRate: 0,
        newCustRate: 0,
        repeatRate: 0,
        abandonRate: 0,
        topProducts: [] as any[]
    };
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();
    backendResults: any[] = [];
    isSearching: boolean = false;
    private notificationAudio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
    adminNotifications: any[] = [];
    private isFirstNotiLoad: boolean = true;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (this.showNotiMenu) {
            this.showNotiMenu = false;
        }
    }

    categoryStats = [
        { name: 'Indoor Plants', count: 125, percentage: 45, color: '#10b981' },
        { name: 'Garden Tools', count: 84, percentage: 30, color: '#6366f1' },
        { name: 'Decorative Pots', count: 42, percentage: 15, color: '#f59e0b' },
        { name: 'Fertilizers', count: 28, percentage: 10, color: '#ef4444' }
    ];

    ngOnInit() {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/login']);
            return;
        }

        // Listen for tab changes in the URL to persist state on refresh/back/forward
        this.route.queryParams.subscribe(params => {
            const tab = params['tab'];
            const mainCat = params['mainCat'];

            if (tab) {
                // Use a internal flag to prevent redundant navigation
                this.setTab(tab, mainCat, false);
            } else {
                // Default to dashboard
                this.setTab('dashboard', undefined, false);
            }
        });

        // Setup debounced backend search
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => {
                const trimmed = term?.trim() || '';
                if (trimmed.length < 2) {
                    this.isSearching = false;
                    this.backendResults = [];
                    this.cdr.detectChanges();
                    return of([]);
                }
                this.isSearching = true;
                this.cdr.detectChanges();
                return this.productService.searchProducts(trimmed);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (results) => {
                this.backendResults = results;
                this.isSearching = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Search error:', err);
                this.isSearching = false;
                this.cdr.detectChanges();
            }
        });

        this.loadCouriers();
        this.loadUsers();
        this.loadOrders();
        this.loadAdminNotifications();

        // Setup polling for orders and notifications (Faster updates)
        this.pollingInterval = setInterval(() => {
            this.loadOrders();
            this.loadAdminNotifications();
        }, 10000);

        // Initialize settings with current admin name
        const userName = this.authService.getCurrentUser();
        if (userName) {
            this.currentAdminSettings.fullName = userName;
        }
    }

    ngOnDestroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearchChange(immediate: boolean = false) {
        if (this.searchTerm && this.searchTerm.trim().length >= 2) {
            console.log(`ðŸ” [Admin Search] Fetching from backend: "${this.searchTerm}"`);
        }

        if (immediate) {
            this.isSearching = true;
            this.productService.searchProducts(this.searchTerm).subscribe(results => {
                console.log(`âœ… [Admin Search] Received ${results.length} results from backend`);
                this.backendResults = results;
                this.isSearching = false;
                this.cdr.detectChanges();
            });
        } else {
            this.searchSubject.next(this.searchTerm);
        }
    }

    loadUsers() {
        // Only show spinner if we have no users yet (first load)
        if (this.users.length === 0) {
            this.isLoading = true;
        }

        this.userService.getAllUsers().subscribe({
            next: (data: any[]) => {
                this.ngZone.run(() => {
                    this.users = data.map((user: any) => ({
                        id: user._id,
                        name: user.fullName || user.name || 'User',
                        email: user.email,
                        phone: user.phone || 'N/A',
                        alternatePhone: user.alternatePhone || 'N/A',
                        address: user.address || 'N/A',
                        city: user.city || '',
                        state: user.state || '',
                        method: user.method || 'Website',
                        greenPoints: user.greenPoints || 0,
                        profilePic: user.profilePic,
                        role: user.role || 'user',
                        date: user.createdAt || user.date,
                        isBlocked: user.isBlocked || false,
                        cart: user.cart || []
                    }));
                    this.stats[0].value = this.users.length.toString();
                    this.updateDashboardStats();
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err: any) => {
                console.error('Error fetching users:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    viewUserDetails(user: any) {
        this.selectedUser = user;
        this.showDetailModal = true;
        this.toggleBodyScroll(true);
        this.cdr.detectChanges();
    }

    closeDetailModal() {
        this.showDetailModal = false;
        this.selectedUser = null;
        this.toggleBodyScroll(false);
        this.cdr.detectChanges();
    }

    toggleBlockUser(user: any) {
        const newStatus = !user.isBlocked;
        this.userService.blockUser(user.id, newStatus).subscribe({
            next: (updatedUser: any) => {
                this.ngZone.run(() => {
                    user.isBlocked = updatedUser.isBlocked;
                    this.cdr.detectChanges();
                });
            },
            error: (err: any) => {
                console.error('Error toggling user block status:', err);
                this.notiService.show('Failed to update user status. Please check your connection.', 'Update Error', 'error');
            }
        });
    }

    viewOrderDetails(order: any) {
        this.selectedOrder = order;

        // Auto-select courier based on state if not already set
        if (!order.courierName) {
            const state = this.extractState(order);
            this.selectedCourier = this.findRecommendedCourier(state);
        } else {
            this.selectedCourier = order.courierName;
        }

        this.showOrderModal = true;
        this.showCourierMismatchError = false;
        this.suggestedCourier = '';
        this.toggleBodyScroll(true);
        this.cdr.detectChanges();
    }

    closeOrderModal() {
        this.showOrderModal = false;
        this.selectedOrder = null;
        this.showCourierMismatchError = false;
        this.suggestedCourier = '';
        this.toggleBodyScroll(false);
    }

    viewInvoice(order: any) {
        this.selectedOrder = order;
        this.showInvoiceModal = true;
        this.toggleBodyScroll(true);
    }

    closeInvoiceModal() {
        this.showInvoiceModal = false;
        this.selectedOrder = null;
        this.toggleBodyScroll(false);
    }

    downloadInvoice() {
        if (this.isDownloading) return;

        const invoiceElement = document.querySelector('.printable-invoice-wrap') as HTMLElement;
        if (!invoiceElement) {
            alert('Invoice content not found');
            return;
        }

        this.isDownloading = true;
        this.cdr.detectChanges();

        // Small delay to ensure any UI updates are rendered
        setTimeout(() => {
            html2canvas(invoiceElement, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            } as any).then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
                
                const fileName = `Greenie_Invoice_${this.selectedOrder?.orderId || 'Download'}.pdf`;
                pdf.save(fileName);
                
                this.isDownloading = false;
                this.cdr.detectChanges();
            }).catch((err: any) => {
                console.error('Download failed:', err);
                alert('Failed to generate PDF. Please try again.');
                this.isDownloading = false;
                this.cdr.detectChanges();
            });
        }, 100);
    }

    onStatClick(stat: any) {
        if (stat.label === 'Conversion Rate') {
            this.showConversionModal = true;
            this.toggleBodyScroll(true);
        } else {
            this.setTab(stat.targetTab);
        }
    }

    closeConversionModal() {
        this.showConversionModal = false;
        this.toggleBodyScroll(false);
    }

    setTab(tab: string, mainCategory?: string, updateUrl: boolean = true) {
        this.activeTab = tab;
        if (mainCategory) {
            this.activeMainCategory = mainCategory;
            // Reset filters so category overview cards always show on navigation
            this.productCategoryFilter = 'All';
            this.searchTerm = '';
            this.backendResults = [];
        }

        // Update URL to persist tab state across refreshes
        if (updateUrl) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { tab: tab, mainCat: mainCategory || null },
                queryParamsHandling: 'merge'
            });
        }
        if (tab === 'dashboard' || tab === 'users') {
            this.loadUsers();
        } else if (tab === 'products') {
            this.loadProducts();
        } else if (tab === 'offers') {
            this.loadOffers();
            this.loadProducts(); // Load products to support the "Add Existing" search modal
        } else if (tab === 'placements') {
            this.loadPlacements();
        } else if (tab === 'faqs') {
            this.faqCategoryFilter = 'All';
            this.loadFaqs();
        } else if (tab === 'about-us') {
            this.loadAboutSections();
        } else if (tab === 'orders') {
            this.loadOrders();
        } else if (tab === 'inquiries') {
            this.loadInquiries();
        } else if (tab === 'payment') {
            this.loadOrders();
            this.loadPaymentSummary();
        }
    }

    updateAdminProfile(event: Event) {
        event.preventDefault();
        this.settingsMessage = '';
        this.settingsError = '';
        this.isSettingsSubmitting = true;

        const payload: any = { fullName: this.currentAdminSettings.fullName };
        if (this.currentAdminSettings.newPassword) {
            if (!this.currentAdminSettings.oldPassword) {
                this.settingsError = 'Old password is required to change password';
                this.isSettingsSubmitting = false;
                return;
            }
            payload.oldPassword = this.currentAdminSettings.oldPassword;
            payload.newPassword = this.currentAdminSettings.newPassword;
        }

        this.http.put(`${this.authService.apiUrl}/admin-update`, payload, {
            headers: { 'x-auth-token': this.authService.getToken() || '' }
        }).subscribe({
            next: (res: any) => {
                this.settingsMessage = res.message;
                this.currentAdminSettings.oldPassword = '';
                this.currentAdminSettings.newPassword = '';
                this.isSettingsSubmitting = false;
                // Update local user data if name changed
                this.authService.updateUserLocalInfo(payload.fullName);
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.settingsError = err.error?.message || 'Failed to update settings';
                this.isSettingsSubmitting = false;
                this.cdr.detectChanges();
            }
        });
    }

    closeAddAdminModal() {
        this.showAddAdminModal = false;
        this.newAdminMessage = '';
        this.newAdminError = '';
        this.newAdminPayload = { fullName: '', email: '', password: '', currentAdminPassword: '' };
    }

    addNewAdmin(event: Event) {
        event.preventDefault();
        this.newAdminMessage = '';
        this.newAdminError = '';
        this.isNewAdminSubmitting = true;

        // Prepare payload with @greenie.com domain
        const username = this.newAdminPayload.email.trim().split('@')[0];
        const payload = {
            fullName: this.newAdminPayload.fullName,
            email: `${username}@greenie.com`.toLowerCase(),
            password: this.newAdminPayload.password,
            currentAdminPassword: this.newAdminPayload.currentAdminPassword
        };

        this.http.post(`${this.authService.apiUrl}/admin-register`, payload, {
            headers: { 'x-auth-token': this.authService.getToken() || '' }
        }).subscribe({
            next: (res: any) => {
                this.newAdminMessage = res.message || 'Admin registered successfully!';
                this.newAdminPayload = { fullName: '', email: '', password: '', currentAdminPassword: '' };
                this.isNewAdminSubmitting = false;
                this.cdr.detectChanges();
                // Auto-close after 2 seconds on success
                setTimeout(() => { this.showAddAdminModal = false; this.newAdminMessage = ''; }, 3000);
            },
            error: (err: any) => {
                this.newAdminError = err.error?.message || 'Failed to register new admin';
                this.isNewAdminSubmitting = false;
                this.cdr.detectChanges();
            }
        });
    }

    playNotificationSound() {
        this.notificationAudio.play()
            .then(() => {
                console.log('✅ Notification sound played successfully');
            })
            .catch(e => {
                console.warn('❌ Audio play failed (Browser policy):', e);
            });
    }

    triggerNewNotification() {
        this.hasNotifications = true;
        this.unreadNotificationsCount++;
        this.playNotificationSound();
        this.cdr.detectChanges();
    }

    loadAdminNotifications() {
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };
        this.http.get<any[]>('/api/admin/notifications', { headers }).subscribe({
            next: (data: any[]) => {
                const currentUnreadCount = data.filter((n: any) => !n.isRead).length;
                
                // If we have more unread notifications than before, play sound (Skip first load)
                if (!this.isFirstNotiLoad && currentUnreadCount > this.unreadNotificationsCount) {
                    console.log('--- NEW NOTIFICATION DETECTED, PLAYING SOUND ---');
                    this.playNotificationSound();
                }

                this.isFirstNotiLoad = false;
                console.log(`[AdminNoti] Total: ${data.length}, Unread: ${currentUnreadCount}`);
                this.adminNotifications = data;
                this.unreadNotificationsCount = currentUnreadCount;
                this.hasNotifications = this.unreadNotificationsCount > 0;
                this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Error loading notifications:', err)
        });
    }

    toggleNotiMenu(event: Event) {
        event.stopPropagation();
        this.showNotiMenu = !this.showNotiMenu;
        if (this.showNotiMenu && this.hasNotifications) {
            this.clearNotifications();
        }
    }

    clearNotifications(event?: Event) {
        if (event) {
            event.stopPropagation();
        }

        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };
        this.http.put('/api/admin/notifications/read', {}, { headers }).subscribe({
            next: () => {
                this.hasNotifications = false;
                this.unreadNotificationsCount = 0;
                // Mark local ones as read
                this.adminNotifications.forEach((n: any) => n.isRead = true);
                this.cdr.detectChanges();
            },
        });
    }

    openCourierReply(courierName: string, event: Event) {
        event.stopPropagation();
        this.currentReplyCourierName = courierName;
        this.courierReplyMessage = '';
        this.showCourierReplyModal = true;
    }

    // --- NEW COURIER MESSAGE ---
    showNewCourierMessageModal: boolean = false;
    newCourierName: string = 'Delhivery';
    newCourierMessage: string = '';
    availableCouriers: string[] = ['Blue Dart', 'Delhivery', 'DTDC'];

    openNewCourierMessageModal(event?: Event) {
        if (event) event.stopPropagation();
        this.newCourierName = 'Delhivery';
        this.newCourierMessage = '';
        this.showNewCourierMessageModal = true;
    }

    sendNewCourierMessage() {
        if (!this.newCourierMessage.trim() || !this.newCourierName) return;

        const payload = {
            courierName: this.newCourierName,
            title: 'Message from Admin 📬',
            message: this.newCourierMessage
        };

        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };

        this.http.post('/api/admin/notify-courier', payload, { headers }).subscribe({
            next: (res: any) => {
                this.notiService.show(`Message sent to ${this.newCourierName}`, 'Message Sent', 'success', 'toast');
                this.showNewCourierMessageModal = false;
                
                // Add the outbound message locally so it shows up immediately
                const outboundMsg = {
                    sender: 'admin',
                    title: `To ${this.newCourierName}`,
                    message: this.newCourierMessage,
                    createdAt: new Date(),
                    isRead: true,
                    courierName: this.newCourierName,
                    type: 'admin'
                };
                this.adminNotifications.unshift(outboundMsg);
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.notiService.show('Failed to send message. Please check your connection.', 'Error', 'error');
            }
        });
    }

    sendCourierReply() {
        if (!this.courierReplyMessage.trim()) return;

        const payload = {
            courierName: this.currentReplyCourierName,
            title: 'Reply from Admin 📩',
            message: this.courierReplyMessage
        };

        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };

        this.http.post('/api/admin/notify-courier', payload, { headers }).subscribe({
            next: (res: any) => {
                this.notiService.show(`Reply sent to ${this.currentReplyCourierName}`, 'Message Sent', 'success', 'toast');
                this.showCourierReplyModal = false;
                this.loadAdminNotifications(); // Reload to show the sent message log
            },
            error: (err) => {
                this.notiService.show('Failed to send reply. Please check your connection.', 'Error', 'error');
            }
        });
    }

    getCourierName(noti: any): string {
        if (noti.courierName) return noti.courierName;
        
        // For outbound admin messages, the recipient (userId) is the courier name
        if (noti.sender === 'admin' && noti.userId && noti.userId !== 'admin') return noti.userId;

        // Fallback for older messages: "Message from Blue Dart 📥"
        if (noti.title && noti.title.toLowerCase().includes('from ')) {
            const matches = noti.title.match(/from\s+(Blue Dart|Delhivery|DTDC|[a-zA-Z0-9]+)/i);
            if (matches && matches[1] && matches[1].toLowerCase() !== 'admin') return matches[1];
        }
        return '';
    }

    markOneAsRead(noti: any) {
        if (noti.isRead) return;

        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };

        this.http.put(`/api/admin/notifications/${noti._id}/read`, {}, { headers }).subscribe({
            next: () => {
                noti.isRead = true;
                this.unreadNotificationsCount = Math.max(0, this.unreadNotificationsCount - 1);
                this.hasNotifications = this.unreadNotificationsCount > 0;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('Error marking notification as read:', err);
                noti.isRead = true;
                this.cdr.detectChanges();
            }
        });
    }

    deleteNotification(id: string, event: Event) {
        event.stopPropagation();
        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        const headers = { 'x-auth-token': token || '' };

        this.http.delete(`/api/admin/notifications/${id}`, { headers }).subscribe({
            next: () => {
                this.adminNotifications = this.adminNotifications.filter(n => n._id !== id);
                this.unreadNotificationsCount = this.adminNotifications.filter(n => !n.isRead).length;
                this.hasNotifications = this.unreadNotificationsCount > 0;
                this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Error deleting notification:', err)
        });
    }

    loadPlacements() {
        this.isLoadingPlacements = true;
        this.placementService.getAdminPlacements().subscribe({
            next: (data) => {
                this.ngZone.run(() => {
                    this.placements = data;
                    this.isLoadingPlacements = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading placements:', err);
                this.isLoadingPlacements = false;
                this.cdr.detectChanges();
            }
        });
    }

    openAddPlacementModal() {
        this.isEditingPlacement = false;
        this.editingPlacementId = null;
        this.newPlacement = {
            name: '',
            description: '',
            image: '',
            videoUrl: '',
            features: ['', '', ''],
            badge: 'NEW PLACEMENT',
            categoryRoute: '/products/plants'
        };
        this.showAddPlacementModal = true;
        this.toggleBodyScroll(true);
    }

    openEditPlacementModal(plac: Placement) {
        this.isEditingPlacement = true;
        this.editingPlacementId = plac._id || null;
        this.newPlacement = JSON.parse(JSON.stringify(plac)); // Deep copy
        this.showAddPlacementModal = true;
    }

    closeAddPlacementModal() {
        this.showAddPlacementModal = false;
        this.toggleBodyScroll(false);
    }

    submitPlacement() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        this.cdr.detectChanges();

        // Clean up empty features
        const placementData = { ...this.newPlacement };
        placementData.features = placementData.features.filter(f => f && f.trim() !== '');

        if (this.isEditingPlacement && this.editingPlacementId) {
            this.placementService.updatePlacement(this.editingPlacementId, placementData).subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.showAddPlacementModal = false;
                        this.toggleBodyScroll(false);
                        this.cdr.detectChanges();
                        this.loadPlacements();
                    });
                },
                error: (err) => {
                    console.error('Error updating placement:', err);
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.cdr.detectChanges();
                    });
                    alert('Error updating placement: ' + (err.error?.message || err.message));
                }
            });
        } else {
            this.placementService.addPlacement(placementData).subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.showAddPlacementModal = false;
                        this.toggleBodyScroll(false);
                        this.cdr.detectChanges();
                        this.loadPlacements();
                    });
                },
                error: (err) => {
                    console.error('Error adding placement:', err);
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.cdr.detectChanges();
                    });
                    alert('Error adding placement: ' + (err.error?.message || err.message));
                }
            });
        }
    }

    deletePlacement(id: string, name: string, image: string) {
        this.deleteTarget = { id, name, image, type: 'placement' };
        this.deleteSuccess = false;
        this.showDeleteModal = true;
    }

    loadOffers() {
        this.isLoadingOffers = true;
        this.cdr.detectChanges();
        this.offerService.getAllOffersAdmin().subscribe({
            next: (data) => {
                this.ngZone.run(() => {
                    this.offers = data;
                    this.isLoadingOffers = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading offers:', err);
                this.isLoadingOffers = false;
                this.cdr.detectChanges();
            }
        });
    }

    openAddOfferModal() {
        this.isEditingOffer = false;
        this.editingOfferId = null;
        this.newOffer = {
            badge: 'ðŸŒ¿ EXCLUSIVE DEAL',
            title: '',
            subtitle: '',
            discountLine: '',
            description: '',
            features: ['', '', ''],
            ctaText: 'GRAB THIS DEAL',
            ctaLink: '/',
            image: '',
            cardBg: '#f0fdf4',
            accentColor: '#16a34a',
            accentLight: '#dcfce7',
            accentText: '#14532d',
            tag: 'NEW',
            tagBg: '#fbbf24',
            tagText: '#78350f',
            timer: 'Ends Soon!',
            timerBg: '#dcfce7'
        };
        this.showAddOfferModal = true;
        this.toggleBodyScroll(true);
    }

    openEditOfferModal(offer: Offer) {
        this.isEditingOffer = true;
        this.editingOfferId = offer._id || null;
        this.newOffer = { ...offer };
        if (!this.newOffer.features) this.newOffer.features = ['', '', ''];
        this.showAddOfferModal = true;
        this.toggleBodyScroll(true);
    }

    closeAddOfferModal() {
        this.showAddOfferModal = false;
        this.toggleBodyScroll(false);
    }

    submitOffer() {
        if (this.isSubmitting) return;

        if (!this.newOffer.title || !this.newOffer.image) {
            alert('Title and Image are required!');
            return;
        }

        this.isSubmitting = true;
        this.cdr.detectChanges();
        const offerData = { ...this.newOffer };
        offerData.features = offerData.features.filter((f: string) => f && f.trim() !== '');

        if (this.isEditingOffer && this.editingOfferId) {
            this.offerService.updateOffer(this.editingOfferId, offerData).subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.showAddOfferModal = false;
                        this.toggleBodyScroll(false);
                        this.cdr.detectChanges();
                        this.loadOffers();
                    });
                },
                error: (err) => {
                    console.error('Error updating offer:', err);
                    this.isSubmitting = false;
                    this.cdr.detectChanges();
                    alert('Error updating offer');
                }
            });
        } else {
            this.offerService.addOffer(offerData).subscribe({
                next: () => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.showAddOfferModal = false;
                        this.toggleBodyScroll(false);
                        this.cdr.detectChanges();
                        this.loadOffers();
                    });
                },
                error: (err) => {
                    console.error('Error adding offer:', err);
                    this.isSubmitting = false;
                    this.cdr.detectChanges();
                    alert('Error adding offer');
                }
            });
        }
    }

    deleteOfferAdmin(id: string, title: string, image: string) {
        this.deleteTarget = { id, name: title, image, type: 'offer' };
        this.deleteSuccess = false;
        this.showDeleteModal = true;
    }

    loadProducts() {
        // Only show full loading state if we have no products yet
        if (Object.keys(this.productMap).length === 0) {
            this.isLoadingProducts = true;
        }
        this.cdr.detectChanges();

        this.productService.getAllProductsMap().subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.productMap = data;
                    this.isLoadingProducts = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err: any) => {
                console.error('Error loading products for admin:', err);
                this.isLoadingProducts = false;
                this.cdr.detectChanges();
            }
        });
    }

    setMainGroup(group: string) {
        this.activeMainCategory = group;
        this.productCategoryFilter = 'All';
    }

    getCategoryList() {
        if (!this.mainCategoryGroups[this.activeMainCategory]) return [];
        const cats = this.mainCategoryGroups[this.activeMainCategory];

        if (this.activeMainCategory === 'Accessories') {
            const accHeaders = [
                { key: 'Pots & Planters', label: 'Pots & Planters' },
                { key: 'Watering Equipment', label: 'Watering Equipment' },
                { key: 'Support & Protection', label: 'Support & Protection' },
                { key: 'Lighting Equipment', label: 'Lighting Equipment' },
                { key: 'Decorative & Display', label: 'Decorative & Display' }
            ];
            const soilHeaders = [
                { key: 'Soil Types', label: 'Soil Types' },
                { key: 'Organic Amendments', label: 'Organic Amendments' },
                { key: 'Growth Media', label: 'Growth Media' }
            ];
            const fertHeaders = [
                { key: 'Organic Fertilizers', label: 'Organic Fertilizers' },
                { key: 'Chemical Fertilizers', label: 'Chemical Fertilizers' },
                { key: 'Plant Boosters', label: 'Plant Boosters' }
            ];
            const toolHeaders = [
                { key: 'Hand Tools', label: 'Hand Tools' },
                { key: 'Cutting Tools', label: 'Cutting Tools' },
                { key: 'Digging Tools', label: 'Digging Tools' },
                { key: 'Power Tools', label: 'Power Tools' }
            ];
            const allHeaders = [...accHeaders, ...soilHeaders, ...fertHeaders, ...toolHeaders];

            if (this.activeCompanionGroup === 'All') return allHeaders;

            if (this.activeCompanionGroup === 'Accessories') return accHeaders;
            if (this.activeCompanionGroup === 'Soil & Growing Media') return soilHeaders;
            if (this.activeCompanionGroup === 'Fertilizers & Nutrients') return fertHeaders;
            if (this.activeCompanionGroup === 'Gardening Tools') return toolHeaders;
        }

        return cats;
    }

    getProductsForCategory(category: string): any[] {
        // --- BACKEND SEARCH INTEGRATION ---
        if (this.searchTerm && this.searchTerm.trim().length >= 2) {
            const results = this.backendResults || [];

            // If "All" view is active, we don't duplicate results for every group tab.
            // We just show them once in the first available tab.
            if (this.productCategoryFilter === 'All') {
                const categories = this.filteredProductCategories;
                if (categories && categories[0] === category) {
                    return results;
                }
                return [];
            }

            // If a specific sub-category filter is active (OR if we are in "All" loop above),
            // show results that match the current category.
            // However, we relax the check so that if the user searches for something, they see it.
            return results.filter((p: any) => {
                const pCat = (p.category || '').toLowerCase();
                const targetCat = category.toLowerCase();
                // Match exact category or if it belongs to this sub-category
                return pCat === targetCat || pCat.includes(targetCat) || targetCat.includes(pCat);
            });
        }

        // --- SPECIAL CASE: Dynamic Bestsellers ---
        if (category === 'Bestsellers' && this.productMap['Bestsellers']) {
            return this.productMap['Bestsellers'];
        }

        // --- LOCAL FILTERING LOGIC ---
        const navItems = this.navbarDefinitions[category] || [];
        const itemsToSearch = [category.toLowerCase(), ...navItems.map((i: string) => i.toLowerCase())];

        let allPotentialProducts: any[] = [];
        Object.values(this.productMap).forEach(products => {
            if (Array.isArray(products)) {
                allPotentialProducts = [...allPotentialProducts, ...products];
            }
        });

        const uniqueProducts = Array.from(new Map(allPotentialProducts.map(p => [p._id, p])).values());
        const filtered = uniqueProducts.filter((p: any) => {
            const pName = (p.name || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const pTags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];

            return itemsToSearch.some(item =>
                pName.includes(item) || pCat === item || pTags.includes(item)
            );
        });

        // Apply local search filter for short terms (< 2 chars)
        if (this.searchTerm && this.searchTerm.trim().length > 0 && this.searchTerm.trim().length < 2) {
            const term = this.searchTerm.toLowerCase();
            return filtered.filter((p: any) =>
                (p.name || '').toLowerCase().includes(term) ||
                (p.category || '').toLowerCase().includes(term)
            );
        }

        return filtered;
    }

    getFilteredCategoriesForModal() {
        const categories = this.getCategoryList();

        // If we are adding a product for a specific offer, filter categories
        if (!this.isEditingProduct && this.newProduct.tags) {
            const offerCode = this.newProduct.tags;

            if (offerCode === 'G-INDOOR-6-SEC') {
                return (categories as any[]).filter(c => c.key === 'Indoor Plants' || c.key.includes('Indoor'));
            }
            if (offerCode === 'G-GARDEN-6-SEC') {
                return (categories as any[]).filter(c => c.key === 'Gardening Tools' || c.key.includes('Tool'));
            }
            if (offerCode === 'G-FLOWER-6-SEC') {
                return (categories as any[]).filter(c => c.key === 'Flowering Plants' || c.key.includes('Flower'));
            }
            if (offerCode === 'G-BOGO-6-SECTION') {
                return (categories as any[]).filter(c => c.key === 'XL Plants' || c.key.includes('XL'));
            }
        }

        // Original logic for grouping by activeMainCategory and activeCompanionGroup
        if (!this.activeMainCategory || !this.mainCategoryGroups[this.activeMainCategory]) return [];

        if (this.activeMainCategory !== 'Accessories') {
            return this.mainCategoryGroups[this.activeMainCategory];
        }

        let targetSubGroups: string[] = [];

        if (this.productCategoryFilter !== 'All') {
            if (this.navbarDefinitions[this.productCategoryFilter]) {
                targetSubGroups = [this.productCategoryFilter];
            } else {
                return [{ key: this.productCategoryFilter, label: this.productCategoryFilter }];
            }
        } else {
            const companionMapping: any = {
                'Accessories': ['Pots & Planters', 'Watering Equipment', 'Support & Protection', 'Lighting Equipment', 'Decorative & Display'],
                'Soil & Growing Media': ['Soil Types', 'Organic Amendments', 'Growth Media'],
                'Fertilizers & Nutrients': ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'],
                'Gardening Tools': ['Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools']
            };
            targetSubGroups = companionMapping[this.activeCompanionGroup] || [];
        }

        if (targetSubGroups.length === 0) {
            return this.mainCategoryGroups['Accessories'];
        }

        const validCategories = new Set(targetSubGroups);
        targetSubGroups.forEach((group: string) => {
            (this.navbarDefinitions[group] || []).forEach((item: string) => validCategories.add(item));
        });

        return this.mainCategoryGroups['Accessories'].filter(cat => validCategories.has(cat.key));
    }

    getTypeBadgeClass(count: number): string {
        if (count > 10) return 'high-count';
        if (count > 0) return 'active-count';
        return 'zero-count';
    }

    getMainCategoryLabel(key: string) {
        if (key === 'Accessories') return 'Plant Companions';
        return key;
    }

    getCategoryIcon(category: string): string {
        const iconMap: { [key: string]: string } = {
            'Pots & Planters': 'fa-seedling',
            'Watering Equipment': 'fa-faucet-drip',
            'Support & Protection': 'fa-shield-heart',
            'Lighting Equipment': 'fa-lightbulb',
            'Decorative & Display': 'fa-star',
            'Soil Types': 'fa-mountain',
            'Organic Amendments': 'fa-leaf',
            'Growth Media': 'fa-wind',
            'Organic Fertilizers': 'fa-vial-circle-check',
            'Chemical Fertilizers': 'fa-flask-vial',
            'Plant Boosters': 'fa-bolt-lightning',
            'Hand Tools': 'fa-mitten',
            'Cutting Tools': 'fa-scissors',
            'Digging Tools': 'fa-trowel',
            'Power Tools': 'fa-plug-circle-bolt',
            'Accessories': 'fa-bucket',
            'Soil & Growing Media': 'fa-mountain-sun',
            'Fertilizers & Nutrients': 'fa-vial',
            'Gardening Tools': 'fa-tools',
            'Indoor Plants': 'fa-leaf',
            'Outdoor Plants': 'fa-sun-plant-wilt',
            'Flowering Plants': 'fa-wand-magic-sparkles',
            'XL Plants': 'fa-tree',
            'Bestsellers': 'fa-fire',
            'Air Purifying': 'fa-wind',
            'Vegetable Seeds': 'fa-carrot',
            'Fruit Seeds': 'fa-apple-whole',
            'Herb Seeds': 'fa-mortar-pestle',
            'Flower Seeds': 'fa-clover',
            'Microgreen Seeds': 'fa-spa',
            'Seeds Kit': 'fa-box-open',
            'Garden Toolkits': 'fa-toolbox'
        };
        return iconMap[category] || 'fa-tag';
    }

    getCategoryLabel(key: string) {
        if (key === 'All') return 'All';
        const allCats = [
            ...this.mainCategoryGroups['Plants'],
            ...this.mainCategoryGroups['Seeds'],
            ...this.mainCategoryGroups['Accessories']
        ];
        const match = allCats.find(c => c.key === key);
        return match ? match.label : key;
    }

    get filteredProductCategories() {
        if (this.activeMainCategory === 'Accessories') {
            if (this.productCategoryFilter === 'All') {
                if (this.activeCompanionGroup === 'All') {
                    return ['Accessories', 'Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
                }
                return this.getCategoryList().map((c: any) => c.key);
            }

            // Simple view: return only the active filter. 
            // getProductsForCategory() will handle searching child categories automatically.
            return [this.productCategoryFilter];
        }

        const categories = this.getCategoryList().map((c: any) => c.key);
        if (this.productCategoryFilter === 'All') return categories;
        return [this.productCategoryFilter];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    deleteUser(id: string, name: string) {
        if (confirm(`Are you sure you want to delete user: ${name}?`)) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== id);
                    this.stats[0].value = this.users.length.toString();
                },
                error: (err: any) => {
                    console.error('Error deleting user:', err);
                    alert('Failed to delete user');
                }
            });
        }
    }

    openAddProductModal(initialTag?: string) {
        this.isEditingProduct = false;
        this.editingProductId = null;
        this.isSubmitting = false; // Always reset on open
        this.newProduct = {
            name: '',
            price: '',
            originalPrice: '',
            discount: '',
            category: (this.productCategoryFilter !== 'All' && this.productCategoryFilter) ? this.productCategoryFilter : '',
            image: '',
            images: ['', '', '', ''],
            description: '',
            tags: initialTag || '',
            stock: 25
        };
        this.showAddProductModal = true;
        this.toggleBodyScroll(true);
    }

    openEditProductModal(product: any) {
        this.isEditingProduct = true;
        this.editingProductId = product._id;

        // Populate the form with existing product data
        this.newProduct = {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || '',
            discount: product.discount || '',
            category: product.category,
            image: product.image,
            images: product.images && product.images.length > 0 ? [...product.images] : ['', '', '', ''],
            description: product.description || '',
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
            stock: product.stock !== undefined ? product.stock : 25
        };

        // Ensure images array has at least 4 elements for the UI inputs
        while (this.newProduct.images.length < 4) {
            this.newProduct.images.push('');
        }

        this.showAddProductModal = true;
        this.toggleBodyScroll(true);
    }

    closeAddProductModal() {
        this.showAddProductModal = false;
        this.isSubmitting = false;
        this.toggleBodyScroll(false);
    }

    submitProduct() {
        if (this.isSubmitting) return; // Prevent double clicks

        // --- Frontend Validation ---
        const missing: string[] = [];
        if (!this.newProduct.name || !this.newProduct.name.trim()) missing.push('Product Name');
        if (!this.newProduct.price || !this.newProduct.price.toString().trim()) missing.push('Price');
        if (!this.newProduct.category || !this.newProduct.category.trim()) missing.push('Category');
        if (!this.newProduct.image || !this.newProduct.image.trim()) missing.push('Main Image URL');

        if (missing.length > 0) {
            alert('Please fill in the required fields:\n\nâ€¢ ' + missing.join('\nâ€¢ '));
            return; // Don't set isSubmitting, just return
        }

        // --- Duplicate Check (Only for NEW products) ---
        if (!this.isEditingProduct) {
            let existingProd = null;
            // Iterate through all categories in productMap to find a product with the same name
            for (const cat in this.productMap) {
                if (Array.isArray(this.productMap[cat])) {
                    const found = this.productMap[cat].find((p: any) =>
                        p.name.toLowerCase().trim() === this.newProduct.name.toLowerCase().trim()
                    );
                    if (found) {
                        existingProd = found;
                        break;
                    }
                }
            }

            if (existingProd) {
                this.duplicateProduct = existingProd;
                this.showDuplicateModal = true;
                this.toggleBodyScroll(true);
                return; // Stop submission if duplicate is found
            }
        }

        this.isSubmitting = true;
        this.cdr.detectChanges(); // force UI update immediately

        // Filter out empty strings from images array
        const cleanedImages = this.newProduct.images.filter((img: string) => img && img.trim() !== '');

        const productToSubmit = {
            ...this.newProduct,
            images: cleanedImages
        };

        const resetSubmitting = () => {
            this.ngZone.run(() => {
                this.isSubmitting = false;
                this.cdr.detectChanges();
            });
        };

        if (this.isEditingProduct && this.editingProductId) {
            // UPDATE existing product
            this.productService.updateProduct(this.editingProductId, productToSubmit).subscribe({
                next: (res: any) => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.triggerSuccessModal(res.name, res.category, 'updated', res.image);
                        this.closeAddProductModal();
                        this.loadProducts();
                        this.cdr.detectChanges();
                    });
                },
                error: (err: any) => {
                    console.error('Error updating product:', err);
                    const msg = err?.error?.message || 'Failed to update product';
                    resetSubmitting();
                    setTimeout(() => alert('Error: ' + msg), 50);
                }
            });
        } else {
            // ADD new product
            this.productService.addProduct(productToSubmit).subscribe({
                next: (res: any) => {
                    this.ngZone.run(() => {
                        this.isSubmitting = false;
                        this.triggerSuccessModal(res.name, res.category, 'added', res.image);
                        this.closeAddProductModal();
                        this.loadProducts();
                        this.cdr.detectChanges();
                    });
                },
                error: (err: any) => {
                    console.error('Error adding product:', err);
                    const msg = err?.error?.message || 'Failed to add product. Please check the server and try again.';
                    resetSubmitting();
                    setTimeout(() => alert('Error: ' + msg), 50);
                }
            });
        }
    }

    triggerSuccessModal(name: string, category: string, type: string, image: string) {
        this.successModalData = {
            name: name,
            path: this.getProductPath(category),
            image: image,
            type: type
        };
        this.showSuccessModal = true;
        this.toggleBodyScroll(true);
    }

    closeSuccessModal() {
        this.showSuccessModal = false;
        this.toggleBodyScroll(false);
    }

    handleUpdateDuplicate() {
        if (!this.duplicateProduct) return;

        const prodToEdit = { ...this.duplicateProduct };
        this.showDuplicateModal = false;
        this.duplicateProduct = null;

        // This will open the edit modal with the existing product's data
        this.openEditProductModal(prodToEdit);
    }

    getProductPath(category: string): string {
        const mainLabel = this.getMainCategoryLabel(this.activeMainCategory);
        let subLabel = category;

        // Try to find the label in mainCategoryGroups
        const groups = this.mainCategoryGroups[this.activeMainCategory] || [];
        const match = groups.find(g => g.key === category);
        if (match) subLabel = match.label;

        // If it's Accessories, it might be in a companion group
        if (this.activeMainCategory === 'Accessories' && this.activeCompanionGroup !== 'Accessories') {
            return `${mainLabel} > ${this.activeCompanionGroup} > ${subLabel}`;
        }

        return `${mainLabel} > ${subLabel}`;
    }

    openDeleteModal(id: string, name: string, image?: string) {
        this.deleteTarget = { id, name, image, type: 'product' };
        this.deleteSuccess = false;
        this.showDeleteModal = true;
        this.toggleBodyScroll(true);
    }

    cancelDelete() {
        this.showDeleteModal = false;
        this.deleteSuccess = false;
        this.deleteTarget = { id: '', name: '', type: 'product' };
        this.toggleBodyScroll(false);
    }

    confirmDelete() {
        const { id, type } = this.deleteTarget;

        let deleteObs;
        if (type === 'placement') {
            deleteObs = this.placementService.deletePlacement(id);
        } else if (type === 'offer') {
            deleteObs = this.offerService.deleteOffer(id);
        } else if (type === 'faq') {
            deleteObs = this.faqService.deleteFaq(id);
        } else if (type === 'about') {
            deleteObs = this.aboutService.deleteAboutSection(id);
        } else {
            deleteObs = this.productService.deleteProduct(id);
        }

        deleteObs.subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.deleteSuccess = true;
                    this.cdr.detectChanges();

                    if (type === 'placement') this.loadPlacements();
                    else if (type === 'offer') this.loadOffers();
                    else if (type === 'faq') this.loadFaqs();
                    else if (type === 'about') this.loadAboutSections();
                    else this.loadProducts();

                    // Auto-close after 1.8 seconds
                    setTimeout(() => {
                        this.ngZone.run(() => {
                            this.showDeleteModal = false;
                            this.deleteSuccess = false;
                            this.toggleBodyScroll(false);
                            this.cdr.detectChanges();
                        });
                    }, 1800);
                });
            },
            error: (err: any) => {
                const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item';
                console.error(`Error deleting ${typeLabel}:`, err);
                const msg = err?.error?.message || `${typeLabel} could not be deleted. Please try again.`;
                this.ngZone.run(() => {
                    this.showDeleteModal = false;
                    this.toggleBodyScroll(false);
                    this.cdr.detectChanges();
                    setTimeout(() => alert('âŒ ' + msg), 50);
                });
            }
        });
    }

    deleteProduct(id: string, name: string) {
        this.openDeleteModal(id, name);
    }

    loadFaqs() {
        this.isLoadingFaqs = true;
        this.faqService.getAdminFaqs().subscribe({
            next: (data) => {
                this.faqs = data;
                this.isLoadingFaqs = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading FAQs:', err);
                this.isLoadingFaqs = false;
                this.cdr.detectChanges();
            }
        });
    }

    openAddFaqModal() {
        this.newFaq = {
            question: '',
            answer: '',
            category: 'Orders',
            order: (this.faqs.length + 1)
        };
        this.isEditingFaq = false;
        this.editingFaqId = null;
        this.showAddFaqModal = true;
        this.toggleBodyScroll(true);
    }

    closeAddFaqModal() {
        this.showAddFaqModal = false;
        this.isEditingFaq = false;
        this.editingFaqId = null;
        this.toggleBodyScroll(false);
    }

    openEditFaqModal(faq: Faq) {
        this.newFaq = { ...faq };
        this.isEditingFaq = true;
        this.editingFaqId = faq._id || null;
        this.showAddFaqModal = true;
        this.toggleBodyScroll(true);
    }

    submitFaq() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        this.cdr.detectChanges();

        const obs = (this.isEditingFaq && this.editingFaqId)
            ? this.faqService.updateFaq(this.editingFaqId, this.newFaq)
            : this.faqService.addFaq(this.newFaq);

        obs.subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.isSubmitting = false;
                    this.showAddFaqModal = false;
                    this.toggleBodyScroll(false);
                    this.loadFaqs();
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error saving FAQ:', err);
                this.ngZone.run(() => {
                    this.isSubmitting = false;
                    this.cdr.detectChanges();
                    alert('Error saving FAQ: ' + (err.error?.message || err.message));
                });
            }
        });
    }

    get filteredFaqCategories() {
        if (this.faqCategoryFilter === 'All') return this.faqCategories;
        return [this.faqCategoryFilter];
    }

    getFaqsForCategory(category: string): Faq[] {
        return this.faqs.filter(f => f.category === category);
    }

    getFaqCategoryIcon(category: string): string {
        const iconMap: { [key: string]: string } = {
            'Orders': 'fa-shopping-cart',
            'Payment': 'fa-credit-card',
            'Delivery': 'fa-truck',
            'Plants': 'fa-leaf',
            'Returns': 'fa-undo',
            'Account': 'fa-user-circle'
        };
        return iconMap[category] || 'fa-question-circle';
    }

    getFaqCategoryColor(category: string): string {
        const colorMap: { [key: string]: string } = {
            'Orders': '#2563eb',
            'Payment': '#a16207',
            'Delivery': '#166534',
            'Plants': '#15803d',
            'Returns': '#b91c1c',
            'Account': '#7e22ce'
        };
        return colorMap[category] || '#10b981';
    }

    // ==========================================
    // ORDER MANAGEMENT METHODS
    // ==========================================

    get filteredOrdersV2() {
        let filtered = this.orders;

        // Filter by Status
        if (this.orderStatusFilter !== 'All') {
            filtered = filtered.filter(o => o.status === this.orderStatusFilter);
        }

        // Search by ID, Customer Name, or Email
        if (this.orderSearchQuery && this.orderSearchQuery.trim() !== '') {
            const query = this.orderSearchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.orderId.toLowerCase().includes(query) ||
                (o.userId?.fullName?.toLowerCase() || '').includes(query) ||
                (o.userId?.email?.toLowerCase() || '').includes(query) ||
                (o.userId?.phone || '').includes(query)
            );
        }

        return filtered;
    }

    getTotalRevenue() {
        return this.orders.reduce((acc, order) => {
            if (this.getStatusClass(order.status) !== 'status-cancelled') {
                return acc + (order.totalAmount || 0);
            }
            return acc;
        }, 0).toLocaleString();
    }

    getOrdersByStatus(status: string) {
        return this.orders.filter(o => o.status === status);
    }

    getStatusIcon(status: string) {
        const icons: { [key: string]: string } = {
            'Pending': 'fa-clock',
            'Processing': 'fa-sync-alt',
            'Shipped': 'fa-truck-fast',
            'Delivered': 'fa-circle-check',
            'Cancelled': 'fa-circle-xmark'
        };
        return icons[status] || 'fa-box';
    }

    isNewOrder(order: any) {
        const orderDate = new Date(order.orderDate);
        const now = new Date();
        const diffInMs = now.getTime() - orderDate.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours < 24;
    }

    // =============================================
    // DELIVERY STATUS TRANSITION HELPERS
    // Rules: 2-day -> OFD after 1 day
    //        4-day -> OFD after 2 days
    //        7-day -> OFD after 4 days
    //       10-day -> OFD after 8 days
    // =============================================

    getDeliveryDurationDays(order: any): number {
        const dt = (order.deliveryType || '').toLowerCase();
        if (dt.includes('2')) return 2;
        if (dt.includes('4')) return 4;
        if (dt.includes('7')) return 7;
        if (dt.includes('10')) return 10;
        return 7; // default
    }

    getOutForDeliveryThresholdDays(order: any): number {
        const days = this.getDeliveryDurationDays(order);
        const thresholdMap: { [k: number]: number } = { 2: 1, 4: 2, 7: 4, 10: 8 };
        return thresholdMap[days] ?? Math.floor(days / 2);
    }

    getExpectedDeliveryDate(order: any): Date | null {
        const shippedAt = order.assignedAt ? new Date(order.assignedAt) : null;
        if (!shippedAt) return null;
        const days = this.getDeliveryDurationDays(order);
        return new Date(shippedAt.getTime() + days * 24 * 60 * 60 * 1000);
    }

    getEffectiveStatus(order: any): string {
        if (!order || !order.assignedAt || order.status !== 'Shipped') {
            return order?.status || 'Processing';
        }
        const shippedAt = new Date(order.assignedAt);
        const now = new Date();
        const daysSinceShipping = (now.getTime() - shippedAt.getTime()) / (1000 * 60 * 60 * 24);
        const deliveryDays = this.getDeliveryDurationDays(order);
        const threshold = this.getOutForDeliveryThresholdDays(order);
        if (daysSinceShipping >= deliveryDays) return 'Delivered';
        if (daysSinceShipping >= threshold) return 'Out for Delivery';
        return 'Shipped';
    }

    getOfferBadgeFromCode(code: string): string | null {
        const offer = this.offerSectionCodes.find(o => o.code === code);
        return offer ? offer.badge : null;
    }

    loadOrders() {
        this.isLoadingOrders = true;
        this.cdr.detectChanges();

        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            this.isLoadingOrders = false;
            return;
        }

        this.http.get('/api/admin/orders', { headers: { 'x-auth-token': token } }).subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    if (this.lastOrderCount !== -1 && data.length > this.lastOrderCount) {
                        this.triggerNewNotification();
                    }
                    this.lastOrderCount = data.length;

                    // Filter out orders marked as "Guest Customer" or those missing registered user data
                    this.orders = data.filter((order: any) => {
                        const name = (order.userName || order.userId?.fullName || '').trim();
                        return name !== 'Guest Customer';
                    });

                    this.calculatePaymentSummary();
                    this.updateDashboardStats();
                    this.isLoadingOrders = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error loading orders:', err);
                this.isLoadingOrders = false;
                this.cdr.detectChanges();
            }
        });
    }

    calculatePaymentSummary() {
        if (!this.orders || this.orders.length === 0) {
            this.paymentSummary = { total: 0, cod: 0, online: 0, codPercentage: 0, onlinePercentage: 0 };
            return;
        }

        let cod = 0;
        let online = 0;

        this.orders.forEach(o => {
            const method = (o.paymentMethod || '').toUpperCase();
            if (method.includes('CASH') || method.includes('COD')) {
                cod++;
            } else {
                online++;
            }
        });

        const total = cod + online;
        this.paymentSummary = {
            total,
            cod,
            online,
            codPercentage: total > 0 ? Math.round((cod / total) * 100) : 0,
            onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0
        };

        this.calculateAdminPaymentStats();
    }

    loadPaymentSummary() {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        this.http.get('/api/admin/payment-summary', { headers: { 'x-auth-token': token } }).subscribe({
            next: (data: any) => {
                this.paymentSummary = data;
                this.backendRevenue = data.totalRevenue || 0;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading payment summary:', err)
        });
    }

    updateOrderStatus(orderId: string, newStatus: string) {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        const targetOrder = this.orders.find(o => o._id === orderId);
        if (!targetOrder) return;

        const body: any = { status: newStatus };

        // Auto-select courier if not manually selected and transitioning to Shipped
        let currentCourier = this.selectedCourier;
        if (newStatus === 'Shipped' && !currentCourier) {
            const state = this.extractState(targetOrder);
            currentCourier = this.findRecommendedCourier(state);
        }

        if (currentCourier) body.courierName = currentCourier;
        if (this.trackingNumber) body.trackingNumber = this.trackingNumber;
        if (this.expectedDeliveryDate) body.expectedDeliveryDate = this.expectedDeliveryDate;

        if (newStatus === 'Shipped') {
            if (!currentCourier) {
                alert('Please select a courier partner.');
                return;
            }

            // VALIDATION: Check if courier matches state
            const orderState = this.extractState(targetOrder);
            const allowedStates = this.courierStateMapping[currentCourier] || [];

            if (!allowedStates.includes(orderState)) {
                this.suggestedCourier = this.findRecommendedCourier(orderState);
                this.showCourierMismatchError = true;
                this.isShaking = true;

                // Visual feedback: Stop shaking after 500ms
                setTimeout(() => {
                    this.isShaking = false;
                    this.cdr.detectChanges();
                }, 500);

                this.cdr.detectChanges();
                return;
            }

            // Clear error if validation passes
            this.showCourierMismatchError = false;

            // Auto-generate if not manually entered (this doesn't count towards the 3-click limit)
            if (!this.trackingNumber) {
                this.trackingNumber = this.createTrackingNumberString();
                body.trackingNumber = this.trackingNumber;
            }

            // Auto-calculate expected delivery date based on deliveryType
            if (!this.expectedDeliveryDate && targetOrder.deliveryType) {
                const durationDays = this.getDeliveryDurationDays(targetOrder);
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + durationDays);
                body.expectedDeliveryDate = deliveryDate.toISOString();
            }

            // Always set assignedAt for OFD threshold calculation
            body.assignedAt = new Date().toISOString();
        }

        this.http.put(`/api/admin/orders/${orderId}/status`, body, { headers: { 'x-auth-token': token } })
            .subscribe({
                next: (updatedOrder: any) => {
                        this.ngZone.run(() => {
                        const idx = this.orders.findIndex(o => o._id === orderId);
                        if (idx !== -1) {
                            this.orders[idx] = updatedOrder;
                            this.selectedCourier = '';
                            this.trackingNumber = '';
                            
                            // Close modal after successful dispatch
                            if (updatedOrder.status === 'Shipped') {
                                this.closeOrderModal();
                            }
                            
                            this.cdr.detectChanges();
                        }
                    });
                },
                error: (err) => console.error('Error updating order:', err)
            });
    }
    dispatchOrder(orderId: string) {
        this.updateOrderStatus(orderId, 'Shipped');
    }

    // WhatsApp Notifications (Free Method)
    sendWhatsAppUpdate(order: any) {
        if (!order || !order.userId?.phone || order.userId.phone === 'Not provided') {
            alert('User phone number not available.');
            return;
        }

        const phone = order.userId.phone.replace(/\D/g, ''); // Keep only digits
        const orderId = order.orderId;
        const status = order.status;
        const tracking = order.trackingNumber || 'Processing...';
        const courier = order.courierName || 'Will be updated';
        const deliveryDate = order.expectedDeliveryDate ?
            new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }) :
            'Coming Soon';
        const pin = order.deliveryPin || 'Will be shared on Shipping';

        const message = encodeURIComponent(
            `*Greenie Culture Order Update*\n\n` +
            `Hello ${order.userId.fullName},\n` +
            `Your order *${orderId}* status is: *${status}*\n\n` +
            `Courier: ${courier}\n` +
            `Tracking ID: ${tracking}\n` +
            `Expected Delivery: ${deliveryDate}\n` +
            `Delivery PIN: ${pin}\n\n` +
            `Note: Please share this PIN ONLY with the delivery partner.\n\n` +
            `Track here: http://localhost:3000/my-account/orders`
        );
        window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
    }

    // Modal helpers
    generateTrackingNumber(orderId: string) {
        if (!orderId) return;

        const now = Date.now();
        if (!this.trackingGenLimits[orderId]) {
            this.trackingGenLimits[orderId] = { count: 0, lockUntil: 0 };
        }

        const state = this.trackingGenLimits[orderId];

        // Check if locked
        if (state.lockUntil > now) {
            const minutesLeft = Math.ceil((state.lockUntil - now) / 60000);
            alert(`Limit reached. Please wait ${minutesLeft} minutes.`);
            return;
        }

        // Reset if cooldown has passed
        if (state.lockUntil !== 0 && now > state.lockUntil) {
            state.count = 0;
            state.lockUntil = 0;
        }

        if (state.count < 1) {
            this.trackingNumber = this.createTrackingNumberString();
            state.count++;

            if (state.count === 1) {
                state.lockUntil = now + (5 * 60 * 1000); // 5 minutes lock
            }
        }
    }

    // Check if the button should be disabled
    isTrackingDisabled(orderId: string): boolean {
        const state = this.trackingGenLimits[orderId];
        if (!state) return false;
        return state.count >= 1 && Date.now() < state.lockUntil;
    }

    private createTrackingNumberString(): string {
        const prefix = 'GC';
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `${prefix}-${date}-${random}`;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Shipped': return 'status-shipped';
            case 'Delivered': return 'status-delivered';
            case 'Cancelled': return 'status-cancelled';
            default: return 'status-unknown';
        }
    }


    deleteFaqAdmin(id: string, question: string) {
        this.deleteTarget = { id, name: question, type: 'faq' };
        this.deleteSuccess = false;
        this.showDeleteModal = true;
        this.toggleBodyScroll(true);
    }

    // --- About Us Management Methods ---
    loadAboutSections() {
        this.isLoadingAbout = true;
        this.aboutService.getAdminAboutSections().subscribe({
            next: (data) => {
                this.aboutSections = data;
                this.isLoadingAbout = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading about sections:', err);
                this.isLoadingAbout = false;
                this.cdr.detectChanges();
            }
        });
    }

    openAddAboutModal() {
        this.newAboutSection = {
            type: 'journey',
            title: '',
            content: '',
            icon: '',
            image: '',
            author: '',
            order: (this.aboutSections.length + 1)
        };
        this.isEditingAbout = false;
        this.editingAboutId = null;
        this.showAddAboutModal = true;
        this.toggleBodyScroll(true);
    }

    closeAddAboutModal() {
        this.showAddAboutModal = false;
        this.isEditingAbout = false;
        this.editingAboutId = null;
        this.toggleBodyScroll(false);
    }

    openEditAboutModal(section: AboutSection) {
        this.newAboutSection = { ...section };
        this.isEditingAbout = true;
        this.editingAboutId = section._id || null;
        this.showAddAboutModal = true;
        this.toggleBodyScroll(true);
    }

    submitAboutSection() {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        this.cdr.detectChanges();

        const obs = (this.isEditingAbout && this.editingAboutId)
            ? this.aboutService.updateAboutSection(this.editingAboutId, this.newAboutSection)
            : this.aboutService.addAboutSection(this.newAboutSection);

        obs.subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.isSubmitting = false;
                    this.showAddAboutModal = false;
                    this.toggleBodyScroll(false);
                    this.loadAboutSections();
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error saving about section:', err);
                this.ngZone.run(() => {
                    this.isSubmitting = false;
                    this.cdr.detectChanges();
                    alert('Error saving about section: ' + (err.error?.message || err.message));
                });
            }
        });
    }

    deleteAboutAdmin(id: string, title: string) {
        this.deleteTarget = { id, name: title, type: 'about' };
        this.deleteSuccess = false;
        this.showDeleteModal = true;
        this.toggleBodyScroll(true);
    }

    getOfferCodeByOffer(offer: any): string | null {
        if (!offer) return null;
        if (offer.badge) {
            const matchByBadge = this.offerSectionCodes.find(o => o.badge === offer.badge);
            if (matchByBadge) return matchByBadge.code;
        }
        return this.getOfferCodeByLink(offer.ctaLink);
    }

    getOfferCodeByLink(ctaLink: string | undefined): string | null {
        if (!ctaLink) return null;

        // Normalize: remove trailing slashes and ensure leading slash
        let link = ctaLink.trim();
        if (!link.startsWith('/')) link = '/' + link;
        if (link.endsWith('/') && link.length > 1) link = link.slice(0, -1);

        // 1. Try to match by "page" property in offerSectionCodes
        const matchByPage = this.offerSectionCodes.find(o => o.page === link);
        if (matchByPage) return matchByPage.code;

        // 2. Try to match by "code" property (if it's a direct collection link like /collection/CODE)
        const parts = link.split('/');
        const lastPart = parts[parts.length - 1];
        const matchByCode = this.offerSectionCodes.find(o => o.code === lastPart);
        if (matchByCode) return matchByCode.code;

        return null;
    }

    viewOfferCards(offerCode: string) {
        console.log('Triggering viewOfferCards for code:', offerCode);
        this.activeOfferCode = offerCode;
        // Find the badge for this code
        const codeInfo = this.offerSectionCodes.find(o => o.code === offerCode);
        this.activeOfferBadge = codeInfo ? codeInfo.badge : '';

        this.isLoadingProducts = true;
        this.showAssociatedProductsModal = true;
        this.associatedProducts = [];

        this.productService.getProductsByOfferCode(offerCode).subscribe({
            next: (products) => {
                this.ngZone.run(() => {
                    this.associatedProducts = products;
                    this.isLoadingProducts = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error fetching associated products:', err);
                this.ngZone.run(() => {
                    this.isLoadingProducts = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    closeAssociatedProductsModal() {
        this.showAssociatedProductsModal = false;
        this.associatedProducts = [];
        this.activeOfferCode = '';
        this.activeOfferBadge = '';
        this.cdr.detectChanges();
    }

    removeProductFromOffer(product: any) {
        if (!confirm(`Are you sure you want to remove ${product.name} from this offer?`)) return;

        // Clone the product and remove the activeOfferCode from tags
        const updatedProduct = { ...product };
        if (Array.isArray(updatedProduct.tags)) {
            updatedProduct.tags = updatedProduct.tags.filter((t: string) => t !== this.activeOfferCode);
        }

        // Also check category just in case it's set as category
        if (updatedProduct.category === this.activeOfferCode) {
            updatedProduct.category = 'Plants'; // Default back to Plants or something safe
        }

        this.productService.updateProduct(product._id, updatedProduct).subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.associatedProducts = this.associatedProducts.filter(p => p._id !== product._id);
                    this.cdr.detectChanges();
                    // Optional: show a small toast or message
                });
            },
            error: (err) => {
                console.error('Error removing product from offer:', err);
                alert('Failed to remove product.');
            }
        });
    }

    openAddProductToOfferModal() {
        this.addProductSearchTerm = '';
        this.showAddProductToOfferModal = true;

        // Safety: If products aren't loaded (e.g. user went straight to Offers), load them now
        if (Object.keys(this.productMap).length === 0) {
            this.loadProducts();
        }

        // Flatten productMap to get all unique products
        let all: any[] = [];
        Object.values(this.productMap).forEach(list => {
            if (Array.isArray(list)) all = [...all, ...list];
        });

        // Unique by _id and exclude already associated
        const existingIds = new Set(this.associatedProducts.map(p => p._id));
        this.allProductsList = Array.from(new Map(all.map(p => [p._id, p])).values())
            .filter(p => !existingIds.has(p._id));

        this.cdr.detectChanges();
    }

    get filteredProductsForOfferList(): any[] {
        if (!this.addProductSearchTerm.trim()) return this.allProductsList.slice(0, 50); // Limit initial view

        const term = this.addProductSearchTerm.toLowerCase();
        return this.allProductsList.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.category || '').toLowerCase().includes(term)
        ).slice(0, 50);
    }

    addProductToOffer(product: any) {
        const updatedProduct = { ...product };
        
        let currentTags = [];
        if (Array.isArray(updatedProduct.tags)) {
            currentTags = [...updatedProduct.tags];
        } else if (typeof updatedProduct.tags === 'string' && updatedProduct.tags.trim() !== '') {
            currentTags = updatedProduct.tags.split(',').map((t: string) => t.trim());
        }
        
        if (!currentTags.includes(this.activeOfferCode)) {
            currentTags.push(this.activeOfferCode);
        }
        updatedProduct.tags = currentTags;

        this.productService.updateProduct(product._id, updatedProduct).subscribe({
            next: (res) => {
                this.ngZone.run(() => {
                    this.associatedProducts.push(res);
                    this.allProductsList = this.allProductsList.filter(p => p._id !== product._id);
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('Error adding product to offer:', err);
                alert('Failed to add product.');
            }
        });
    }

    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Code copied: ' + text);
        });
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }


    loadInquiries() {
        this.isLoadingInquiries = true;
        this.inquiryService.getAllInquiries().subscribe({
            next: (data) => {
                this.inquiries = data;
                this.isLoadingInquiries = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading inquiries:', err);
                this.isLoadingInquiries = false;
                this.cdr.detectChanges();
            }
        });
    }

    openReplyModal(inquiry: Inquiry) {
        this.selectedInquiry = inquiry;
        this.replyContent = inquiry.reply?.content || '';
        this.showReplyModal = true;
        this.toggleBodyScroll(true);
    }

    closeReplyModal() {
        this.showReplyModal = false;
        this.selectedInquiry = null;
        this.replyContent = '';
        this.toggleBodyScroll(false);
    }

    submitReply() {
        if (!this.selectedInquiry || !this.replyContent.trim()) return;

        this.isSubmitting = true;
        this.inquiryService.replyToInquiry(this.selectedInquiry._id!, this.replyContent).subscribe({
            next: (res) => {
                console.log('Reply submitted:', res);
                this.isSubmitting = false;
                this.loadInquiries();
                this.closeReplyModal();
            },
            error: (err) => {
                console.error('Reply error:', err);
                this.isSubmitting = false;
                this.notiService.show('Failed to submit your reply. Please try again.', 'Submission Error', 'error');
            }
        });
    }

    updateDashboardStats() {
        if (!this.stats || this.stats.length < 4) return;
        if (!this.orderStats || this.orderStats.length < 4) return;

        const totalOrdersCount = (this.orders || []).length;
        const totalUsersCount = (this.users || []).length;

        if (this.orders && this.orders.length > 0) {
            // --- MAIN DASHBOARD STATS (Total Orders, Total Sales, Conversion Rate, Total Products) ---
            const totalRevenueValue = (this.orders || []).reduce((acc, order) => {
                if (this.getStatusClass(order.status) !== 'status-cancelled') {
                    return acc + (Number(order.totalAmount) || 0);
                }
                return acc;
            }, 0);
            const deliveredOrders = this.orders.filter(o => o.status === 'Delivered').length;
            const convRate = totalOrdersCount > 0 ? ((deliveredOrders / totalOrdersCount) * 100).toFixed(1) : '0';

            this.stats[0].value = totalOrdersCount.toString();
            this.stats[1].value = '₹' + totalRevenueValue.toLocaleString();
            this.stats[2].value = convRate + '%';
            this.stats[3].value = (this.allProductsList || []).length.toString();

            // --- SPECIALIZED ORDER PAGE STATS (VOLUME, REVENUE, PIPELINE, FULFILLED) ---
            const inPipelineCount = this.orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length;
            
            this.orderStats[0].value = totalOrdersCount.toString();
            this.orderStats[1].value = '₹' + totalRevenueValue.toLocaleString();
            this.orderStats[2].value = inPipelineCount.toString();
            this.orderStats[3].value = deliveredOrders.toString();

            // --- REAL CONVERSION ANALYTICS LOGIC ---
            const successfulOrders = this.orders.filter(o => o.status === 'Delivered').length;
            const visitorsSim = totalUsersCount > 0 ? totalUsersCount * 5 : 100; // Simulated visitors based on users
            
            // 2. Add to Cart Rate
            const usersWithItems = this.users.filter(u => u.cart && u.cart.length > 0).length;
            const cartRate = totalUsersCount > 0 ? (usersWithItems / totalUsersCount * 100) : 0;

            // 3. Checkout Started Rate (Proxy: Orders + Current Cart users)
            const checkoutStarts = totalOrdersCount + usersWithItems;
            const checkoutRate = totalUsersCount > 0 ? Math.min(100, (checkoutStarts / totalUsersCount * 90)) : 0;

            // 5 & 6. New vs Repeat logic
            const userOrdersMap: { [key: string]: number } = {};
            this.orders.forEach(o => {
                const uid = o.userId?._id || o.userId;
                if (uid) userOrdersMap[uid] = (userOrdersMap[uid] || 0) + 1;
            });
            const repeatCustomers = Object.values(userOrdersMap).filter(c => c > 1).length;
            const repeatRate = totalUsersCount > 0 ? (repeatCustomers / totalUsersCount * 100) : 0;

            // 7. Abandoned Cart Rate
            const abandedCount = this.users.filter(u => u.cart?.length > 0 && !userOrdersMap[u.id]).length;
            const abandonRate = usersWithItems > 0 ? (abandedCount / usersWithItems * 100) : 0;

            // 8. Top Products
            const productSales: { [key: string]: any } = {};
            this.orders.forEach(o => {
                (o.items || []).forEach((item: any) => {
                    if (!productSales[item.name]) {
                        productSales[item.name] = { name: item.name, count: 0, image: item.image || 'https://cdn-icons-png.flaticon.com/512/628/628283.png' };
                    }
                    productSales[item.name].count += (item.quantity || 1);
                });
            });
            const topProducts = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 3);

            this.realConversion = {
                visitors: visitorsSim,
                orders: totalOrdersCount,
                successfulOrders: successfulOrders,
                convRate: totalUsersCount > 0 ? Number((totalOrdersCount / totalUsersCount * 100).toFixed(1)) : 0,
                cartRate: Number(cartRate.toFixed(1)),
                checkoutRate: Number(checkoutRate.toFixed(1)),
                newCustRate: totalUsersCount > 0 ? Number(((totalUsersCount - repeatCustomers) / totalUsersCount * 100).toFixed(1)) : 0,
                repeatRate: Number(repeatRate.toFixed(1)),
                abandonRate: Number(abandonRate.toFixed(1)),
                topProducts: topProducts
            };

            // Sync main stat card
            this.stats[3].value = this.realConversion.convRate + '%';

            // Update Chart Trends
            const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const counts: { [key: string]: number } = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

            // Determine the "Reference Date"
            let refDate = new Date();
            let latestOrderDate: Date | null = null;

            this.orders.forEach(o => {
                if (o.orderDate) {
                    const d = new Date(o.orderDate);
                    if (!latestOrderDate || d > latestOrderDate) latestOrderDate = d;
                }
            });

            // If the latest order is older than 7 days, anchor to it to show mock data
            if (latestOrderDate) {
                const latestOrder = latestOrderDate as Date;
                if ((refDate.getTime() - latestOrder.getTime()) > (7 * 24 * 60 * 60 * 1000)) {
                    refDate = new Date(latestOrder);
                }
            }

            const windowStart = new Date(refDate);
            windowStart.setDate(windowStart.getDate() - 7);

            // Calculate New Users this week
            const newOnes = this.users.filter(u => u.date && new Date(u.date) >= windowStart);
            this.newUsersThisWeek = newOnes.length;
            this.newUsersPercentage = this.users.length > 0 ? Math.round((this.newUsersThisWeek / this.users.length) * 100) : 0;

            this.orders.forEach(order => {
                if (order.orderDate) {
                    const date = new Date(order.orderDate);
                    if (date >= windowStart) {
                        const dayName = daysShort[date.getDay()];
                        if (counts[dayName] !== undefined) {
                            counts[dayName]++;
                        }
                    }
                }
            });

            const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const maxCount = Math.max(...Object.values(counts), 1);

            this.dashboardTrends = orderedDays.map(day => {
                const count = counts[day];
                // Base height of 8% even if 0, so bars are always visible.
                const visualHeight = count > 0 ? Math.max((count / maxCount) * 100, 20) : 8;
                return {
                    day,
                    count,
                    visualHeight
                };
            });

            // Calculate Day-wise Pie Distribution
            const totalTrendOrders = Object.values(counts).reduce((a, b) => a + b, 0);
            this.totalWeeklyOrders = totalTrendOrders;
            const dayColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

            if (totalTrendOrders > 0) {
                let currentDayOffset = 0;
                this.daySlices = orderedDays.map((day, i) => {
                    const count = counts[day];
                    const percentage = (count / totalTrendOrders) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const dashOffset = 100 - currentDayOffset + 25;
                    currentDayOffset += percentage;
                    return {
                        label: day,
                        count,
                        percentage: Math.round(percentage),
                        color: dayColors[i],
                        dashArray,
                        dashOffset: dashOffset % 100
                    };
                });
            } else {
                this.daySlices = orderedDays.map((day, i) => ({
                    label: day, count: 0, percentage: 0, color: dayColors[i],
                    dashArray: '0 100', dashOffset: 25
                }));
            }

            // Update Pie Chart (Full distribution)
            const total = this.orders.length;
            const pending = this.getOrdersByStatus('Pending').length;
            const shipped = this.getOrdersByStatus('Shipped').length;
            const delivered = this.getOrdersByStatus('Delivered').length;
            const cancelled = this.getOrdersByStatus('Cancelled').length;

            const p1 = (pending / total) * 100;
            const p2 = p1 + (shipped / total) * 100;
            const p3 = p2 + (delivered / total) * 100;

            this.pieChartStyle = `conic-gradient(
                #f59e0b 0% ${p1}%, 
                #3b82f6 ${p1}% ${p2}%, 
                #10b981 ${p2}% ${p3}%, 
                #ef4444 ${p3}% 100%
            )`;

            // --- Advanced Interactive Sales Distribution ---
            const groupedStats = {
                Plants: { count: 0, color: '#10b981', label: 'Plants' },
                Accessories: { count: 0, color: '#3b82f6', label: 'Accessories' },
                Offers: { count: 0, color: '#f59e0b', label: 'Promotion' },
                Other: { count: 0, color: '#6366f1', label: 'Others' }
            };

            let totalItemsBase = 0;
            this.orders.forEach(order => {
                if (order.status !== 'Cancelled' && order.items) {
                    order.items.forEach((item: any) => {
                        const qty = item.quantity || 1;
                        totalItemsBase += qty;
                        const cat = (item.category || '').toLowerCase();
                        const hasDiscount = (item.discountPrice && item.discountPrice < item.price) || order.appliedOffer;

                        if (hasDiscount) {
                            groupedStats.Offers.count += qty;
                        } else if (cat.includes('plant') || cat.includes('cactus') || cat.includes('succul')) {
                            groupedStats.Plants.count += qty;
                        } else if (cat.includes('tool') || cat.includes('pot') || cat.includes('fert') || cat.includes('access')) {
                            groupedStats.Accessories.count += qty;
                        } else {
                            groupedStats.Other.count += qty;
                        }
                    });
                }
            });

            this.totalSalesItems = totalItemsBase;

            if (totalItemsBase > 0) {
                let currentOffset = 0;
                this.salesSlices = Object.entries(groupedStats)
                    .filter(([_, data]) => data.count > 0)
                    .map(([key, data]) => {
                        const percentage = (data.count / totalItemsBase) * 100;
                        const dashArray = `${percentage} ${100 - percentage}`;
                        const dashOffset = 100 - currentOffset + 25;
                        currentOffset += percentage;

                        return {
                            type: key,
                            label: data.label,
                            count: data.count,
                            percentage: Math.round(percentage),
                            color: data.color,
                            dashArray,
                            dashOffset: dashOffset % 100
                        };
                    });

                this.categoryStats = this.salesSlices.map(s => ({
                    name: s.label,
                    count: s.count,
                    percentage: s.percentage,
                    color: s.color
                }));
            }

            // --- SVG Line Chart Path Generation (Stock style) ---
            if (this.dashboardTrends && this.dashboardTrends.length > 0) {
                const points = this.dashboardTrends.map((t, i) => {
                    const x = (i / (this.dashboardTrends.length - 1)) * 100;
                    const y = 100 - t.visualHeight;
                    return { x, y };
                });

                // Line Path
                this.lineChartPath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x},${p.y}`).join(' ');

                // Fill Path (closes at bottom corners)
                this.areaChartPath = `${this.lineChartPath} L 100,100 L 0,100 Z`;
            }

        } else {
            this.stats[1].value = '0';
            this.stats[2].value = 'â‚¹0';
            this.stats[3].value = '0%';
            this.dashboardTrends.forEach(t => {
                t.count = 0;
                t.visualHeight = 10;
            });

            // Update chart paths for empty state
            const points = this.dashboardTrends.map((t, i) => {
                const x = (i / (this.dashboardTrends.length - 1)) * 100;
                const y = 100 - t.visualHeight;
                return { x, y };
            });
            this.lineChartPath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x},${p.y}`).join(' ');
            this.areaChartPath = `${this.lineChartPath} L 100,100 L 0,100 Z`;

            this.fulfillmentRate = 0;
            this.donutDashArray = '0 100';
            this.pieChartStyle = 'lightgray';
        }

        if (this.cdr) {
            this.cdr.detectChanges();
        }
    }

    async downloadAnalyticsReport() {
        const chartElement = document.querySelector('.chart-card') as HTMLElement;
        if (!chartElement) {
            console.error('[AdminPanel] Chart element not found!');
            return;
        }

        try {
            // 1. Capture the chart area as an image
            const canvas = await html2canvas(chartElement, {
                scale: 2, // Higher quality for PDF
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');

            // 2. Create jsPDF instance (A4 size)
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            
            // 3. Add Brand Header
            pdf.setFontSize(24);
            pdf.setTextColor(22, 101, 52); // Brand green #166534
            pdf.text('GREENIE CULTURE', 15, 20);
            
            pdf.setFontSize(14);
            pdf.setTextColor(71, 85, 105); // Slate gray
            pdf.text('Weekly Analytics Distribution Report', 15, 28);
            
            pdf.setFontSize(10);
            pdf.text(`Report Date: ${new Date().toLocaleDateString('en-IN', { 
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}`, 15, 34);

            // 4. Add the Chart Image
            const imgWidth = pageWidth - 30; // 15mm margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Draw a subtle border for the chart
            pdf.setDrawColor(226, 232, 240); // Lighter gray
            pdf.rect(14.5, 41.5, imgWidth + 1, imgHeight + 1, 'S');
            pdf.addImage(imgData, 'PNG', 15, 42, imgWidth, imgHeight);

            // 5. Performance Insights Section
            let currentY = 42 + imgHeight + 20;
            pdf.setFontSize(16);
            pdf.setTextColor(15, 23, 42); // Navy
            pdf.text('Key Performance Indicators (KPIs)', 15, currentY);
            
            pdf.setDrawColor(22, 101, 52);
            pdf.setLineWidth(0.5);
            pdf.line(15, currentY + 2, 60, currentY + 2); // Underline

            currentY += 12;
            pdf.setFontSize(11);
            pdf.setTextColor(30, 41, 59);

            const metrics = [
                { label: 'Total Active Users', value: this.stats[0]?.value || '0' },
                { label: 'Total Orders Processed', value: this.stats[1]?.value || '0' },
                { label: 'Total Revenue Generated', value: this.stats[2]?.value || '₹0' },
                { label: 'Store Conversion Rate', value: (this.realConversion.convRate || 0) + '%' },
                { label: 'Successful Valid Deliveries', value: (this.realConversion.successfulOrders || 0).toString() },
                { label: 'Repeat Customer Engagement', value: (this.realConversion.repeatRate || 0) + '%' },
                { label: 'Add to Cart Success Rate', value: (this.realConversion.cartRate || 0) + '%' }
            ];

            metrics.forEach((m, idx) => {
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${m.label}:`, 15, currentY);
                pdf.setFont('helvetica', 'normal');
                pdf.text(`${m.value}`, 85, currentY);
                currentY += 8;
            });

            // Footer
            pdf.setFontSize(9);
            pdf.setTextColor(148, 163, 184);
            pdf.text('Confidentially generated by Greenie Culture Admin Dashboard.', 15, 285);

            // 6. Save/Download
            const fileName = `Greenie_Analytics_${new Date().getTime()}.pdf`;
            pdf.save(fileName);
            console.log('[AdminPanel] PDF generated successfully:', fileName);

        } catch (error) {
            console.error('[AdminPanel] PDF Export Error:', error);
            alert('An error occurred while generating the PDF. Please ensure you are viewing the dashboard tab.');
        }
    }

    openItemsPopup(order: any) {
        this.selectedOrderForItems = order;
        this.selectedOrderItems = order.items || [];
        this.showItemsPopup = true;
        this.toggleBodyScroll(true);
        this.cdr.detectChanges();
    }

    closeItemsPopup() {
        this.showItemsPopup = false;
        this.selectedOrderItems = [];
        this.selectedOrderForItems = null;
        this.toggleBodyScroll(false);
        this.cdr.detectChanges();
    }

    // Admin Payment View Helpers
    isAdminPaymentCOD(method: string): boolean {
        const m = (method || '').toUpperCase();
        return m === 'COD' || m === 'CASH ON DELIVERY';
    }

    get adminPaymentViewOrders() {
        let orders = this.orders;
        if (this.adminPaymentFilterMethod === 'COD') {
            orders = orders.filter(o => this.isAdminPaymentCOD(o.paymentMethod));
        } else if (this.adminPaymentFilterMethod === 'UPI') {
            orders = orders.filter(o => !this.isAdminPaymentCOD(o.paymentMethod));
        }
        return orders.sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }

    loadCouriers() {
        const token = sessionStorage.getItem('auth_token');
        this.http.get<any[]>('/api/admin/couriers', { headers: { 'x-auth-token': token || '' } }).subscribe({
            next: (data) => {
                this.couriers = data;
                this.courierOptions = data.map(c => c.name); // <--- Make dropdown dynamic!
                this.courierStateMapping = {};
                this.courierFees = {};
                data.forEach(c => {
                    if (c.name) {
                        this.courierStateMapping[c.name] = c.states || [];
                        this.courierFees[c.name] = c.fee || 50;
                    }
                });
            },
            error: (err) => console.error('Error loading couriers:', err)
        });
    }

    getCourierForState(state: string): string {
        for (const courierName in this.courierStateMapping) {
            if (this.courierStateMapping[courierName].includes(state)) {
                return courierName;
            }
        }
        return 'Unknown'; // Default or handle as needed
    }

    calculateAdminPaymentStats() {
        const orders = this.orders;
        let codCount = 0;
        let onlineCount = 0;
        let codRevenue = 0;
        let onlineRevenue = 0;

        // Settlement counters
        let totalOwedToCouriers = 0;
        let totalPaidToCouriers = 0;
        let totalPendingToCouriers = 0;
        let totalCollectedFromCouriers = 0;
        let totalPendingFromCouriers = 0;

        orders.forEach((o: any) => {
            const amount = o.totalAmount || 0;
            const courier = o.courierName || this.getCourierForState(this.extractState(o));
            const fee = this.courierFees[courier] || 50;

            if (this.isAdminPaymentCOD(o.paymentMethod)) {
                codCount++;
                codRevenue += amount;
                
                // COD Settlement: Courier owes admin (totalAmount - fee)
                const adminGets = amount - fee;
                totalCollectedFromCouriers += adminGets;
                if (!o.courierSettled) {
                    totalPendingFromCouriers += adminGets;
                }
            } else {
                onlineCount++;
                onlineRevenue += amount;

                // UPI Settlement: Admin owes courier the fee
                totalOwedToCouriers += fee;
                if (o.courierSettled) {
                    totalPaidToCouriers += fee;
                } else {
                    totalPendingToCouriers += fee;
                }
            }
        });

        const totalOrders = codCount + onlineCount || 1;
        this.adminPaymentStats = {
            totalRevenue: codRevenue + onlineRevenue,
            codCount,
            onlineCount,
            codRevenue,
            onlineRevenue,
            codPercentage: Math.round((codCount / totalOrders) * 100),
            onlinePercentage: Math.round((onlineCount / totalOrders) * 100),
            totalOrders: codCount + onlineCount,
            // Settlement stats
            totalOwedToCouriers,
            totalPaidToCouriers,
            totalPendingToCouriers,
            totalCollectedFromCouriers,
            totalPendingFromCouriers
        };
    }

    toggleCourierSettled(order: any) {
        const token = sessionStorage.getItem('auth_token');
        const newStatus = !order.courierSettled;
        this.http.put(`/api/admin/orders/${order._id}/courier-settled`, 
            { courierSettled: newStatus }, 
            { headers: { 'x-auth-token': token || '' } }
        ).subscribe({
            next: (updated: any) => {
                order.courierSettled = updated.courierSettled;
                this.calculateAdminPaymentStats();
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Settlement toggle error:', err)
        });
    }

    getGlobalSettlement() {
        // Returns per-courier breakdown
        return this.couriers.map(c => {
            const courierOrders = this.orders.filter(o => 
                o.courierName === c.name || this.extractState(o) === this.getCourierForState(this.extractState(o))
            );
            // This is slightly complex to repeat here, maybe I'll just use the global totals for now
            // as per user request "remove courier part from payment hub" (maybe meaning selection sidebar)
            return null;
        });
    }
}
