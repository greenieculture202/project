import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-user-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-panel.html',
    styleUrl: './user-panel.css'
})
export class UserPanelComponent implements OnInit {
    authService = inject(AuthService);
    private userService = inject(UserService);
    private router = inject(Router);

    dashboardData: any = {
        stats: { totalOrders: 0, greenPoints: 0 },
        recentOrders: []
    };
    allOrders: any[] = [];
    activeTab: string = 'dashboard';
    isLoading = true;

    // Settings fields
    phone = '';
    city = '';
    stateName = '';
    address = '';
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
        this.loadDashboard();
        this.loadAllOrders();
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }

    loadDashboard() {
        console.log('[UserPanel] Loading dashboard...');
        this.isLoading = true;
        this.userService.getDashboardData().subscribe({
            next: (data: any) => {
                console.log('[UserPanel] Dashboard data received:', data);
                this.dashboardData = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('[UserPanel] Error loading dashboard:', err);
                this.isLoading = false;
            }
        });
    }

    loadAllOrders() {
        this.userService.getOrders().subscribe({
            next: (orders: any[]) => {
                this.allOrders = orders;
            },
            error: (err: any) => {
                console.error('[UserPanel] Error loading all orders:', err);
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
