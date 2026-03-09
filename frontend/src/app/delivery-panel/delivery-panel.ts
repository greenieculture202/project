import { Component, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-delivery-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-panel.html',
  styleUrls: ['./delivery-panel.css']
})
export class DeliveryPanelComponent implements OnInit {
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);

  allOrders: any[] = [];
  activeMainTab: string = 'orders';
  filterStatus: string = 'All';
  selectedCourier: string = '';
  searchQuery: string = '';
  isLoading: boolean = true;
  today: Date = new Date();

  // Password Protection State
  private courierPasswords: { [key: string]: string } = {
    'Blue Dart': 'bluedart@greenie',
    'Delhivery': 'delhivery@greenie',
    'DTDC': 'dtdc@greenie'
  };
  activeUnlockedCourier: string | null = null;
  showPasswordModal: boolean = false;
  showPasswordText: boolean = false;
  pendingCourier: string = '';
  enteredPassword: string = '';
  passwordError: string = '';

  // India State to Courier Mapping (28 States + 8 UTs)
  public courierStateMapping: { [key: string]: string[] } = {
    'Blue Dart': [
      'Maharashtra', 'Gujarat', 'Goa', 'Rajasthan', 'Madhya Pradesh',
      'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu'
    ],
    'Delhivery': [
      'Delhi', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Himachal Pradesh',
      'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Bihar', 'Jharkhand'
    ],
    'DTDC': [
      'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana',
      'West Bengal', 'Odisha', 'Assam', 'Arunachal Pradesh', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'Puducherry',
      'Andaman and Nicobar Islands', 'Lakshadweep'
    ]
  };

  // Similar to Admin Panel: Consistent tab navigation
  setTab(tab: string, courier?: string, navigate: boolean = true) {
    this.activeMainTab = tab;
    if (courier !== undefined) this.selectedCourier = courier;

    if (navigate) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: this.activeMainTab, courier: this.selectedCourier },
        queryParamsHandling: 'merge'
      });
    }

    if (tab === 'dashboard' || tab === 'orders') {
      this.loadShipments();
    }
  }

  selectCourier(name: string) {

    if (this.activeUnlockedCourier === name) {
      this.setTab('orders', name);
      this.filterStatus = 'All';
    } else {
      this.pendingCourier = name;
      this.showPasswordModal = true;
      this.enteredPassword = '';
      this.passwordError = '';
    }
  }

  verifyCourierPassword() {
    const correctPassword = this.courierPasswords[this.pendingCourier];
    if (this.enteredPassword === correctPassword) {
      this.activeUnlockedCourier = this.pendingCourier;
      this.showPasswordModal = false;
      this.showPasswordText = false;
      this.selectCourier(this.pendingCourier);
    } else {
      this.passwordError = 'Invalid password. Please try again.';
    }
  }

  togglePasswordVisibility() {
    this.showPasswordText = !this.showPasswordText;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.showPasswordText = false;
    this.pendingCourier = '';
    this.enteredPassword = '';
    this.passwordError = '';
  }

  get filteredOrdersV2() {
    let filtered = this.allOrders;

    // Filter by Courier if on Orders tab
    if (this.selectedCourier) {
      filtered = filtered.filter(o => {
        // Automatically check if the order matches the courier's assigned state 
        // OR if it was manually assigned in the database
        const orderState = this.extractState(o);
        const states = this.courierStateMapping[this.selectedCourier] || [];
        return states.includes(orderState) || o.courierName === this.selectedCourier;
      });
    } else {
      filtered = [];
    }

    // Filter by Status
    if (this.filterStatus !== 'All') {
      filtered = filtered.filter(o => o.status === this.filterStatus);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderId.toLowerCase().includes(q) ||
        (o.userId?.fullName && o.userId.fullName.toLowerCase().includes(q))
      );
    }

    // Sort by Date (newest first)
    return filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'orders';
      const courier = params['courier'] || '';
      this.setTab(tab, courier, false);
    });
  }

  loadShipments() {
    this.isLoading = true;
    const token = sessionStorage.getItem('auth_token');
    this.http.get<any[]>('/api/admin/orders', { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: (orders) => {
        // Only show relevant delivery statuses
        this.allOrders = orders.filter(o => ['Pending', 'Shipped', 'Delivered'].includes(o.status));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading shipments:', err);
        this.isLoading = false;
      }
    });
  }

  setFilter(status: string) {
    this.filterStatus = status;
  }

  extractState(order: any): string {
    // Attempt to find state from user profile or shipping address string
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

  getCount(status: string) {
    if (!this.selectedCourier) return 0;
    const states = this.courierStateMapping[this.selectedCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      return o.status === status && (states.includes(orderState) || o.courierName === this.selectedCourier);
    }).length;
  }

  getCourierCount(courier: string, status: string | 'Total') {
    const states = this.courierStateMapping[courier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === courier;
      if (status === 'Total') return isAssigned;
      return isAssigned && o.status === status;
    }).length;
  }

  getComparisonData() {
    return ['Blue Dart', 'Delhivery', 'DTDC'].map(c => ({
      name: c,
      pending: this.getCourierCount(c, 'Pending'),
      shipped: this.getCourierCount(c, 'Shipped'),
      delivered: this.getCourierCount(c, 'Delivered'),
      total: this.getCourierCount(c, 'Total')
    })).sort((a, b) => b.total - a.total);
  }

  getTopCourier() {
    const data = this.getComparisonData();
    return (data.length > 0 && data[0].total > 0) ? data[0] : null;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Shipped': return 'out';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  }

  markAsDelivered(orderId: string) {
    const token = sessionStorage.getItem('auth_token');
    this.http.put(`/api/admin/orders/${orderId}/status`, { status: 'Delivered' }, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: () => {
        this.loadShipments();
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  updateExpectedDate(orderId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    const token = sessionStorage.getItem('auth_token');
    const expectedDate = new Date(input.value);

    // the backend route accepts expectedDeliveryDate now, we also need to keep the existing status
    // To get the existing status:
    const order = this.allOrders.find(o => o.orderId === orderId);
    if (!order) return;

    const payload = {
      status: order.status,
      expectedDeliveryDate: expectedDate.toISOString()
    };

    this.http.put(`/api/admin/orders/${order._id || orderId}/status`, payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: () => {
        // Optionally show success or reload
        // this.loadShipments(); 
      },
      error: (err) => console.error('Error updating expected date:', err)
    });
  }

  backToAdmin() {
    this.router.navigate(['/admin-dashboard']);
  }
}
