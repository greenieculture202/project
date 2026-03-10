import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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

  // Dynamic Courier Data
  couriers: any[] = [];

  // Password Protection State
  private courierPasswords: { [key: string]: string } = {};
  activeUnlockedCourier: string | null = null;
  showPasswordModal: boolean = false;
  showPasswordText: boolean = false;
  pendingCourier: string = '';
  enteredPassword: string = '';
  passwordError: string = '';

  // India State to Courier Mapping (Dynamic)
  public courierStateMapping: { [key: string]: string[] } = {};

  // Courier Pricing (Per-order Charges)
  public courierFees: { [key: string]: number } = {};

  // Management UI State
  showCourierModal: boolean = false;
  editingCourier: any = null;
  courierForm: any = {
    name: '',
    password: '',
    email: '',
    phone: '',
    fee: 50,
    states: '',
    icon: 'fa-truck',
    certificate: ''
  };
  managementError: string = '';

  // Payment Stats
  paymentSummary: any = {
    cod: 0,
    online: 0,
    codPercentage: 0,
    onlinePercentage: 0
  };

  hoveredPaymentSegment: any = null;

  get paymentFilteredOrders() {
    if (!this.selectedCourier) {
      // Return ALL orders if on Payment tab but no courier selected 
      return this.allOrders;
    }
    const states = (this.courierStateMapping as any)[this.selectedCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      return states.includes(orderState) || o.courierName === this.selectedCourier;
    });
  }

  getFeeForOrder(order: any): number {
    const courier = order.courierName || this.getCourierForState(this.extractState(order));
    return this.courierFees[courier] || 0;
  }

  getTerritoryStates(courierName: string | null): string[] {
    if (!courierName) return [];
    return (this.courierStateMapping as any)[courierName] || [];
  }

  public getCourierForState(state: string): string {
    for (const courier in this.courierStateMapping) {
      if (this.courierStateMapping[courier].includes(state)) {
        return courier;
      }
    }
    return '';
  }

  getPartnerColor(name: string): string {
    return '#166534'; // Consistent professional green
  }

  getPartnerIcon(name: string): string {
    const c = this.couriers.find(cc => cc.name === name);
    return c ? (c.icon || 'fa-truck') : 'fa-truck';
  }

  calculatePaymentSummary() {
    // If a courier is selected, show stats only for that courier. 
    // Otherwise show for all.
    const orders = this.selectedCourier ? this.paymentFilteredOrders : this.allOrders;

    let codCount = 0;
    let onlineCount = 0;

    orders.forEach(o => {
      const method = (o.paymentMethod || '').toUpperCase();
      if (method === 'COD' || method === 'CASH ON DELIVERY') {
        codCount++;
      } else {
        onlineCount++;
      }
    });

    const total = codCount + onlineCount || 1;
    this.paymentSummary = {
      cod: codCount,
      online: onlineCount,
      codPercentage: Math.round((codCount / total) * 100),
      onlinePercentage: Math.round((onlineCount / total) * 100)
    };
  }

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
      // Always include courier in queryParams, set to null to remove it if empty
      queryParams.courier = this.selectedCourier || null;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge' // Keeping merge but null handles the removal
      });
    }

    if (tab === 'dashboard' || tab === 'orders' || tab === 'payment') {
      this.loadShipments();
    } else {
      this.calculatePaymentSummary();
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
      // Whenever a specific courier is selected, always shift view to their 'orders' (Dashboard) panel
      this.setTab('orders', name);
      this.filterStatus = 'All';
      this.searchQuery = '';
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
        const states = (this.courierStateMapping as any)[this.selectedCourier] || [];
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
    this.isLoading = true;
    // 1. Parallelize initial data requests so UI populates as soon as ANY data is ready
    Promise.all([
      this.loadCouriers(),
      this.loadShipmentsPromise()
    ]).then(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });

    // 2. React to route changes separately
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'orders';
      const courier = params['courier'] || '';
      this.setTab(tab, courier, false);
    });
  }

  loadShipmentsPromise(): Promise<void> {
    return new Promise((resolve) => {
      const token = sessionStorage.getItem('auth_token');
      this.http.get<any[]>('/api/admin/orders', { headers: { 'x-auth-token': token || '' } }).subscribe({
        next: (orders) => {
          this.allOrders = orders.filter(o => ['Pending', 'Shipped', 'Delivered'].includes(o.status));
          this.updateComparisonData();
          this.calculatePaymentSummary();
          resolve();
        },
        error: (err) => {
          console.error('Error loading shipments:', err);
          resolve();
        }
      });
    });
  }

  loadCouriers(): Promise<void> {
    return new Promise((resolve) => {
      const token = sessionStorage.getItem('auth_token');
      this.http.get<any[]>('/api/admin/couriers', { headers: { 'x-auth-token': token || '' } }).subscribe({
        next: (data) => {
          this.couriers = data;
          this.courierPasswords = {};
          this.courierStateMapping = {};
          this.courierFees = {};
          data.forEach(c => {
            if (c.name) {
              this.courierPasswords[c.name] = c.password;
              this.courierStateMapping[c.name] = c.states || [];
              this.courierFees[c.name] = c.fee || 50;
            }
          });
          this.updateComparisonData();
          resolve();
        },
        error: (err) => {
          console.error('Error loading couriers:', err);
          resolve();
        }
      });
    });
  }

  openAddCourier() {
    this.editingCourier = null;
    this.courierForm = {
      name: '',
      password: '',
      email: '',
      phone: '',
      fee: 50,
      states: '',
      icon: 'fa-truck',
      certificate: ''
    };
    this.showCourierModal = true;
    this.managementError = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!allowedTypes.includes(file.type)) {
        this.managementError = 'Only PDF or PPT files are allowed';
        return;
      }
      if (file.size > 800 * 1024) {
        this.managementError = 'File size must be less than 800KB';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.courierForm.certificate = e.target.result;
        this.managementError = '';
      };
      reader.readAsDataURL(file);
    }
  }

  openEditCourier(courier: any) {
    this.editingCourier = courier;
    this.courierForm = {
      ...courier,
      states: (courier.states || []).join(', ')
    };
    this.showCourierModal = true;
    this.managementError = '';
  }

  saveCourier() {
    if (!this.courierForm.name || !this.courierForm.password) {
      this.managementError = 'Name and Password are required';
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    const payload = {
      ...this.courierForm,
      states: this.courierForm.states.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    };

    if (this.editingCourier) {
      this.http.put(`/api/admin/couriers/${this.editingCourier._id}`, payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
        next: () => {
          this.loadCouriers();
          this.showCourierModal = false;
        },
        error: (err) => this.managementError = 'Failed to update courier'
      });
    } else {
      this.http.post('/api/admin/couriers', payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
        next: () => {
          this.loadCouriers();
          this.showCourierModal = false;
        },
        error: (err) => this.managementError = 'Failed to add courier'
      });
    }
  }

  deleteCourier(id: string) {
    if (!confirm('Are you sure you want to delete this courier?')) return;

    const token = sessionStorage.getItem('auth_token');
    this.http.delete(`/api/admin/couriers/${id}`, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: () => this.loadCouriers(),
      error: (err) => console.error('Error deleting courier:', err)
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
        this.calculatePaymentSummary();
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
    const states = (this.courierStateMapping as any)[courierName] || [];
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
    if (!this.selectedCourier) {
      return this.allOrders.filter(o => o.status === status).length;
    }
    const states = (this.courierStateMapping as any)[this.selectedCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      return o.status === status && (states.includes(orderState) || o.courierName === this.selectedCourier);
    }).length;
  }

  getUnassignedCount() {
    const totalPending = this.allOrders.filter(o => o.status === 'Pending').length;
    const assignedPending = this.comparisonData.reduce((sum, c) => sum + (c.pending || 0), 0);
    return Math.max(0, totalPending - assignedPending);
  }

  getCourierCount(courier: string, status: string | 'Total') {
    const states = (this.courierStateMapping as any)[courier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === courier;
      if (status === 'Total') return isAssigned;
      return isAssigned && o.status === status;
    }).length;
  }

  updateComparisonData() {
    const courierNames = this.couriers.map(c => c.name);
    this.comparisonData = courierNames.map(c => ({
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
      next: (updatedOrder: any) => {
        // Update local object immediately
        order.expectedDeliveryDate = updatedOrder.expectedDeliveryDate || expectedDate.toISOString();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error updating expected date:', err)
    });
  }

  getDaysRemaining(expectedDate: any): string {
    if (!expectedDate) return 'Set Date';

    // Support parsing strings like "10-03-2026" if needed, 
    // although generally it should be ISO string from updateExpectedDate
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let expected: Date;
    if (typeof expectedDate === 'string' && expectedDate.includes('-') && !expectedDate.includes('T')) {
      // Handle "DD-MM-YYYY" if it exists in that format
      const parts = expectedDate.split('-');
      if (parts[0].length === 4) {
        expected = new Date(expectedDate); // YYYY-MM-DD
      } else {
        expected = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD-MM-YYYY to YYYY-MM-DD
      }
    } else {
      expected = new Date(expectedDate);
    }

    if (isNaN(expected.getTime())) return 'Invalid Date';
    expected.setHours(0, 0, 0, 0);

    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days late`;
    return `In ${diffDays} days`;
  }

  backToAdmin() {
    this.router.navigate(['/admin-dashboard']);
  }
}
