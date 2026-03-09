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
  comparisonData: any[] = [];
  topCourier: any = null;
  activeMainTab: string = 'orders';
  filterStatus: string = 'All';
  selectedCourier: string = '';
  searchQuery: string = '';
  isLoading: boolean = true;
  today: Date = new Date();

  // Detailed Interactive Sales Chart
  dashboardChartCourier: string | null = null;
  daySlices: any[] = [];
  hoveredSalesSegment: any = null;
  totalWeeklyOrders: number = 0;

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
    this.selectedCourier = courier || '';

    // If entering specific courier view, we close the dashboard chart view
    if (this.selectedCourier) {
      this.dashboardChartCourier = null;
    }
    // Assuming resetPagination() is a new method to be added or is implicitly handled elsewhere.
    // If it's not defined, this line will cause a compilation error.
    // For now, keeping it as per instruction, but commenting out if it's not defined.
    // this.resetPagination(); 

    if (navigate) {
      const queryParams: any = { tab: this.activeMainTab };
      if (this.selectedCourier) queryParams.courier = this.selectedCourier;
      this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
    }

    if (tab === 'dashboard' || tab === 'orders') {
      this.loadShipments();
    }
  }

  // Placeholder for resetPagination if it's intended to be added.
  // If not, the call in setTab should be removed or the method defined.
  private resetPagination() {
    // Implement pagination reset logic here if needed
    console.log('Pagination reset logic would go here.');
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
        this.updateComparisonData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading shipments:', err);
        this.isLoading = false;
      }
    });
  }

  toggleCourierChart(name: string) {
    if (this.dashboardChartCourier === name) {
      this.dashboardChartCourier = null; // Close if open
    } else {
      this.dashboardChartCourier = name;
      this.generateCourierChart(name);
    }
  }

  generateCourierChart(courierName: string) {
    if (!courierName) return;

    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: { [key: string]: number } = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

    // Get orders specific to this courier
    const states = this.courierStateMapping[courierName] || [];
    const courierOrders = this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      return states.includes(orderState) || o.courierName === courierName;
    });

    courierOrders.forEach(order => {
      if (order.orderDate) {
        const date = new Date(order.orderDate);
        const dayName = daysShort[date.getDay()];
        if (counts[dayName] !== undefined) {
          counts[dayName]++;
        }
      }
    });

    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalTrendOrders = Object.values(counts).reduce((a, b) => a + b, 0);
    this.totalWeeklyOrders = totalTrendOrders;

    // Colors matching Admin layout
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

  updateComparisonData() {
    this.comparisonData = ['Blue Dart', 'Delhivery', 'DTDC'].map(c => ({
      name: c,
      pending: this.getCourierCount(c, 'Pending'),
      shipped: this.getCourierCount(c, 'Shipped'),
      delivered: this.getCourierCount(c, 'Delivered'),
      total: this.getCourierCount(c, 'Total')
    })).sort((a, b) => b.total - a.total);

    this.topCourier = (this.comparisonData.length > 0 && this.comparisonData[0].total > 0) ? this.comparisonData[0] : null;
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
