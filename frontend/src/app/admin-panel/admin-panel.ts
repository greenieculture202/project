import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { OfferService, Offer } from '../services/offer.service';
import { PlacementService, Placement } from '../services/placement.service';
import { FaqService, Faq } from '../services/faq.service';
import { AboutService, AboutSection } from '../services/about.service';
import { InquiryService, Inquiry } from '../services/inquiry.service';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './admin-panel.html',
    styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
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

    activeTab: string = 'dashboard';
    faqs: Faq[] = [];
    isLoadingFaqs: boolean = false;
    showAddFaqModal: boolean = false;
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
    users: any[] = [];
    orders: any[] = [];
    selectedOrder: any = null;
    showOrderModal: boolean = false;
    showInvoiceModal: boolean = false;
    orderSearchQuery: string = '';
    orderStatusFilter: string = 'All';
    isLoadingOrders: boolean = false;
    isLoading: boolean = false;
    productMap: { [key: string]: any[] } = {};
    isLoadingProducts: boolean = false;
    productCategoryFilter: string = 'All';
    searchTerm: string = ''; // For global/scoped product search
    activeMainCategory: string = 'Plants';
    activeCompanionGroup: string = 'All'; // For the 4 big tabs in Plant Companions

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
            cardsCount: 6,
            code: 'G-INDOOR-6-SEC',
            badge: 'ELITE PICK',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        },
        {
            name: 'Garden Essentials Page',
            page: '/garden-offer',
            cardsCount: 6,
            code: 'G-GARDEN-6-SEC',
            badge: 'KIT SAVINGS',
            instruction: 'Add this code to a product\'s TAGS or CATEGORY to show it here.'
        },
        {
            name: 'Flowering Bonanza Page',
            page: '/flowering-offer',
            cardsCount: 6,
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
            { key: 'New Arrivals', label: 'New Arrivals' },
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
        tags: ''
    };

    // Success Modal State
    showSuccessModal: boolean = false;
    successModalData: any = {
        name: '',
        path: '',
        image: '',
        type: 'added' // 'added' or 'updated'
    };

    isSubmitting: boolean = false;

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
        if (this.userFilter === 'All') return this.users;
        return this.users.filter(u => u.method === this.userFilter);
    }

    stats = [
        { label: 'Total Users', value: '0', icon: 'users', color: '#4f46e5', trend: '+12% from last month' },
        { label: 'Total Orders', value: '0', icon: 'shopping-bag', color: '#10b981', trend: '+18% from last month' },
        { label: 'Total Revenue', value: '₹0', icon: 'credit-card', color: '#f59e0b', trend: '+25% from last month' },
        { label: 'Conversion Rate', value: '3.2%', icon: 'chart-pie', color: '#ef4444', trend: '+5% higher than average' }
    ];

    dashboardTrends = [
        { day: 'Mon', count: 45 },
        { day: 'Tue', count: 52 },
        { day: 'Wed', count: 38 },
        { day: 'Thu', count: 65 },
        { day: 'Fri', count: 48 },
        { day: 'Sat', count: 82 },
        { day: 'Sun', count: 70 }
    ];

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
        this.loadUsers();
        this.loadOrders();
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
                        name: user.fullName,
                        email: user.email,
                        phone: user.phone || 'N/A',
                        address: user.address || 'N/A',
                        method: user.method || 'Website',
                        greenPoints: user.greenPoints || 0,
                        profilePic: user.profilePic
                    }));
                    this.stats[0].value = this.users.length.toString();
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
    }

    closeDetailModal() {
        this.showDetailModal = false;
        this.selectedUser = null;
        this.toggleBodyScroll(false);
    }

    viewOrderDetails(order: any) {
        this.selectedOrder = order;
        this.showOrderModal = true;
    }

    closeOrderModal() {
        this.showOrderModal = false;
        this.selectedOrder = null;
        this.toggleBodyScroll(false);
    }

    viewInvoice(order: any) {
        this.selectedOrder = order;
        this.showInvoiceModal = true;
    }

    closeInvoiceModal() {
        this.showInvoiceModal = false;
        this.selectedOrder = null;
        this.toggleBodyScroll(false);
    }

    printInvoice() {
        window.print();
    }

    setTab(tab: string, mainCategory?: string, updateUrl: boolean = true) {
        this.activeTab = tab;

        // Update URL to persist tab state across refreshes
        if (updateUrl) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { tab: tab, mainCat: mainCategory || null },
                queryParamsHandling: 'merge'
            });
        }
        if (mainCategory) {
            this.activeMainCategory = mainCategory;
            this.activeCompanionGroup = mainCategory === 'Accessories' ? 'Accessories' : 'All';
            this.productCategoryFilter = 'All';
            this.searchTerm = '';
        }

        if (tab === 'dashboard' || tab === 'users') {
            this.loadUsers();
        } else if (tab === 'products') {
            this.loadProducts();
        } else if (tab === 'offers') {
            this.loadOffers();
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
        }
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
            badge: '🌿 EXCLUSIVE DEAL',
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
        const keys = cats.map(c => c.key);

        if (this.activeMainCategory === 'Accessories') {
            const accHeaders = ['Pots & Planters', 'Watering Equipment', 'Support & Protection', 'Lighting Equipment', 'Decorative & Display'];
            const soilHeaders = ['Soil Types', 'Organic Amendments', 'Growth Media'];
            const fertHeaders = ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'];
            const toolHeaders = ['Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools'];
            const allHeaders = [...accHeaders, ...soilHeaders, ...fertHeaders, ...toolHeaders];

            if (this.activeCompanionGroup === 'All') return allHeaders;

            if (this.activeCompanionGroup === 'Accessories') return accHeaders;
            if (this.activeCompanionGroup === 'Soil & Growing Media') return soilHeaders;
            if (this.activeCompanionGroup === 'Fertilizers & Nutrients') return fertHeaders;
            if (this.activeCompanionGroup === 'Gardening Tools') return toolHeaders;
        }

        return keys;
    }

    getProductsForCategory(category: string): any[] {
        // --- SPECIAL CASE: Dynamic Bestsellers from Backend aggregation ---
        if (category === 'Bestsellers' && this.productMap['Bestsellers']) {
            const list = this.productMap['Bestsellers'];
            if (this.searchTerm && this.searchTerm.trim() !== '') {
                const term = this.searchTerm.toLowerCase();
                return list.filter((p: any) =>
                    p.name.toLowerCase().includes(term) ||
                    (p.category || '').toLowerCase().includes(term) ||
                    (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(term)))
                );
            }
            return list;
        }

        // Find defining items for this sub-category from our navbar mapping
        const navItems = this.navbarDefinitions[category] || [];
        const itemsToSearch = [category.toLowerCase(), ...navItems.map((i: string) => i.toLowerCase())];

        // 1. Get ALL products as potential pool (since categories in DB are messy)
        // We combine all lists from the productMap
        let allPotentialProducts: any[] = [];
        Object.values(this.productMap).forEach(products => {
            if (Array.isArray(products)) {
                allPotentialProducts = [...allPotentialProducts, ...products];
            }
        });

        // 2. Clear duplicates (by _id) to be safe
        const uniqueProducts = Array.from(new Map(allPotentialProducts.map(p => [p._id, p])).values());

        // 3. Filter by name, category or tags matching our navbar list
        const filtered = uniqueProducts.filter((p: any) => {
            const pName = p.name.toLowerCase();
            const pCat = p.category.toLowerCase();
            const pTags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];

            const match = itemsToSearch.some(item =>
                pName.includes(item) ||
                pCat === item ||
                pTags.includes(item)
            );

            if (!match) return false;

            // Apply search filter if active
            if (this.searchTerm && this.searchTerm.trim() !== '') {
                const term = this.searchTerm.toLowerCase();
                return pName.includes(term) || pCat.includes(term) || pTags.some((t: string) => t.includes(term));
            }

            return true;
        });

        return filtered;
    }

    getFilteredCategoriesForModal() {
        if (!this.activeMainCategory || !this.mainCategoryGroups[this.activeMainCategory]) return [];

        if (this.activeMainCategory !== 'Accessories') {
            return this.mainCategoryGroups[this.activeMainCategory];
        }

        // For Accessories, we filter by the specific pill (Pots & Planters, etc.) 
        // OR the current sub-tab (Companion Group)
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
                return this.getCategoryList();
            }

            // Simple view: return only the active filter. 
            // getProductsForCategory() will handle searching child categories automatically.
            return [this.productCategoryFilter];
        }

        const categories = this.getCategoryList();
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

    openAddProductModal() {
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
            tags: ''
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
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || '')
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
            alert('Please fill in the required fields:\n\n• ' + missing.join('\n• '));
            return; // Don't set isSubmitting, just return
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
                    setTimeout(() => alert('❌ ' + msg), 50);
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
                    this.orders = data;
                    this.isLoadingOrders = false;

                    // Update main dashboard stats dynamically
                    this.stats[1].value = this.orders.length.toString();
                    this.stats[2].value = '₹' + this.getTotalRevenue();

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

    updateOrderStatus(orderId: string, newStatus: string) {
        const token = sessionStorage.getItem('auth_token');
        if (!token) return;

        this.http.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }, { headers: { 'x-auth-token': token } })
            .subscribe({
                next: (updatedOrder: any) => {
                    this.ngZone.run(() => {
                        const idx = this.orders.findIndex(o => o._id === orderId);
                        if (idx !== -1) {
                            this.orders[idx] = updatedOrder;
                            this.cdr.detectChanges();
                        }
                    });
                },
                error: (err) => console.error('Error updating order:', err)
            });
    }

    getStatusClass(status: string): string {
        switch (status) {
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
        this.activeOfferCode = '';
        this.associatedProducts = [];
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
                alert('Failed to submit reply.');
            }
        });
    }
}
