import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

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
  private notiService = inject(NotificationService);

  allOrders: any[] = [];
  comparisonData: any[] = [];
  topCourier: any = null;
  activeMainTab: string = 'orders';
  filterStatus: string = 'All';
  selectedCourier: string = '';
  shipCourier: string = '';
  searchQuery: string = '';
  activeCourierSubTab: number = 1; // 1: Orders Table, 2: Payment Summary, 3: Analytics
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
  showShipModal: boolean = false;
  selectedOrderForShip: any = null;
  trackingNumber: string = '';
  expectedDeliveryDate: string = '';
  trackingGenLimits: { [key: string]: any } = {};
  showCourierMismatchError: boolean = false;
  suggestedCourier: string = '';
  isShaking: boolean = false;

  // Territory View State
  showTerritoryModal: boolean = false;
  selectedTerritoryView: any = null;

  // Settlement & Communication State
  activeSettlementCourier: string = '';
  selectedOrderIds: string[] = [];
  adminMessageText: string = '';
  courierNotifications: any[] = [];
  isSendingMsg: boolean = false;
  settlementHistory: any[] = [];

  // Settlement Confirm Modal
  showSettlementConfirmModal: boolean = false;
  pendingSettlementData: any = null;


  openTerritoryView(courier: any) {
    this.selectedTerritoryView = courier;
    this.showTerritoryModal = true;
  }

  closeTerritoryView() {
    this.showTerritoryModal = false;
    this.selectedTerritoryView = null;
  }

  // Payment Stats
  paymentSummary: any = {
    cod: 0,
    online: 0,
    codPercentage: 0,
    onlinePercentage: 0
  };

  // Payment View State
  paymentFilterMethod: string = 'All';
  paymentStats: any = {
    totalRevenue: 0,
    codCount: 0,
    onlineCount: 0,
    codRevenue: 0,
    onlineRevenue: 0,
    totalCourierCharges: 0,
    codPercentage: 0,
    onlinePercentage: 0,
    totalOrders: 0
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

    this.calculatePaymentStats();
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

    if (tab === 'dashboard' || tab === 'orders' || tab === 'customers' || tab === 'payments' || tab === 'settlements' || tab === 'setting') {
      this.loadShipments();
      if (tab === 'settlements' && this.activeSettlementCourier) {
        this.loadSettlementHistory(this.activeSettlementCourier);
      }
    } else {
      this.calculatePaymentSummary();
    }
  }

  selectSettlementCourier(courierName: string) {
    this.activeSettlementCourier = courierName;
    this.loadSettlementHistory(courierName);
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
      this.calculatePaymentSummary();
      this.loadCourierNotifications(name);
      this.loadSettlementHistory(name);
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
      // Sync settlement tab
      this.activeSettlementCourier = this.pendingCourier;
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
          this.checkAutomaticDelivery();
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
          if (!this.activeSettlementCourier && this.couriers.length > 0) {
            this.activeSettlementCourier = this.couriers[0].name;
            if (this.activeMainTab === 'settlements') {
              this.loadSettlementHistory(this.activeSettlementCourier);
            }
          }
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
        this.checkAutomaticDelivery();
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

  checkAutomaticDelivery() {
    // Note: Automatic delivery update is currently disabled to ensure database only reflects manual delivery confirmation.
    /*
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasUpdates = false;
    this.allOrders.forEach(order => {
      if (order.status === 'Shipped' && order.expectedDeliveryDate) {
        const expected = new Date(order.expectedDeliveryDate);
        expected.setHours(0, 0, 0, 0);

        if (today.getTime() >= expected.getTime()) {
          order.status = 'Delivered'; // Update locally for immediate feedback
          this.silentMarkAsDelivered(order._id);
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) {
      this.updateComparisonData();
      this.calculatePaymentSummary();
      this.cdr.detectChanges();
    }
    */
  }

  silentMarkAsDelivered(orderId: string) {
    const token = sessionStorage.getItem('auth_token');
    this.http.put(`/api/admin/orders/${orderId}/status`, { status: 'Delivered' }, { headers: { 'x-auth-token': token || '' } }).subscribe({
      error: (err) => console.error('Error updating status silently:', err)
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

    this.dashboardChartCourier = courierName;

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
    // Colors matching Blue/Premium layout
    const dayColors = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];

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

  get dashboardPendingOrders() {
    if (!this.dashboardChartCourier) return [];
    const states = (this.courierStateMapping as any)[this.dashboardChartCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === this.dashboardChartCourier;
      return isAssigned && o.status === 'Pending';
    });
  }

  get dashboardOutOrders() {
    if (!this.dashboardChartCourier) return [];
    const states = (this.courierStateMapping as any)[this.dashboardChartCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === this.dashboardChartCourier;
      return isAssigned && o.status === 'Shipped';
    });
  }

  get dashboardDeliveredOrders() {
    if (!this.dashboardChartCourier) return [];
    const states = (this.courierStateMapping as any)[this.dashboardChartCourier] || [];
    const delivered = this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === this.dashboardChartCourier;
      return isAssigned && o.status === 'Delivered';
    });
    // Return last 5 sorted by date
    return delivered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);
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
      if (status === 'Total') return this.allOrders.length;
      return this.allOrders.filter(o => o.status === status).length;
    }
    const states = (this.courierStateMapping as any)[this.selectedCourier] || [];
    return this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      const isAssigned = states.includes(orderState) || o.courierName === this.selectedCourier;
      if (status === 'Total') return isAssigned;
      return o.status === status && isAssigned;
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

  getCountdown(date: any): string {
    if (!date) return 'Set Date';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(date);
    expected.setHours(0, 0, 0, 0);

    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Delivered';
    return `${diffDays} days to go`;
  }

  updateExpectedDate(orderId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    const token = sessionStorage.getItem('auth_token');
    const expectedDate = new Date(input.value);
    const isoDate = expectedDate.toISOString();

    const order = this.allOrders.find(o => o.orderId === orderId);
    if (!order) return;

    // IMMEDIATE (OPTIMISTIC) UI UPDATE
    order.expectedDeliveryDate = isoDate;
    this.checkAutomaticDelivery();
    this.cdr.detectChanges();

    const payload = {
      status: order.status,
      expectedDeliveryDate: isoDate
    };

    this.http.put(`/api/admin/orders/${order._id || orderId}/status`, payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: (updatedOrder: any) => {
        // Confirm with server data
        order.expectedDeliveryDate = updatedOrder.expectedDeliveryDate || isoDate;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating expected date:', err);
        // Sync with server on error
        this.loadShipments();
      }
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

  openShipModal(order: any) {
    this.selectedOrderForShip = order;
    this.showShipModal = true;
    this.trackingNumber = '';
    this.expectedDeliveryDate = '';
    this.showCourierMismatchError = false;
    // Default to the courier associated with the order or the current dashboard view
    this.shipCourier = this.dashboardChartCourier || order.courierName || this.getCourierForState(this.extractState(order)) || '';
  }

  closeShipModal() {
    this.showShipModal = false;
    this.selectedOrderForShip = null;
    this.trackingNumber = '';
    this.expectedDeliveryDate = '';
    this.showCourierMismatchError = false;
    this.shipCourier = '';
  }

  dispatchOrder(orderId: string) {
    if (!this.shipCourier) {
      this.notiService.show('Please select a courier partner for this shipment.', 'Action Required', 'warning');
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    // VALIDATION: Check if courier matches state
    const orderState = this.extractState(this.selectedOrderForShip);
    const allowedStates = this.courierStateMapping[this.shipCourier] || [];

    if (!allowedStates.includes(orderState)) {
      this.suggestedCourier = this.getCourierForState(orderState);
      this.showCourierMismatchError = true;
      this.isShaking = true;
      setTimeout(() => { this.isShaking = false; this.cdr.detectChanges(); }, 500);
      this.cdr.detectChanges();
      return;
    }

    this.showCourierMismatchError = false;

    if (!this.trackingNumber) {
      this.trackingNumber = this.createTrackingNumberString();
    }

    const payload: any = {
      status: 'Shipped',
      courierName: this.shipCourier,
      trackingNumber: this.trackingNumber
    };

    if (this.expectedDeliveryDate) {
      payload.expectedDeliveryDate = new Date(this.expectedDeliveryDate).toISOString();
    }

    this.http.put(`/api/admin/orders/${this.selectedOrderForShip._id}/status`, payload, {
      headers: { 'x-auth-token': token }
    }).subscribe({
      next: () => {
        this.loadShipments();
        this.closeShipModal();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error dispatching order:', err)
    });
  }

  generateTrackingNumber(orderId: string) {
    if (!orderId) return;
    const now = Date.now();
    if (!this.trackingGenLimits[orderId]) this.trackingGenLimits[orderId] = { count: 0, lockUntil: 0 };
    const state = this.trackingGenLimits[orderId];

    if (state.lockUntil > now) {
      const mins = Math.ceil((state.lockUntil - now) / 60000);
      alert(`Limit reached. Please wait ${mins} minutes.`);
      return;
    }

    if (state.lockUntil !== 0 && now > state.lockUntil) {
      state.count = 0;
      state.lockUntil = 0;
    }

    if (state.count < 1) {
      this.trackingNumber = this.createTrackingNumberString();
      state.count++;
      if (state.count === 1) state.lockUntil = now + (5 * 60 * 1000);
    }
  }

  isTrackingDisabled(orderId: string): boolean {
    const state = this.trackingGenLimits[orderId];
    return state ? (state.count >= 1 && Date.now() < state.lockUntil) : false;
  }

  private createTrackingNumberString(): string {
    return `GC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }

  // Payment View Helpers
  isPaymentCOD(method: string): boolean {
    const m = (method || '').toUpperCase();
    return m === 'COD' || m === 'CASH ON DELIVERY';
  }

  get paymentViewOrders() {
    let orders = this.allOrders;
    if (this.paymentFilterMethod === 'COD') {
      orders = orders.filter(o => this.isPaymentCOD(o.paymentMethod));
    } else if (this.paymentFilterMethod === 'UPI') {
      orders = orders.filter(o => !this.isPaymentCOD(o.paymentMethod));
    }
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  calculatePaymentStats() {
    const orders = this.selectedCourier ? this.paymentFilteredOrders : this.allOrders;
    let codCount = 0;
    let onlineCount = 0;
    let codRevenue = 0;
    let onlineRevenue = 0;
    let totalCourierCharges = 0;

    let totalOwedToCouriers = 0;
    let totalPaidToCouriers = 0;
    let totalPendingToCouriers = 0;
    let totalCollectedFromCouriers = 0;
    let totalPendingFromCouriers = 0;

    orders.forEach(o => {
      const amount = o.totalAmount || 0;
      const fee = this.getFeeForOrder(o);
      totalCourierCharges += fee;

      if (this.isPaymentCOD(o.paymentMethod)) {
        codCount++;
        codRevenue += amount;

        const adminGets = amount - fee;
        totalCollectedFromCouriers += adminGets;
        if (!o.courierSettled) {
          totalPendingFromCouriers += adminGets;
        }
      } else {
        onlineCount++;
        onlineRevenue += amount;

        totalOwedToCouriers += fee;
        if (o.courierSettled) {
          totalPaidToCouriers += fee;
        } else {
          totalPendingToCouriers += fee;
        }
      }
    });

    const totalOrders = codCount + onlineCount || 1;
    this.paymentStats = {
      totalRevenue: codRevenue + onlineRevenue,
      codCount,
      onlineCount,
      codRevenue,
      onlineRevenue,
      totalCourierCharges,
      codPercentage: Math.round((codCount / totalOrders) * 100),
      onlinePercentage: Math.round((onlineCount / totalOrders) * 100),
      totalOrders: codCount + onlineCount,
      totalOwedToCouriers,
      totalPaidToCouriers,
      totalPendingToCouriers,
      totalCollectedFromCouriers,
      totalPendingFromCouriers
    };
  }

  // Courier Settlement Tracking
  getCourierSettlement(courierName: string) {
    const states = this.courierStateMapping[courierName] || [];
    const orders = this.allOrders.filter(o => {
      const orderState = this.extractState(o);
      return states.includes(orderState) || o.courierName === courierName;
    });
    const fee = this.courierFees[courierName] || 0;

    // UPI Orders: Admin owes courier the delivery charges
    const upiOrders = orders.filter(o => !this.isPaymentCOD(o.paymentMethod) && !o.adminSettled);
    const upiSettled = upiOrders.filter(o => o.courierSettled);
    const upiUnsettled = upiOrders.filter(o => !o.courierSettled);
    const upiTotalOwed = upiOrders.length * fee;
    const upiPaid = upiSettled.length * fee;
    const upiPending = upiUnsettled.length * fee;

    // COD Orders: Courier owes admin (totalAmount - delivery fee)
    const codOrders = orders.filter(o => this.isPaymentCOD(o.paymentMethod) && !o.adminSettled);
    const codSettled = codOrders.filter(o => o.courierSettled);
    const codUnsettled = codOrders.filter(o => !o.courierSettled);
    
    // Calculate only for orders the courier HAS collected (courierSettled = true) but NOT YET transferred
    const codTotalCollected = codSettled.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const codCourierKeeps = codSettled.length * fee;
    const codPending = codTotalCollected - codCourierKeeps; // Total collected - delivery charges
    const codAdminGets = codPending;
    const codReceived = 0; // Legacy property, mostly 0 now because ledger tracks historically received payments.

    return {
      courierName,
      fee,
      // UPI Settlement (Admin → Courier)
      upiOrders: upiOrders.length,
      upiTotalOwed,
      upiPaid,
      upiPending,
      upiSettledOrders: upiSettled,
      upiUnsettledOrders: upiUnsettled,
      // COD Settlement (Courier → Admin)
      codOrders: codOrders.length,
      codTotalCollected,
      codCourierKeeps,
      codAdminGets,
      codReceived,
      codPending,
      codSettledOrders: codSettled,
      codUnsettledOrders: codUnsettled
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
        this.calculatePaymentStats();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Settlement toggle error:', err)
    });
  }

  getSettlementForCourier(courierName: string) {
    const s = this.getCourierSettlement(courierName);
    return {
      upiPending: s.upiPending,
      codPending: s.codPending,
      totalPending: s.upiPending + s.codPending
    };
  }

  isOrderSelected(orderId: string): boolean {
    return this.selectedOrderIds.includes(orderId);
  }

  toggleOrderSelection(order: any) {
    const id = order._id;
    const index = this.selectedOrderIds.indexOf(id);
    if (index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else {
      this.selectedOrderIds.push(id);
    }
  }

  calculateSelectedTotal(): number {
    let total = 0;
    this.selectedOrderIds.forEach(id => {
      const order = this.allOrders.find(o => o._id === id);
      if (order) {
        const fee = this.getFeeForOrder(order);
        total += (order.totalAmount - fee);
      }
    });
    return total;
  }

  transferToAdmin() {
    if (this.selectedOrderIds.length === 0) return;

    const total = this.calculateSelectedTotal();
    const courierName = this.activeSettlementCourier;
    
    if (!confirm(`Are you sure you want to transfer ₹${total.toLocaleString()} to Admin for ${this.selectedOrderIds.length} orders?`)) {
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    const payload = {
      orderIds: this.selectedOrderIds,
      courierName: courierName,
      totalAmount: total
    };

    this.http.post('/api/orders/bulk-settle', payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: (res: any) => {
        alert(`Successfully transferred ₹${total.toLocaleString()} to Admin. Admin has been notified.`);
        this.selectedOrderIds = []; // Clear selection
        this.loadShipments(); // Refresh data
      },
      error: (err) => {
        console.error('Settlement error:', err);
        alert('Failed to complete settlement.');
      }
    });
  }

  transferAllPendingToAdmin(courierName: string) {
    const s = this.getCourierSettlement(courierName);
    const pendingOrders = s.codUnsettledOrders;
    
    if (!pendingOrders || pendingOrders.length === 0) {
      alert('No pending COD orders to transfer.');
      return;
    }

    const total = s.codPending;
    if (!confirm(`Are you sure you want to transfer the total pending amount of ₹${total.toLocaleString()} to Admin? This will settle all ${pendingOrders.length} orders.`)) {
      return;
    }

    const orderIds = pendingOrders.map((o: any) => o._id);
    const token = sessionStorage.getItem('auth_token');
    
    const payload = {
      orderIds: orderIds,
      courierName: courierName,
      totalAmount: total
    };

    this.http.post('/api/orders/bulk-settle', payload, { headers: { 'x-auth-token': token || '' } }).subscribe({
      next: (res: any) => {
        this.notiService.show(`Successfully transferred ₹${total.toLocaleString()} to Admin. Account settled!`, 'Settlement Successful', 'success', 'toast');
        this.loadShipments(); 
      },
      error: (err) => {
        console.error('Bulk Settlement error:', err);
        this.notiService.show('Failed to complete bulk transfer. Please verify connection.', 'Transfer Error', 'error');
      }
    });
  }

  sendAdminMessage(courierName: string, customMsg?: string) {
    const messageText = customMsg || this.adminMessageText;
    if (!messageText.trim()) return;

    this.isSendingMsg = true;
    const token = sessionStorage.getItem('auth_token');
    const isAdmin = this.authService.isAdmin();
    
    const payload = {
      courierName,
      title: isAdmin ? 'Message from Admin 📩' : `Message from ${courierName} 📥`,
      message: messageText,
      forceCourierSide: true // Always treat as courier-side when sending from this panel
    };

    this.http.post('/api/admin/notify-courier', payload, {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (res: any) => {
        if (!customMsg) {
          this.notiService.show(
            isAdmin ? `Message successfully sent to ${courierName}` : 'Your message has been sent to the Admin',
           'Message Sent',
           'success',
           'toast'
          );
          this.adminMessageText = '';
        }
        this.loadCourierNotifications(courierName);
        this.isSendingMsg = false;
      },
      error: (err) => {
        console.error('Error sending message:', err);
        this.notiService.show('Failed to deliver message. Please try again.', 'Delivery Error', 'error');
        this.isSendingMsg = false;
      }
    });
  }

  loadCourierNotifications(courierName: string) {
    this.http.get<any[]>(`/api/courier/notifications/${courierName}`).subscribe({
      next: (notis) => {
        this.courierNotifications = notis;
        this.cdr.detectChanges();
        
        // Auto-scroll to bottom of chat
        setTimeout(() => {
          const chatList = document.querySelector('.notifications-list');
          if (chatList) {
            chatList.scrollTop = chatList.scrollHeight;
          }
        }, 100);
      },
      error: (err) => console.error('Error loading notifications:', err)
    });
  }

  clearChatHistory(courierName: string) {
    if (!confirm('Are you sure you want to clear the entire chat history with the Admin?')) return;

    const token = sessionStorage.getItem('auth_token');
    this.http.delete(`/api/courier/notifications/${courierName}`, {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: () => {
        this.notiService.show('Chat history cleared successfully', 'History Cleared', 'success', 'toast');
        this.loadCourierNotifications(courierName);
      },
      error: (err) => {
        console.error('Clear chat error:', err);
        this.notiService.show('Failed to clear chat history.', 'Error', 'error');
      }
    });
  }

  transferCodToAdmin(courierName: string) {
    const s = this.getCourierSettlement(courierName);
    const amount = s.codPending;
    const orderCount = s.codSettledOrders.length;

    if (amount <= 0) {
      this.notiService.show('No pending COD amount to transfer.', 'Info', 'info', 'toast');
      return;
    }

    // Replace native confirm with custom premium modal
    this.pendingSettlementData = {
      courierName,
      amount,
      orderCount,
      orderIds: s.codSettledOrders.map((o: any) => o._id)
    };
    this.showSettlementConfirmModal = true;
  }

  loadSettlementHistory(courierName: string) {
    const token = sessionStorage.getItem('auth_token');
    this.http.get<any[]>(`/api/admin/settlements/${courierName}`, {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (history) => {
        this.settlementHistory = history;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading settlement history:', err)
    });
  }

  confirmSettlementTransfer() {
    if (!this.pendingSettlementData) return;
    
    const { courierName, amount, orderIds, orderCount } = this.pendingSettlementData;
    const token = sessionStorage.getItem('auth_token');
    const payload = {
      orderIds,
      courierName,
      totalAmount: amount
    };

    this.showSettlementConfirmModal = false;

    this.http.post('/api/orders/bulk-settle', payload, {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (res: any) => {
        this.notiService.show(`Successfully transferred ₹${amount.toLocaleString()} to Admin.`, 'Funds Transferred', 'success', 'toast');
        
        // Auto-send chat message to Admin
        const autoMsg = `Payment Completed: ₹${amount.toLocaleString()} has been transferred for ${orderCount} orders via COD settlement. ✅`;
        this.sendAdminMessage(courierName, autoMsg);
        
        this.loadShipments();
        this.loadSettlementHistory(courierName);
      },
      error: (err) => this.notiService.show('Settlement processing failed. Please try again.', 'Process Error', 'error')
    });
  }
}
