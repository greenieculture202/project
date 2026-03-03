// Forced rebuild - change v1
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReviewDialogComponent } from '../review-dialog/review-dialog';
import { ReviewService } from '../services/review.service';
import { UserService } from '../services/user.service';

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

    showReviewDialog = false;

    items = this.cartService.items;
    totalAmount = this.cartService.totalAmount;
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

    currentStep = 1;
    showInvoiceModal = false;
    placedOrder: any = null;

    paymentReceived = false;
    private _selectedPayment = 'upi';
    get selectedPayment() { return this._selectedPayment; }
    set selectedPayment(val: string) {
        this._selectedPayment = val;
        if (val === 'upi' && this.currentStep === 3) {
            this.simulateUPIScan();
        } else {
            this.paymentReceived = false;
        }
    }

    simulateUPIScan() {
        this.paymentReceived = false;
        // Simulate a 3-second delay for the user to 'scan'
        setTimeout(() => {
            if (this.selectedPayment === 'upi' && this.currentStep === 3) {
                this.paymentReceived = true;
            }
        }, 3000);
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
                    if (!this.address) this.address = profile.address || '';
                    if (!this.city) this.city = profile.city || '';
                    if (!this.stateName) this.stateName = profile.state || '';

                    // Save the pre-filled state
                    this.saveCheckoutState();
                },
                error: (err) => console.warn('[Checkout] Failed to fetch profile for auto-fill', err)
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
                this.pincode = state.pincode || '';
                this.currentStep = state.currentStep || 1;
                this._selectedPayment = state.selectedPayment || 'upi';

                if (this.currentStep === 3 && this.selectedPayment === 'upi') {
                    this.simulateUPIScan();
                }
            } catch (e) {
                console.error('Error loading checkout state', e);
            }
        }
    }

    isStep1Valid(): boolean {
        return !!(this.firstName && this.lastName && this.contactEmail &&
            this.phone && this.phone.length >= 10 && this.address && this.address.trim().length >= 8 && this.city &&
            this.stateName);
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

    async onPayNow() {
        this.isProcessing = true;

        // Build the order object from cart items
        const cartItems = this.cartService.items();
        const orderData = {
            items: cartItems.map((item: any) => ({
                productId: item.productId || item._id || null,  // Use actual MongoDB product ID
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                weight: item.weight || null,
                planter: item.planter || null,
                isGift: item.isGift || false
            })),
            totalAmount: this.cartService.totalAmount(),
            paymentMethod: this.selectedPayment === 'cod' ? 'Cash on Delivery' : 'UPI'
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
                error: (err) => {
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
            next: (res) => {
                this.isProcessing = false;
                this.placedOrder = res;
                // Persist order for refresh support
                sessionStorage.setItem('last_placed_order', JSON.stringify(res));
                this.showInvoiceModal = true;
                this.cartService.clear();
                localStorage.removeItem('checkout_state');
            },
            error: (err) => {
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

    printInvoice() {
        // After the print/save dialog is closed, auto-proceed to review popup
        const onAfterPrint = () => {
            window.removeEventListener('afterprint', onAfterPrint);
            setTimeout(() => {
                this.closeInvoice();
            }, 300);
        };
        window.addEventListener('afterprint', onAfterPrint);
        window.print();
    }

    closeInvoice() {
        this.showInvoiceModal = false;
        sessionStorage.removeItem('last_placed_order');
        this.showReviewDialog = true;
    }


    handleReviewSubmit(data: { rating: number, description: string }) {
        const user = this.authService.getCurrentUser() as any;
        this.reviewService.addReview({
            userName: user?.fullName || 'Guest User',
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
