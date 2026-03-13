// Forced rebuild - change v1
import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReviewDialogComponent } from '../review-dialog/review-dialog';
import { ReviewService } from '../services/review.service';
import { UserService } from '../services/user.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ReviewDialogComponent],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
    isProcessing = false;
    cartService = inject(CartService);
    authService = inject(AuthService);
    reviewService = inject(ReviewService);
    userService = inject(UserService);
    router = inject(Router);

    // New signals for delivery calculation
    private couriersList = signal<any[]>([]);
    selectedState = signal<string>('');

    showReviewDialog = false;

    items = computed(() => {
        const cartItems = this.cartService.items();
        const offer = this.detectedOffer;

        // 1. Apply any discounts to original items (e.g. Garden Essentials 40%)
        const processedItems = cartItems.map(item => {
            const newItem = { ...item };
            const itemTags = item.tags || [];
            const itemCategory = item.category || '';

            // If the overall detected offer is Garden Essentials, apply discount to qualifying items
            if (offer?.code === 'G-GARDEN-6-SEC' && (itemTags.includes('G-GARDEN-6-SEC') || itemCategory === 'Gardening Tools')) {
                newItem.originalPrice = item.price;
                newItem.price = Math.round(item.price * (1 - (offer.discount || 0)));
            }
            return newItem;
        });

        // 2. Add gift product if applicable
        if (offer && offer.freeProduct) {
            return [...processedItems, {
                ...offer.freeProduct,
                id: 'GIFT-' + offer.code,
                productId: null,
                quantity: 1,
                weight: 'Standard',
                planter: 'Basic',
                isGift: true
            }];
        }
        return processedItems;
    });
    itemsTotal = computed(() => {
        return this.items().reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    });
    
    deliveryCharge = computed(() => {
        const state = this.selectedState();
        if (!state || this.couriersList().length === 0) return 0;
        
        // Find if any courier serves this state
        const servingCouriers = this.couriersList().filter((c: any) => 
            (c.states || []).map((s: string) => s.toLowerCase()).includes(state.toLowerCase())
        );
        
        if (servingCouriers.length === 0) return 0;
        
        // Return minimum fee among serving couriers
        return Math.min(...servingCouriers.map((c: any) => c.fee || 0));
    });

    totalAmount = computed(() => {
        return this.itemsTotal() + this.deliveryCharge();
    });
    totalSavings = this.cartService.totalSavings;

    contactEmail = '';
    firstName = '';
    lastName = '';
    address = '';
    city = '';
    stateName = '';
    pincode = '';
    phone = '';
    alternatePhone = '';
    currentTimestamp = new Date();

    // Offer Mapping with multi-condition support
    private readonly offerBenefitMap: { [key: string]: { name: string, benefit: string, discount?: number, freeProduct?: any, minQty?: number } } = {
        'G-BOGO-6-SECTION': {
            name: 'BOGO XL Plants',
            benefit: 'Buy 2 XL Plants, Get 1 Medium Plant FREE',
            minQty: 2,
            freeProduct: { name: 'Gift: Bonus Medium Plant', quantity: 1, price: 0, image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d' }
        },
        'G-INDOOR-6-SEC': {
            name: 'Indoor Jungle',
            benefit: 'Buy 2 Indoor Plants, Get 1 Ceramic Pot FREE',
            minQty: 2,
            freeProduct: { name: 'Gift: Premium Ceramic Pot', quantity: 1, price: 0, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45' }
        },
        'G-GARDEN-6-SEC': {
            name: 'Garden Essentials',
            benefit: 'Buy 2+, Get Flat 40% Instant Discount',
            discount: 0.40,
            minQty: 2
        },
        'G-FLOWER-6-SEC': {
            name: 'Flowering Bonanza',
            benefit: 'Buy 2+, Get Free Professional Fertilizer Pack',
            freeProduct: { name: 'Gift: Organic Fertilizer (1kg)', quantity: 1, price: 0, image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d' },
            minQty: 2
        }
    };

    // Map categories to Offer Codes for automatic detection
    private readonly categoryToOfferMap: { [key: string]: string } = {
        'XL Plants': 'G-BOGO-6-SECTION',
        'Indoor Plants': 'G-INDOOR-6-SEC',
        'Gardening Tools': 'G-GARDEN-6-SEC',
        'Flowering Plants': 'G-FLOWER-6-SEC'
    };

    get appliedOffer() {
        return this.detectedOffer;
    }

    get detectedOffer() {
        const cartItems = this.cartService.items();
        if (!cartItems || cartItems.length === 0) return null;

        const offerCounts: { [key: string]: number } = {};

        for (const item of cartItems) {
            let codesForItem: string[] = [];

            // 1. Strict Tag Check (The most reliable way)
            if (item.tags && Array.isArray(item.tags)) {
                codesForItem = [...item.tags];
            }

            // 2. Exact Category Mapping
            if (item.category && this.categoryToOfferMap[item.category]) {
                codesForItem.push(this.categoryToOfferMap[item.category]);
            }

            // Deduplicate and increment counts
            [...new Set(codesForItem)].forEach(code => {
                if (this.offerBenefitMap[code]) {
                    offerCounts[code] = (offerCounts[code] || 0) + (item.quantity || 1);
                }
            });
        }

        // Evaluate counts against requirements
        const priorityOrder = ['G-BOGO-6-SECTION', 'G-INDOOR-6-SEC', 'G-GARDEN-6-SEC', 'G-FLOWER-6-SEC'];
        for (const code of priorityOrder) {
            const count = offerCounts[code] || 0;
            const benefit = this.offerBenefitMap[code];
            if (count >= (benefit.minQty || 1)) {
                return { code, ...benefit };
            }
        }

        return null;
    }


    currentStep = 1;
    showInvoiceModal = false;
    placedOrder: any = null;

    // UPI Flow State
    tempOrderId = '';
    showUPIDetailBox = false;
    showUPIScanner = false;
    showPaymentSuccessPopup = false;
    isPaymentTimerActive = false;

    paymentReceived = false;
    private _selectedPayment = '';
    get selectedPayment() { return this._selectedPayment; }
    set selectedPayment(val: string) {
        this._selectedPayment = val;
        if (val === 'upi') {
            this.showUPIDetailBox = true;
            this.showUPIScanner = false;
            this.paymentReceived = false;
            this.showPaymentSuccessPopup = false;
            // Generate a provisional order ID for display
            this.tempOrderId = 'T-ORD-' + Math.floor(1000 + Math.random() * 9000);
        } else {
            this.showUPIDetailBox = false;
            this.showUPIScanner = false;
            this.paymentReceived = false;
        }
    }

    isScanning = false;
    isVerifying = false;

    onUPIScanClick() {
        console.log('[PAYMENT] User clicked Pay Now. Opening Scanner...');
        this.showUPIScanner = true;
        this.isScanning = true;
        this.isVerifying = false;
        this.paymentReceived = false;
        
        // Step 1: Simulated "Waiting for Scan" (User pretends to scan)
        // After 5 seconds, we assume scan is done, and start 1 min verification
        setTimeout(() => {
            if (this.showUPIScanner) {
                console.log('[PAYMENT] Scan detected. Starting 1-min verification...');
                this.isScanning = false;
                this.isVerifying = true;
                this.startVerificationTimer();
            }
        }, 5000); 
    }

    private startVerificationTimer() {
        this.currentTimestamp = new Date();
        // Step 2: Full 1 Minute (60,000ms) Verification
        setTimeout(() => {
            if (this.selectedPayment === 'upi' && this.showUPIScanner) {
                console.log('[PAYMENT] 1-min verification complete.');
                this.isVerifying = false;
                this.paymentReceived = true;
                this.showPaymentSuccessPopup = true;
            }
        }, 60000); // Back to 1 minute
    }

    onPaymentSuccessOk() {
        this.showPaymentSuccessPopup = false;
        this.onPayNow(); // Proceed to place order and show bill
    }

    simulateUPIScan() {
        // Legacy method - replaced by onUPIScanClick logic
    }
    showStateDropdown = false;
    showCityDropdown = false;

    indianStates: string[] = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
        "Ladakh", "Lakshadweep", "Puducherry"
    ];

    indianCities: string[] = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat",
        "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
        "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Coimbatore", "Agra",
        "Madurai", "Nashik", "Vijayawada", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli",
        "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai",
        "Allahabad", "Howrah", "Ranchi", "Gwalior", "Jabalpur", "Guntur", "Amaravati", "Sarkhej-Okaf",
        "Bhavnagar", "Jamnagar", "Junagadh", "Gandhidham", "Nadiad", "Gandhinagar", "Anand", "Morbi"
    ];

    cityToState: { [key: string]: string } = {
        // Andhra Pradesh
        "Visakhapatnam": "Andhra Pradesh", "Vijayawada": "Andhra Pradesh", "Guntur": "Andhra Pradesh", "Nellore": "Andhra Pradesh", "Kurnool": "Andhra Pradesh", "Tirupati": "Andhra Pradesh", "Rajahmundry": "Andhra Pradesh", "Kakinada": "Andhra Pradesh",
        // Assam
        "Guwahati": "Assam", "Silchar": "Assam", "Dibrugarh": "Assam", "Jorhat": "Assam", "Nagaon": "Assam", "Tinsukia": "Assam",
        // Bihar
        "Patna": "Bihar", "Gaya": "Bihar", "Bhagalpur": "Bihar", "Muzaffarpur": "Bihar", "Purnia": "Bihar", "Darbhanga": "Bihar", "Arrah": "Bihar", "Begusarai": "Bihar",
        // Chhattisgarh
        "Raipur": "Chhattisgarh", "Bhilai": "Chhattisgarh", "Bilaspur": "Chhattisgarh", "Korba": "Chhattisgarh", "Rajnandgaon": "Chhattisgarh",
        // Delhi
        "Delhi": "Delhi", "New Delhi": "Delhi",
        // Goa
        "Panaji": "Goa", "Margao": "Goa", "Vasco da Gama": "Goa",
        // Gujarat
        "Ahmedabad": "Gujarat", "Surat": "Gujarat", "Vadodara": "Gujarat", "Rajkot": "Gujarat", "Bhavnagar": "Gujarat", "Jamnagar": "Gujarat", "Junagadh": "Gujarat", "Gandhidham": "Gujarat", "Nadiad": "Gujarat", "Gandhinagar": "Gujarat", "Anand": "Gujarat", "Morbi": "Gujarat", "Surendranagar": "Gujarat", "Bharuch": "Gujarat", "Vapi": "Gujarat", "Navsari": "Gujarat", "Veraval": "Gujarat", "Porbandar": "Gujarat", "Godhra": "Gujarat", "Patan": "Gujarat", "Dahod": "Gujarat", "Botad": "Gujarat", "Sarkhej-Okaf": "Gujarat",
        // Haryana
        "Faridabad": "Haryana", "Gurgaon": "Haryana", "Panipat": "Haryana", "Ambala": "Haryana", "Yamunanagar": "Haryana", "Rohtak": "Haryana", "Hisar": "Haryana", "Karnal Haryana": "Haryana",
        // Himachal Pradesh
        "Shimla": "Himachal Pradesh", "Dharamshala": "Himachal Pradesh", "Solan": "Himachal Pradesh",
        // Jammu & Kashmir
        "Srinagar": "Jammu and Kashmir", "Jammu": "Jammu and Kashmir", "Anantnag": "Jammu and Kashmir",
        // Jharkhand
        "Dhanbad": "Jharkhand", "Ranchi": "Jharkhand", "Jamshedpur": "Jharkhand", "Bokaro": "Jharkhand", "Deoghar": "Jharkhand",
        // Karnataka
        "Bangalore": "Karnataka", "Hubli-Dharwad": "Karnataka", "Mysore": "Karnataka", "Gulbarga": "Karnataka", "Belgaum": "Karnataka", "Mangalore": "Karnataka", "Davanagere": "Karnataka", "Bellary": "Karnataka", "Shimoga": "Karnataka", "Tumkur": "Karnataka",
        // Kerala
        "Thiruvananthapuram": "Kerala", "Kochi": "Kerala", "Kozhikode": "Kerala", "Kollam": "Kerala", "Thrissur": "Kerala", "Alappuzha": "Kerala", "Palakkad": "Kerala", "Malappuram": "Kerala",
        // Madhya Pradesh
        "Indore": "Madhya Pradesh", "Bhopal": "Madhya Pradesh", "Jabalpur": "Madhya Pradesh", "Gwalior": "Madhya Pradesh", "Ujjain": "Madhya Pradesh", "Sagar": "Madhya Pradesh", "Dewas": "Madhya Pradesh", "Satna": "Madhya Pradesh", "Ratlam": "Madhya Pradesh",
        // Maharashtra
        "Mumbai": "Maharashtra", "Pune": "Maharashtra", "Nagpur": "Maharashtra", "Thane": "Maharashtra", "Pimpri-Chinchwad": "Maharashtra", "Nashik": "Maharashtra", "Kalyan-Dombivli": "Maharashtra", "Vasai-Virar": "Maharashtra", "Aurangabad": "Maharashtra", "Navi Mumbai": "Maharashtra", "Solapur": "Maharashtra", "Mira-Bhayandar": "Maharashtra", "Bhiwandi": "Maharashtra", "Amravati": "Maharashtra", "Nanded": "Maharashtra", "Kolhapur": "Maharashtra", "Akola": "Maharashtra", "Ulhasnagar": "Maharashtra", "Sangli": "Maharashtra", "Malegaon": "Maharashtra", "Jalgaon": "Maharashtra", "Latur": "Maharashtra", "Dhule": "Maharashtra", "Ahmednagar": "Maharashtra", "Chandrapur": "Maharashtra", "Parbhani": "Maharashtra", "Ichalkaranji": "Maharashtra", "Jalna": "Maharashtra", "Ambarnath": "Maharashtra",
        // Manipur
        "Imphal": "Manipur",
        // Meghalaya
        "Shillong": "Meghalaya",
        // Odisha
        "Bhubaneswar": "Odisha", "Cuttack": "Odisha", "Rourkela": "Odisha", "Berhampur": "Odisha", "Sambalpur": "Odisha",
        // Punjab
        "Ludhiana": "Punjab", "Amritsar": "Punjab", "Jalandhar": "Punjab", "Patiala Punjab": "Punjab", "Bathinda": "Punjab", "Hoshiarpur": "Punjab", "Mohali": "Punjab",
        // Rajasthan
        "Jaipur": "Rajasthan", "Jodhpur": "Rajasthan", "Kota": "Rajasthan", "Bikaner": "Rajasthan", "Ajmer": "Rajasthan", "Udaipur": "Rajasthan", "Bhilwara": "Rajasthan", "Alwar": "Rajasthan", "Bharatpur": "Rajasthan", "Pali": "Rajasthan", "Sikar": "Rajasthan", "Sri Ganganagar": "Rajasthan",
        // Tamil Nadu
        "Chennai": "Tamil Nadu", "Coimbatore": "Tamil Nadu", "Madurai": "Tamil Nadu", "Tiruchirappalli": "Tamil Nadu", "Salem": "Tamil Nadu", "Tiruppur": "Tamil Nadu", "Erode": "Tamil Nadu", "Vellore": "Tamil Nadu", "Thoothukudi": "Tamil Nadu", "Tirunelveli": "Tamil Nadu",
        // Telangana
        "Hyderabad": "Telangana", "Warangal": "Telangana", "Nizamabad": "Telangana", "Karimnagar": "Telangana", "Khammam": "Telangana",
        // Tripura
        "Agartala": "Tripura",
        // Uttar Pradesh
        "Lucknow": "Uttar Pradesh", "Kanpur": "Uttar Pradesh", "Ghaziabad": "Uttar Pradesh", "Agra": "Uttar Pradesh", "Meerut": "Uttar Pradesh", "Varanasi": "Uttar Pradesh", "Prayagraj": "Uttar Pradesh", "Allahabad": "Uttar Pradesh", "Bareilly": "Uttar Pradesh", "Aligarh": "Uttar Pradesh", "Moradabad": "Uttar Pradesh", "Saharanpur": "Uttar Pradesh", "Gorakhpur": "Uttar Pradesh", "Noida": "Uttar Pradesh", "Firozabad": "Uttar Pradesh", "Jhansi": "Uttar Pradesh", "Muzaffarnagar": "Uttar Pradesh", "Mathura": "Uttar Pradesh", "Ayodhya": "Uttar Pradesh", "Rampur": "Uttar Pradesh", "Shahjahanpur": "Uttar Pradesh", "Farrukhabad": "Uttar Pradesh", "Maunath Bhanjan": "Uttar Pradesh", "Hapur": "Uttar Pradesh", "Etawah": "Uttar Pradesh",
        // Uttarakhand
        "Dehradun": "Uttarakhand", "Haridwar": "Uttarakhand", "Roorkee": "Uttarakhand", "Haldwani": "Uttarakhand", "Rudrapur": "Uttarakhand",
        // West Bengal
        "Kolkata": "West Bengal", "Howrah": "West Bengal", "Durgapur": "West Bengal", "Asansol": "West Bengal", "Siliguri": "West Bengal", "Maheshtala": "West Bengal", "Rajpur Sonarpur": "West Bengal", "Gopalpur": "West Bengal", "Bhatpara": "West Bengal", "Panihati": "West Bengal", "Kamarhati": "West Bengal", "Bardhaman": "West Bengal"
    };

    updateIndianCities() {
        this.indianCities = Object.keys(this.cityToState).sort();
    }

    filteredStates: string[] = [];
    filteredCities: string[] = [];

    onStateInput() {
        this.selectedState.set(this.stateName);
        this.showStateDropdown = true;
        this.showCityDropdown = false;
        if (!this.stateName) {
            this.filteredStates = [...this.indianStates];
        } else {
            this.filteredStates = this.indianStates.filter(s =>
                s.toLowerCase().includes(this.stateName.toLowerCase())
            );
        }
    }

    selectState(state: string) {
        this.stateName = state;
        this.selectedState.set(state);
        this.showStateDropdown = false;
    }

    onCityInput() {
        this.showCityDropdown = true;
        this.showStateDropdown = false;
        if (!this.city) {
            this.filteredCities = [...this.indianCities];
        } else {
            this.filteredCities = this.indianCities.filter(c =>
                c.toLowerCase().includes(this.city.toLowerCase())
            );
        }
    }

    selectCity(city: string) {
        this.city = city;
        this.showCityDropdown = false;
        // Auto-fill state
        if (this.cityToState[city]) {
            this.stateName = this.cityToState[city];
            this.selectedState.set(this.stateName);
        }
    }

    closeDropdowns() {
        setTimeout(() => {
            this.showStateDropdown = false;
            this.showCityDropdown = false;
        }, 200);
    }

    ngOnInit() {
        this.updateIndianCities();
        // Redirect if cart is empty - only if no placed order is persisting
        const persistedOrder = sessionStorage.getItem('last_placed_order');
        if (this.cartService.totalItems() === 0 && !persistedOrder) {
            this.router.navigate(['/']);
            return;
        }

        // 1. Load persisted state from localStorage first (priority)
        this.loadCheckoutState();

        // 2. Restore placed order if it exists (for refresh support)
        if (persistedOrder) {
            try {
                this.placedOrder = JSON.parse(persistedOrder);
                this.showInvoiceModal = true;
            } catch (e) {
                console.error('Error restoring persisted order', e);
            }
        }

        // Fetch Couriers for delivery calculation
        this.userService.getPublicCouriers().subscribe({
            next: (data) => this.couriersList.set(data),
            error: (err) => console.error('Failed to load couriers', err)
        });

        // 3. Fetch latest profile from database to fill empty fields
        if (this.authService.isLoggedIn()) {
            this.userService.getUserProfile().subscribe({
                next: (profile: any) => {
                    console.log('[Checkout] Fetched user profile for auto-fill:', profile);

                    // Only fill if current field is empty (prefere user's recent edits in session)
                    if (!this.firstName || !this.lastName) {
                        const names = (profile.fullName || '').split(' ');
                        if (!this.firstName) this.firstName = names[0] || '';
                        if (!this.lastName) this.lastName = names.slice(1).join(' ') || '';
                    }
                    if (!this.contactEmail) this.contactEmail = profile.email || '';
                    if (!this.phone) this.phone = profile.phone || '';
                    if (!this.alternatePhone) this.alternatePhone = profile.alternatePhone || '';
                    
                    /* Disabled auto-fill for address fields to prevent overwriting user input
                    if (!this.address) this.address = profile.address || '';
                    if (!this.city) this.city = profile.city || '';
                    if (!this.stateName) {
                        this.stateName = profile.state || '';
                        this.selectedState.set(this.stateName);
                    }
                    */

                    // Save the pre-filled state
                    this.saveCheckoutState();
                },
                error: (err: any) => console.warn('[Checkout] Failed to fetch profile for auto-fill', err)
            });
        }
    }

    getQRCodeUrl() {
        const amount = this.totalAmount().toFixed(2);
        const name = encodeURIComponent('Nikita Tank');
        const upiId = 'tanknikita982@oksbi';
        const upiUri = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
    }

    saveCheckoutState() {
        const state = {
            firstName: this.firstName,
            lastName: this.lastName,
            contactEmail: this.contactEmail,
            phone: this.phone,
            alternatePhone: this.alternatePhone,
            address: this.address,
            city: this.city,
            stateName: this.stateName,
            pincode: this.pincode,
            currentStep: this.currentStep,
            selectedPayment: this.selectedPayment
        };
        localStorage.setItem('checkout_state', JSON.stringify(state));
    }

    loadCheckoutState() {
        const savedState = localStorage.getItem('checkout_state');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.firstName = state.firstName || '';
                this.lastName = state.lastName || '';
                this.contactEmail = state.contactEmail || '';
                this.phone = state.phone || '';
                this.alternatePhone = state.alternatePhone || '';
                this.address = state.address || '';
                this.city = state.city || '';
                this.stateName = state.stateName || '';
                this.selectedState.set(this.stateName);
                this.pincode = state.pincode || '';
                this.currentStep = state.currentStep || 1;
                this._selectedPayment = state.selectedPayment || '';

                if (this.currentStep === 3 && this.selectedPayment === 'upi') {
                    // Reset UPI state on reload to avoid ghost timers
                    this.showUPIDetailBox = true;
                    this.showUPIScanner = false;
                }
            } catch (e) {
                console.error('Error loading checkout state', e);
            }
        }
    }

    private isValidName(name: string): boolean {
        return /^[a-zA-Z\s]{1,50}$/.test(name || '');
    }

    private isValidPhone(phone: string): boolean {
        return /^[0-9]{10}$/.test(phone || '');
    }

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    }

    isStep1Valid(): boolean {
        const isAltPhoneValid = !this.alternatePhone || this.isValidPhone(this.alternatePhone);
        return !!(
            this.isValidName(this.firstName) &&
            this.isValidName(this.lastName) &&
            this.isValidEmail(this.contactEmail) &&
            this.isValidPhone(this.phone) &&
            isAltPhoneValid &&
            this.address && this.address.trim().length >= 8 &&
            this.city && this.stateName
        );
    }

    nextStep() {
        if (this.currentStep === 1 && !this.isStep1Valid()) {
            alert('Please fill all the details to continue.');
            return;
        }
        if (this.currentStep < 3) {
            this.currentStep++;
            this.saveCheckoutState();
            window.scrollTo(0, 0);

            // If they just landed on Step 3 and UPI is default, start simulation
            if (this.currentStep === 3 && this.selectedPayment === 'upi') {
                this.simulateUPIScan();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.saveCheckoutState();
            window.scrollTo(0, 0);
        }
    }

    onPayNow() {
        this.isProcessing = true;

        // Build the order object using component's computed items (with  /gifts)
        const cartItems = this.items();
        const orderData = {
            items: cartItems.map((item: any) => ({
                productId: item.productId || item._id || null,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                weight: item.weight || null,
                planter: item.planter || null,
                isGift: item.isGift || false
            })),
            totalAmount: this.totalAmount(),
            deliveryCharge: this.deliveryCharge(),
            paymentMethod: this.selectedPayment === 'cod' ? 'Cash on Delivery' : 'UPI',
            appliedOfferCode: this.appliedOffer?.code || null,
            offerBenefit: this.appliedOffer?.benefit || null,
            shippingDetails: {
                fullName: `${this.firstName} ${this.lastName}`.trim(),
                email: this.contactEmail,
                address: this.address,
                city: this.city,
                state: this.stateName,
                phone: this.phone
            }
        };

        const saveOrder = () => {
            // First try to update the user profile with the latest shipping/contact details
            const profileData = {
                fullName: `${this.firstName} ${this.lastName}`.trim(),
                phone: this.phone,
                alternatePhone: this.alternatePhone,
                address: this.address,
                city: this.city,
                state: this.stateName
            };

            this.userService.updateUserProfile(profileData).subscribe({
                next: () => this.executePlaceOrder(orderData),
                error: (err: any) => {
                    console.warn('[Checkout] Profile update failed before ordering, proceeding anyway.', err);
                    this.executePlaceOrder(orderData);
                }
            });
        };

        if (this.selectedPayment === 'upi') {
            // Give 2 seconds for UPI scan simulation, then save & show modal
            setTimeout(() => saveOrder(), 2000);
        } else {
            saveOrder();
        }
    }

    private executePlaceOrder(orderData: any) {
        this.userService.placeOrder(orderData).subscribe({
            next: (res: any) => {
                this.placedOrder = res;
                this.showInvoiceModal = true;
                this.isProcessing = false;

                sessionStorage.setItem('last_placed_order', JSON.stringify(res));
                this.cartService.clear();
                localStorage.removeItem('checkout_state');
            },
            error: (err: any) => {
                console.error('[Checkout] Save failed, but showing invoice view for user:', err);
                this.isProcessing = false;
                // Create a temporary mock object for better fallback UI
                const mockOrder = {
                    orderId: 'ORD-' + Math.floor(Math.random() * 10000),
                    orderDate: new Date(),
                    paymentMethod: this.selectedPayment === 'cod' ? 'Cash on Delivery' : 'UPI',
                    totalAmount: this.totalAmount(),
                    items: this.cartService.items().map(item => ({ ...item }))
                };
                this.placedOrder = mockOrder;
                sessionStorage.setItem('last_placed_order', JSON.stringify(mockOrder));
                this.showInvoiceModal = true;
                this.cartService.clear();
                localStorage.removeItem('checkout_state');
            }
        });
    }

    downloadInvoice() {
        const invoiceElement = document.querySelector('.luxury-bill-card') as HTMLElement;
        if (!invoiceElement) return;

        // Temporarily hide the actions button row so it doesn't appear in the PDF
        const actionsElement = document.querySelector('.luxury-actions') as HTMLElement;
        if (actionsElement) actionsElement.style.display = 'none';

        // Capture the full scrolled height of the element, not just what's visible on screen
        const elementHeight = invoiceElement.scrollHeight;
        const elementWidth = invoiceElement.scrollWidth;

        html2canvas(invoiceElement, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#ffffff',
            width: elementWidth,
            height: elementHeight,
            windowWidth: elementWidth,
            windowHeight: elementHeight,
            scrollY: 0,
            x: 0,
            y: 0
        } as any).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate ratios to ensure the image fits within the A4 page dimensions
            const imgRatio = canvas.height / canvas.width;

            // Add padding (margin)
            const margin = 10;
            const maxPdfImgWidth = pdfWidth - (margin * 2);

            let finalImgWidth = maxPdfImgWidth;
            let finalImgHeight = finalImgWidth * imgRatio;

            // If the scaled height is taller than the page, scale by height instead
            if (finalImgHeight > (pdfHeight - (margin * 2))) {
                finalImgHeight = pdfHeight - (margin * 2);
                finalImgWidth = finalImgHeight / imgRatio;
            }

            // Center horizontally
            const xOffset = (pdfWidth - finalImgWidth) / 2;
            const yOffset = margin;

            pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalImgWidth, finalImgHeight);
            pdf.save(`Greenie_Culture_Invoice_${this.placedOrder?.orderId || 'Download'}.pdf`);

            // Restore the buttons and proceed to review
            if (actionsElement) actionsElement.style.display = 'flex';
            this.closeInvoice();
        }).catch((err: any) => {
            console.error('Error generating PDF:', err);
            if (actionsElement) actionsElement.style.display = 'flex';
        });
    }

    closeInvoice() {
        this.showInvoiceModal = false;
        sessionStorage.removeItem('last_placed_order');
        this.showReviewDialog = true;
    }


    handleReviewSubmit(data: { rating: number, description: string }) {
        const user = this.authService.getCurrentUser();
        const checkoutName = `${this.firstName} ${this.lastName}`.trim();
        this.reviewService.addReview({
            userName: user || checkoutName || 'Guest User',
            rating: data.rating,
            description: data.description,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        this.showReviewDialog = false;
        this.router.navigate(['/']);
    }

    finishOrder() {
        localStorage.removeItem('checkout_state');
        sessionStorage.removeItem('last_placed_order');
        this.cartService.clear();
        this.router.navigate(['/']);
    }
}
