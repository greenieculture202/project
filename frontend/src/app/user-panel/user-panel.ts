import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
    selector: 'app-user-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-panel.html',
    styleUrl: './user-panel.css'
})
export class UserPanelComponent implements OnInit {
    // Return Flow State
    // Return Flow State
    isReturning = false;
    returnStep = 1; // 1=Reason, 2=Evidence Upload, 3=Confirmation
    returnReason = '';
    returnReasonOther = '';
    returnBillPreview = '';
    returnProductPreview = '';
    returnProductPreview2 = '';
    isSubmittingReturn = false;
    submittedReturns = new Set<string>(); // Mock tracking for returns already submitted
    showStatusInfoModal = false;
    selectedOrderForStatusInfo: any = null;

    returnReasons = [
        { id: 'damaged', icon: 'fas fa-box-open', label: 'Product Damaged / Broken', desc: 'Item arrived in damaged condition or broken parts' },
        { id: 'wrong', icon: 'fas fa-times-circle', label: 'Wrong Item Received', desc: 'Received a different product than what was ordered' },
        { id: 'dead_plant', icon: 'fas fa-seedling', label: 'Plant Arrived Dead', desc: 'Plants were wilted, dead, or in very poor condition' },
        { id: 'not_desc', icon: 'fas fa-tag', label: 'Not as Described', desc: 'Product does not match the description or photos' },
        { id: 'quality', icon: 'fas fa-star-half-stroke', label: 'Poor Quality', desc: 'Product quality is significantly below expectations' },
        { id: 'other', icon: 'fas fa-comment-dots', label: 'Other Reason', desc: 'Something else — please describe below' }
    ];

    public authService = inject(AuthService);
    private userService = inject(UserService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    dashboardData: { stats: { totalOrders: number; greenPoints: number }; recentOrders: any[] } = {
        stats: { totalOrders: 0, greenPoints: 0 },
        recentOrders: []
    };

    get recentOrdersSlice(): any[] {
        return this.dashboardData.recentOrders.slice(0, 3);
    }
    allOrders: any[] = [];
    activeTab: string = 'dashboard';
    isLoading = true;
    isSaving = false;
    userProfile: any = null;

    // Settings fields
    fullName = '';
    email = '';
    phone = '';
    city = '';
    stateName = '';
    address = '';
    selectedOrderForBill: any = null;
    selectedOrderForModal: any = null; // For Order Details Modal
    isGeneratingPdf: boolean = false; // For Download Spinner
    showImpactModal: boolean = false;
    co2Offset: number = 0;
    profilePic = '';
    profilePicPreview = '';
    showStateDropdown = false;
    showCityDropdown = false;
    expandedOrderId: string | null = null;

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

        // Restore active tab from session storage if it exists
        const savedTab = sessionStorage.getItem('user_panel_tab');
        if (savedTab) {
            this.activeTab = savedTab;
        }

        // Set initial preview from session storage to avoid blank UI on refresh
        this.profilePicPreview = sessionStorage.getItem('user_pic') || '';

        // Load data based on restored tab
        if (this.activeTab === 'dashboard') this.loadDashboard();
        else if (this.activeTab === 'orders') this.loadAllOrders();
        else if (this.activeTab === 'settings') this.loadProfile();

        // Always load profile in background to sync name/pic
        if (this.activeTab !== 'settings') this.loadProfile();
    }

    loadProfile() {
        console.log('[UserPanel] Fetching profile...');
        this.userService.getUserProfile().subscribe({
            next: (profile: any) => {
                console.log('[UserPanel] Profile data received:', profile);
                this.userProfile = profile;
                if (profile) {
                    this.fullName = profile.fullName || '';
                    this.email = profile.email || '';
                    this.phone = profile.phone || '';
                    this.address = profile.address || '';
                    this.city = profile.city || '';
                    this.stateName = profile.state || '';
                    this.profilePic = profile.profilePic || '';
                    this.profilePicPreview = profile.profilePic || '';
                }
                if (this.activeTab === 'settings') this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('[UserPanel] Error loading profile:', err);
                if (this.activeTab === 'settings') this.isLoading = false;
                if (err.status === 401) {
                    console.log('[UserPanel] Unauthorized - might need to re-login');
                }
                this.cdr.detectChanges();
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Limit to 500KB to stay within safe payload sizes for NoSQL/JSON
            if (file.size > 512 * 1024) {
                alert('File is too large! Please choose an image smaller than 500KB.');
                return;
            }

            console.log(`[UserPanel] Selected file: ${file.name}, Size: ${file.size} bytes`);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profilePicPreview = e.target.result;
                this.profilePic = e.target.result; // Send base64 to server
                console.log('[UserPanel] Base64 image generated');
            };
            reader.readAsDataURL(file);
        }
    }

    saveSettings() {
        this.isSaving = true;
        const profileData = {
            fullName: this.fullName,
            phone: this.phone,
            address: this.address,
            city: this.city,
            state: this.stateName,
            profilePic: this.profilePic
        };

        this.userService.updateUserProfile(profileData).subscribe({
            next: (res) => {
                this.isSaving = false;
                this.authService.updateUserLocalInfo(this.fullName, this.profilePic);
                alert('Profile updated successfully!');
                this.loadProfile(); // Refresh
                // If it's the dashboard, maybe need to update name in sidebar? 
                // Currently sidebar uses authService.currentUser$
            },
            error: (err) => {
                this.isSaving = false;
                console.error('[UserPanel] Update failed:', err);

                if (err.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    this.logout();
                    return;
                }

                const errorMsg = err.error?.message || err.error?.error || 'Database sync failed. Please check your inputs.';
                alert(`Error: ${errorMsg}`);
            }
        });
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
        sessionStorage.setItem('user_panel_tab', tab);
        this.isLoading = true; // Show loader when switching
        if (tab === 'dashboard') this.loadDashboard();
        if (tab === 'orders') this.loadAllOrders();
        if (tab === 'settings') this.loadProfile();
    }

    loadDashboard() {
        console.log('[UserPanel] Loading dashboard...');
        this.isLoading = true;
        this.userService.getDashboardData().subscribe({
            next: (data: any) => {
                console.log('[UserPanel] Dashboard data received:', data);
                this.dashboardData = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('[UserPanel] Error loading dashboard:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadAllOrders() {
        this.isLoading = true;
        this.userService.getOrders().subscribe({
            next: (orders: any[]) => {
                this.allOrders = orders.map(order => {
                    // Persistent tracking: If status is 'Return Requested', count it as submitted
                    if (order.status === 'Return Requested') {
                        this.submittedReturns.add(order.orderId);
                    }
                    const expectedDate = this.getExpectedDeliveryDate(order);
                    return {
                        ...order,
                        expectedDeliveryDate: expectedDate || order.expectedDeliveryDate,
                        effectiveStatus: this.getEffectiveStatus(order)
                    };
                });
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('[UserPanel] Error loading all orders:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    toggleOrderDetails(orderId: string) {
        if (this.expandedOrderId === orderId) {
            this.expandedOrderId = null;
        } else {
            this.expandedOrderId = orderId;
        }
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
        return 7;
    }

    getOutForDeliveryThresholdDays(order: any): number {
        const days = this.getDeliveryDurationDays(order);
        const thresholdMap: { [k: number]: number } = { 2: 1, 4: 2, 7: 4, 10: 8 };
        return thresholdMap[days] ?? Math.floor(days / 2);
    }

    getExpectedDeliveryDate(order: any): Date | null {
        const shippedAt = order.assignedAt ? new Date(order.assignedAt) : null;
        if (!shippedAt) return order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate) : null;
        const days = this.getDeliveryDurationDays(order);
        return new Date(shippedAt.getTime() + days * 24 * 60 * 60 * 1000);
    }

    getEffectiveStatus(order: any): string {
        if (!order) return 'Processing';
        if (order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Return Requested') return order.status;
        if (!order.assignedAt || order.status !== 'Shipped') return order.status;
        const shippedAt = new Date(order.assignedAt);
        const now = new Date();
        const daysSinceShipping = (now.getTime() - shippedAt.getTime()) / (1000 * 60 * 60 * 24);
        const deliveryDays = this.getDeliveryDurationDays(order);
        const threshold = this.getOutForDeliveryThresholdDays(order);
        if (daysSinceShipping >= deliveryDays) return 'Delivered';
        if (daysSinceShipping >= threshold) return 'Out for Delivery';
        return 'Shipped';
    }

    openOrderModal(order: any) {
        this.selectedOrderForModal = order;
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    closeOrderModal() {
        this.selectedOrderForModal = null;
        this.cancelReturnRequest();
        document.body.style.overflow = 'auto';
    }

    openViewBill(order: any) {
        this.selectedOrderForBill = order;
        // Keep order details modal open in background or close it? 
        // User said "click on View Bill -> Bill shows -> then download". 
        // I'll close the details modal to show the bill clearly.
        // this.selectedOrderForModal = null; 
    }

    closeViewBill() {
        this.selectedOrderForBill = null;
    }

    cancelOrder(id: string) {
        if (!this.isActionWindowOpen(this.selectedOrderForModal)) {
            alert('Cancellation window (7 hours) has expired.');
            return;
        }
        if (!confirm('Are you sure you want to cancel this order?')) return;

        this.userService.updateOrderStatus(id, 'Cancelled').subscribe({
            next: () => {
                alert('Order cancelled successfully.');
                this.loadAllOrders();
                this.loadDashboard();
                this.closeOrderModal();
            },
            error: (err) => {
                console.error('[UserPanel] Cancel failed:', err);
                alert('Failed to cancel order: ' + (err.error?.message || 'Error occurred'));
            }
        });
    }

    requestReturn(order: any) {
        if (!order) return;
        
        // Block if return already submitted
        if (this.submittedReturns.has(order.orderId)) {
            alert('A return request for this order (#' + order.orderId + ') has already been submitted and is under review.');
            return;
        }

        if (!this.isActionWindowOpen(order, 'return')) {
            alert('Return request window has expired.');
            return;
        }
        this.returnStep = 1;
        this.returnReason = '';
        this.returnReasonOther = '';
        this.returnBillPreview = '';
        this.returnProductPreview = '';
        this.returnProductPreview2 = '';
        this.isReturning = true;
    }

    formatStatus(status: string): string {
        if (!status) return 'Processing';
        const s = status.toLowerCase();
        if (s === 'delivered') return 'Successfully Delivered';
        if (s === 'return approved') return 'Return Approved';
        if (s === 'return rejected') return 'Return Rejected';
        return status;
    }

    onStatusClick(order: any) {
        if (!order) return;
        const status = (order.effectiveStatus || order.status).toLowerCase();
        
        // Show info popup for Return Approved, Return Rejected, or Return Requested
        if (status.includes('return')) {
            this.selectedOrderForStatusInfo = order;
            this.showStatusInfoModal = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeStatusInfoModal() {
        this.showStatusInfoModal = false;
        this.selectedOrderForStatusInfo = null;
        document.body.style.overflow = 'auto';
    }


    isReturnSubmitted(orderId: string): boolean {
        // Check local set first
        if (this.submittedReturns.has(orderId)) return true;
        // Check allOrders list status
        const order = this.allOrders.find(o => o.orderId === orderId);
        return order?.status === 'Return Requested' || order?.effectiveStatus === 'Return Requested';
    }

    cancelReturnRequest() {
        this.isReturning = false;
        this.returnStep = 1;
        this.returnReason = '';
        this.returnReasonOther = '';
        this.returnBillPreview = '';
        this.returnProductPreview = '';
        this.returnProductPreview2 = '';
    }

    nextReturnStep() {
        if (this.returnStep === 1 && !this.returnReason) return;
        if (this.returnStep < 4) this.returnStep++;
    }

    prevReturnStep() {
        if (this.returnStep > 1) this.returnStep--;
    }

    getReturnReasonLabel(): string {
        const found = this.returnReasons.find(r => r.id === this.returnReason);
        return found ? found.label : this.returnReason;
    }

    onReturnFileSelected(event: any, type: 'bill' | 'product' | 'product2') {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (type === 'bill') {
                    this.returnBillPreview = e.target.result;
                } else if (type === 'product') {
                    this.returnProductPreview = e.target.result;
                } else {
                    this.returnProductPreview2 = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    submitReturnRequest() {
        // Bill + at least 1 product photo = mandatory (product2 is optional)
        if (!this.returnBillPreview || !this.returnProductPreview) {
            alert('Please upload the Bill image and at least 1 Product photo to continue.');
            return;
        }

        this.isSubmittingReturn = true;
        
        // Call backend to update status permanently
        if (this.selectedOrderForModal) {
            const dbId = this.selectedOrderForModal._id;
            const displayId = this.selectedOrderForModal.orderId;
            
            // Collect return details to send to server
            console.log('[DEBUG] Submitting Return with Images:', {
                hasBill: !!this.returnBillPreview,
                hasP1: !!this.returnProductPreview,
                billLen: this.returnBillPreview?.length,
                p1Len: this.returnProductPreview?.length
            });

            const returnData = {
                returnDetails: {
                    reason: this.getReturnReasonLabel(),
                    additionalInfo: this.returnReason === 'other' ? this.returnReasonOther : '',
                    billImage: this.returnBillPreview,
                    productImage1: this.returnProductPreview,
                    productImage2: this.returnProductPreview2 || null
                }
            };

            this.userService.updateOrderStatus(dbId, 'Return Requested', returnData).subscribe({
                next: (response: any) => {
                    console.log('[DEBUG] Return submission success response:', response);
                    this.submittedReturns.add(displayId);
                    
                    // Update local object states immediately
                    this.selectedOrderForModal.status = 'Return Requested';
                    this.selectedOrderForModal.effectiveStatus = 'Return Requested';
                    this.selectedOrderForModal.returnDetails = returnData.returnDetails;
                    
                    this.isSubmittingReturn = false;
                    this.returnStep = 4; // Show custom success screen
                    
                    // Refresh the main order list in background
                    this.loadAllOrders();
                },
                error: (err) => {
                    console.error('[UserPanel] Failed to update return status:', err);
                    this.isSubmittingReturn = false;
                    alert('Submission failed. Your images might be too large. Please try again with smaller photos.');
                }
            });
        } else {
            // Safety fallback
            setTimeout(() => {
                this.isSubmittingReturn = false;
                this.returnStep = 4;
            }, 1000);
        }
    }

    requestExchange(order: any) {
        if (!this.isActionWindowOpen(order, 'exchange')) {
            alert('Exchange request window (2 days from delivery) has expired.');
            return;
        }
        if (!confirm('Are you sure you want to request an exchange for this order?')) return;
        alert('Exchange request initiated! A botanical expert will assist you with the process shortly.');
    }

    isActionWindowOpen(order: any, type: 'cancel' | 'return' | 'exchange' = 'cancel'): boolean {
        if (!order) return false;
        const now = new Date();

        if (type === 'cancel') {
            if (!order.orderDate) return false;
            const orderDate = new Date(order.orderDate);
            const diffInMs = now.getTime() - orderDate.getTime();
            return diffInMs / (1000 * 60 * 60) <= 7;
        } else {
            // For return: check if ANY item still has an open return window
            return this.getReturnableItems(order).length > 0;
        }
    }

    // Check if an item is a plant (not in non-plant categories)
    isPlantItem(item: any): boolean {
        const nonPlantCats = ['accessories', 'gardening tools', 'seeds', 'fertilizer', 'soil', 'nutrients', 'media', 'gardening', 'tool', 'pot', 'pots'];
        const cat = (item.category || '').toLowerCase();
        return !nonPlantCats.some(nc => cat.includes(nc));
    }

    // Returns items whose return window is still OPEN
    getReturnableItems(order: any): any[] {
        if (!order || !order.items) return [];
        const deliveryDate = this.getActualDeliveryDate(order);
        if (!deliveryDate) return [];
        const now = new Date();
        const diffHours = (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60);

        return order.items.filter((item: any) => {
            const isPlant = this.isPlantItem(item);
            if (isPlant) return diffHours <= 24;
            else return diffHours <= 48;
        });
    }

    // Returns plant items whose 24h window EXPIRED but overall 48h hasn't
    getExpiredPlantItems(order: any): any[] {
        if (!order || !order.items) return [];
        const deliveryDate = this.getActualDeliveryDate(order);
        if (!deliveryDate) return [];
        const now = new Date();
        const diffHours = (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60);
        // Only relevant between 24h and 48h
        if (diffHours <= 24 || diffHours > 48) return [];

        return order.items.filter((item: any) => this.isPlantItem(item));
    }

    // True if ALL items' return windows are expired (button should be fully hidden)
    isReturnWindowFullyExpired(order: any): boolean {
        if (!order) return true;
        const deliveryDate = this.getActualDeliveryDate(order);
        if (!deliveryDate) return true;
        const now = new Date();
        const diffHours = (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60);
        return diffHours > 48;
    }

    // True if order was Delivered AND return window is not fully expired
    hasAnyReturnableItems(order: any): boolean {
        const status = order?.effectiveStatus || order?.status;
        if (status !== 'Delivered') return false;
        return !this.isReturnWindowFullyExpired(order);
    }

    getActualDeliveryDate(order: any): Date | null {
        if (!order) return null;
        if (order.status === 'Delivered' && order.deliveredAt) return new Date(order.deliveredAt);
        
        // If simulated delivery
        if (order.assignedAt && order.status === 'Shipped') {
            const shippedAt = new Date(order.assignedAt);
            const days = this.getDeliveryDurationDays(order);
            return new Date(shippedAt.getTime() + days * 24 * 60 * 60 * 1000);
        }
        
        // Fallback to orderDate + estimated delivery if not even shipped yet (shouldn't happen for return)
        return null;
    }

    hasReturnableItems(order: any): boolean {
        // Now all items are potentially returnable under different rules (Wrong product for plants, 48h for others)
        return order && order.items && order.items.length > 0;
    }

    async downloadBill(order: any) {
        if (this.isGeneratingPdf) return;
        this.isGeneratingPdf = true;
        this.selectedOrderForBill = order;

        // Since the bill is already visible in the modal, we only need a tiny timeout 
        // to Ensure our generator picks it up. 
        setTimeout(async () => {
            const element = document.getElementById('pdf-invoice-template');
            if (!element) {
                alert('Could not generate bill. Please try again.');
                return;
            }

            try {
                const canvas = await (html2canvas as any)(element, {
                    scale: 1.5, // Good balance between speed and quality
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = (pdf as any).getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Bill_${order.orderId}.pdf`);

                // Reset state
                this.selectedOrderForBill = null;
                this.isGeneratingPdf = false;
            } catch (error) {
                console.error('PDF Generation Error:', error);
                alert('Error generating PDF. Please try again.');
                this.selectedOrderForBill = null;
                this.isGeneratingPdf = false;
            }
        }, 100);
    }

    openImpactModal() {
        const totalPlants = (this.dashboardData.recentOrders?.length || 0) + 2;
        this.co2Offset = totalPlants * 1.2; // 1.2kg CO2 average per common garden plant
        this.showImpactModal = true;
        document.body.style.overflow = 'hidden';
    }

    closeImpactModal() {
        this.showImpactModal = false;
        document.body.style.overflow = 'auto';
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    getCourierContact(name: string): string {
        const courier = (name || '').toLowerCase();
        if (courier.includes('bluedart') || courier.includes('blue dart')) return '99098 18606';
        if (courier.includes('delivery') || courier.includes('delhivery')) return '9725966483';
        if (courier.includes('dtdc')) return '9327585720';
        return 'N/A';
    }
}
