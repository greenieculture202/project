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
  activeMainTab: string = 'dashboard';
  filterStatus: string = 'All';
  selectedCourier: string = 'Blue Dart';
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

  // Similar to Admin Panel: Consistent tab navigation
  setTab(tab: string, courier?: string, navigate: boolean = true) {
    this.activeMainTab = tab;
    if (courier) this.selectedCourier = courier;

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

    // Filter by Courier if on Orders tab (or always for this panel)
    filtered = filtered.filter(o => o.courierName === this.selectedCourier);

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
    // Sync with URL Query Params just like Admin Panel
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'dashboard';
      const courier = params['courier'] || 'Blue Dart';
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

  getCount(status: string) {
    return this.allOrders.filter(o => o.status === status && o.courierName === this.selectedCourier).length;
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
  backToAdmin() {
    this.router.navigate(['/admin-dashboard']);
  }
}
