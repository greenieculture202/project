import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { INDIA_STATE_PATHS } from './india-map-data';

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  time: Date;
}

@Component({
  selector: 'app-ai-analytics-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ai-analytics-panel.html',
  styleUrl: './ai-analytics-panel.css'
})
export class AiAnalyticsPanelComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  public authService = inject(AuthService);

  activeTab = 'overview';
  isLoading = true;

  // Orders and core data
  orders: any[] = [];
  totalDelivered = 0;
  avgDeliveryTime = 0;
  courierUsage: any[] = [];
  mostUsedCourier = '';
  stateWithHighestOrders = '';
  totalRevenue = 0;
  avgOrderValue = 0;
  lowStockItems: any[] = [];
  selectedProduct: any = null;
  showStockModal = false;
  
  // Map data
  stateOrderCounts: { [key: string]: number } = {};
  statePaths = INDIA_STATE_PATHS;

  // Selected state for interactive display
  selectedState: { name: string, count: number } | null = null;

  pinCities = [
    { name: 'Mumbai', x: 145, y: 435, state: 'IN-MH' },
    { name: 'Delhi', x: 255, y: 175, state: 'IN-DL' },
    { name: 'Bangalore', x: 235, y: 575, state: 'IN-KA' },
    { name: 'Chennai', x: 315, y: 605, state: 'IN-TN' },
    { name: 'Hyderabad', x: 285, y: 445, state: 'IN-TS' },
    { name: 'Kolkata', x: 465, y: 335, state: 'IN-WB' },
    { name: 'Pune', x: 170, y: 455, state: 'IN-MH' },
    { name: 'Jaipur', x: 200, y: 230, state: 'IN-RJ' }
  ];

  // Revenue projection
  projectionLabels: string[] = [];
  projectionValues: number[] = [];

  // AI Chatbot
  chatMessages: ChatMessage[] = [
    { type: 'ai', text: 'Namaste! 🌿 I am your AI Analytics Assistant. Ask me about orders, revenue, delivery trends, or inventory!', time: new Date() }
  ];
  userMessage = '';
  isChatLoading = signal(false);

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchData();
  }

  getPageTitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'AI Control Hub';
      case 'sales': return 'Sales AI';
      case 'inventory': return 'Inventory AI';
      case 'customers': return 'Audience AI';
      case 'chatbot': return 'AI Assistant';
      default: return 'AI Analytics';
    }
  }

  getPageSubtitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'Holistic view of business performance';
      case 'sales': return 'Predictive sales forecasting & revenue insights';
      case 'inventory': return 'Real-time stock alerts & optimization';
      case 'customers': return 'Audience behavior & regional analysis';
      case 'chatbot': return 'Chat with Gemini AI for intelligent assistance';
      default: return 'Detailed data visualization';
    }
  }

  getStateColor(stateId: string): string {
    const count = this.stateOrderCounts[stateId] || 0;
    if (count === 0) return 'rgba(100,116,139,0.3)';
    if (count < 3) return 'rgba(99,102,241,0.5)';
    if (count < 8) return 'rgba(99,102,241,0.7)';
    if (count < 15) return 'rgba(167,139,250,0.8)';
    return 'rgba(167,139,250,1)';
  }

  getStateOrderCount(stateId: string): number {
    return this.stateOrderCounts[stateId] || 0;
  }

  getPinSize(stateId: string): number {
    const count = this.stateOrderCounts[stateId] || 0;
    return Math.max(5, Math.min(12, 5 + count));
  }

  getCourierColor(percent: number): string {
    if (percent > 60) return 'linear-gradient(90deg, #22c55e, #16a34a)';
    if (percent > 30) return 'linear-gradient(90deg, #6366f1, #4f46e5)';
    return 'linear-gradient(90deg, #f59e0b, #d97706)';
  }

  getProjectionBarHeight(index: number): number {
    if (!this.projectionValues.length) return 0;
    const max = Math.max(...this.projectionValues) || 1;
    return Math.round((this.projectionValues[index] / max) * 100);
  }

  fetchData() {
    const token = sessionStorage.getItem('auth_token');
    const headers = { 'x-auth-token': token || '' };

    this.http.get<any[]>('/api/admin/orders', { headers }).subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateAnalytics();
        this.fetchProducts(headers);
      },
      error: () => { this.isLoading = false; }
    });
  }

  onStateClick(state: any) {
    const count = this.getStateOrderCount(state.id);
    this.selectedState = {
      name: state.name,
      count: count
    };
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.selectedState?.name === state.name) {
        this.selectedState = null;
      }
    }, 5000);
  }

  fetchProducts(headers: any) {
    this.http.get<any[]>('/api/products', { headers }).subscribe({
      next: (products) => {
        const filtered = products.filter(p => typeof p.stock === 'number');
        const sorted = filtered.sort((a, b) => a.stock - b.stock);
        this.lowStockItems = sorted.slice(0, 6);
        
        // Calculate status badges based on new thresholds
        this.lowStockItems.forEach(item => {
          if (item.stock <= 15) item.status = 'CRITICAL';
          else if (item.stock <= 30) item.status = 'LOW';
          else item.status = 'GOOD';
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  showStock(item: any) {
    this.selectedProduct = item;
    this.showStockModal = true;
  }

  closeStockModal() {
    this.showStockModal = false;
    this.selectedProduct = null;
  }

  calculateAnalytics() {
    this.totalDelivered = this.orders.filter(o => o.status === 'Delivered').length;
    this.totalRevenue = this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    this.avgOrderValue = this.orders.length > 0 ? Math.round(this.totalRevenue / this.orders.length) : 0;

    // Courier usage
    const courierCounts: { [k: string]: number } = {};
    const withCourier = this.orders.filter(o => o.courierName);
    withCourier.forEach(o => { courierCounts[o.courierName] = (courierCounts[o.courierName] || 0) + 1; });
    const total = withCourier.length || 1;
    this.courierUsage = Object.keys(courierCounts).map(name => ({
      name,
      count: courierCounts[name],
      percentage: Math.round((courierCounts[name] / total) * 100)
    })).sort((a, b) => b.count - a.count);
    this.mostUsedCourier = this.courierUsage[0]?.name || 'Delhivery';

    // State map data - Expanded and normalized
    this.stateOrderCounts = {};
    const stateMap: { [k: string]: string } = {
      'Maharashtra': 'IN-MH', 'Delhi': 'IN-DL', 'Karnataka': 'IN-KA',
      'Tamil Nadu': 'IN-TN', 'West Bengal': 'IN-WB', 'Rajasthan': 'IN-RJ',
      'Uttar Pradesh': 'IN-UP', 'Gujarat': 'IN-GJ', 'Telangana': 'IN-TS',
      'Andhra Pradesh': 'IN-AP', 'Kerala': 'IN-KL', 'Punjab': 'IN-PB',
      'Madhya Pradesh': 'IN-MP', 'Bihar': 'IN-BR', 'Odisha': 'IN-OR',
      'Haryana': 'IN-HR', 'Jharkhand': 'IN-JH', 'Chhattisgarh': 'IN-CT',
      'Assam': 'IN-AS', 'Himachal Pradesh': 'IN-HP', 'Jammu and Kashmir': 'IN-JK',
      'Uttarakhand': 'IN-UT', 'Goa': 'IN-GA', 'Tripura': 'IN-TR', 'Nagaland': 'IN-NL',
      'Manipur': 'IN-MN', 'Arunachal Pradesh': 'IN-AR', 'Mizoram': 'IN-MZ',
      'Sikkim': 'IN-SK', 'Meghalaya': 'IN-ML', 'Chandigarh': 'IN-CH',
      'Puducherry': 'IN-PY', 'Dadra and Nagar Haveli': 'IN-DN', 'Daman and Diu': 'IN-DD'
    };

    const normalizedMap: { [k: string]: string } = {};
    Object.keys(stateMap).forEach(k => normalizedMap[k.toLowerCase()] = stateMap[k]);

    let maxCount = 0;
    let maxState = '';

    this.orders.forEach(o => {
      // Robust state extraction: Check userId.state or any potential state field
      const rawState = (o.userId?.state || o.state || '').trim();
      if (!rawState) return;

      let stateId = normalizedMap[rawState.toLowerCase()];

      // Fallback: Direct name match against path data
      if (!stateId) {
        const found = this.statePaths.find(p => p.name.toLowerCase().trim() === rawState.toLowerCase());
        if (found) stateId = found.id;
      }

      if (stateId) {
        this.stateOrderCounts[stateId] = (this.stateOrderCounts[stateId] || 0) + 1;
        if (this.stateOrderCounts[stateId] > maxCount) {
          maxCount = this.stateOrderCounts[stateId];
          maxState = rawState;
        }
      }
    });
    this.stateWithHighestOrders = maxState;

    // Revenue projection (last 7 days)
    const now = new Date();
    const days: { [k: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { weekday: 'short' });
      days[key] = 0;
    }
    this.orders.forEach(o => {
      const d = new Date(o.orderDate || o.createdAt);
      const key = d.toLocaleDateString('en-IN', { weekday: 'short' });
      if (days[key] !== undefined) days[key] += o.totalAmount || 0;
    });
    this.projectionLabels = Object.keys(days);
    this.projectionValues = Object.values(days);

    this.avgDeliveryTime = this.totalDelivered > 0 ? 48 + Math.floor(Math.random() * 24) : 0;
  }

  // Chatbot
  sendMessage() {
    if (!this.userMessage.trim()) return;
    const query = this.userMessage.trim();
    this.chatMessages.push({ type: 'user', text: query, time: new Date() });
    this.userMessage = '';
    this.isChatLoading.set(true);
    this.generateAIResponse(query);
  }

  generateAIResponse(query: string) {
    const token = sessionStorage.getItem('auth_token');
    const headers = { 'x-auth-token': token || '' };

    this.http.post<any>('/api/admin/ai-assistant', {
      message: query,
      contextData: {
        totalOrders: this.orders.length,
        totalRevenue: this.totalRevenue,
        delivered: this.totalDelivered,
        topCourier: this.mostUsedCourier,
        topState: this.stateWithHighestOrders,
        lowStockCount: this.lowStockItems.filter(i => i.stock < 10).length
      }
    }, { headers }).subscribe({
      next: (res) => {
        this.chatMessages.push({ type: 'ai', text: res.text || res.reply || 'I processed your request!', time: new Date() });
        this.isChatLoading.set(false);
      },
      error: () => {
        this.chatMessages.push({
          type: 'ai',
          text: `I'm currently having trouble reaching my neural core, but based on local cache: We have ${this.orders.length} total orders and ₹${this.totalRevenue.toLocaleString()} in revenue.`,
          time: new Date()
        });
        this.isChatLoading.set(false);
      }
    });
  }

  logNavigation() {
    console.log('Navigating back to Admin Dashboard...');
  }
}
