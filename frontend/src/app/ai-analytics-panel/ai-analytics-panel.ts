import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
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

interface NeuralInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'critical';
  title: string;
  content: string;
  timestamp: string;
  icon: string;
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
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  activeTab = 'overview';
  isLoading = true;
  
  // Marketing & Growth
  marketingContent = signal<string | null>(null);
  lastType: string = 'social';
  isMarketingLoading = signal(false);
  marketingProductName = signal<string>('');
  marketingOfferDetails = signal<string>('');
  
  // Operations Hub
  aiTasks = signal<string[]>([]);
  isTasksLoading = signal(false);
  plantReminders = signal<any[]>([]);
  groupedReminders = signal<{user: any, reminders: any[]}[]>([]);
  selectedUserGroup = signal<{user: any, reminders: any[]} | null>(null);
  showRemindersModal = signal(false);
  isRemindersLoading = signal(false);

  // Universal Search
  searchQuery = '';
  isSearchVisible = signal(false);
  searchResults = signal<any[]>([]);

  // Neural Insights
  insightStream = signal<NeuralInsight[]>([]);
  private insightInterval: any;
  private possibleInsights: { type: 'success' | 'warning' | 'info' | 'critical', icon: string, title: string, content: string }[] = [
    { type: 'success', icon: 'fa-rocket', title: 'Revenue Surge', content: 'Conversion rates up by 14.5% in the last 2 hours. Neural pulse suggests sustained growth.' },
    { type: 'warning', icon: 'fa-bolt', title: 'Supply Strain', content: 'Indoor plants category stock dropping fast. AI recommends checking supplier bandwidth.' },
    { type: 'info', icon: 'fa-microchip', title: 'Sentiment Peak', content: 'Customer sentiment analysis indicates 92% positive reception of recent offers.' },
    { type: 'critical', icon: 'fa-triangle-exclamation', title: 'Drift Detected', content: 'Unusual delivery delays in North Zone. Rerouting algorithms active.' },
    { type: 'info', icon: 'fa-brain', title: 'Predictive Edge', content: 'Tomorrow\'s order volume projected to be 2.4x higher based on cluster patterns.' }
  ];

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
  selectedState: { 
    name: string, 
    count: number, 
    topProducts?: any[], 
    priceRange?: { low: number, high: number }, 
    avg?: number 
  } | null = null;



  // Revenue projection
  projectionLabels: string[] = [];
  projectionValues: number[] = [];

  // AI Chatbot
  chatMessages: ChatMessage[] = [
    { type: 'ai', text: 'Namaste! 🌿 I am your AI Analytics Assistant. Ask me about orders, revenue, delivery trends, or inventory!', time: new Date() }
  ];
  userMessage = '';
  isChatLoading = signal(false);

  regionalIntelligence = signal<any>({});
  
  // Category Filtering
  allCategories = signal<string[]>(['All', 'Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Seeds', 'Accessories', 'Tools', 'XL Plants']);
  selectedCategory = signal<string>('All');
  allProducts: any[] = [];
  filteredInventory = signal<any[]>([]);

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchData();
    this.fetchRegionalStats();
    this.loadHistory();
    this.startInsightEngine();
    this.getAiTasks();
    this.getPlantReminders();
  }

  loadHistory() {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    this.http.get<any[]>('/api/admin/chat-history', {
      headers: { 'x-auth-token': token }
    }).subscribe({
      next: (history) => {
        if (history && history.length > 0) {
          this.chatMessages = history.map(m => ({
            type: m.role as 'user' | 'ai',
            text: m.text,
            time: new Date(m.timestamp)
          }));
          setTimeout(() => this.scrollToBottom(), 200);
        }
      },
      error: (err) => console.error('Failed to load admin chat history', err)
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }

  ngOnDestroy() {
    if (this.insightInterval) {
      clearInterval(this.insightInterval);
    }
  }

  startInsightEngine() {
    // Initial insights
    this.generateInsight();
    setTimeout(() => this.generateInsight(), 2000);
    
    // Regular updates
    this.insightInterval = setInterval(() => {
      this.generateInsight();
    }, 12000);
  }

  generateInsight() {
    const template = this.possibleInsights[Math.floor(Math.random() * this.possibleInsights.length)];
    const newInsight: NeuralInsight = {
      id: Math.random().toString(36).substr(2, 9),
      ...template,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    // Add to stream and keep last 5
    const current = this.insightStream();
    this.insightStream.set([newInsight, ...current].slice(0, 5));
  }

  getPageTitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'AI Control Hub';
      case 'sales': return 'Sales AI';
      case 'inventory': return 'Inventory AI';
      case 'customers': return 'Audience AI';
      case 'chatbot': return 'AI Assistant';
      case 'marketing': return 'Marketing AI ✨';
      case 'tasks': return 'Operations Hub ✅';
      default: return 'AI Analytics';
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'marketing') {
      this.resetMarketingState();
    }
  }

  resetMarketingState() {
    this.marketingContent.set(null);
    this.marketingProductName.set('');
    this.marketingOfferDetails.set('');
  }

  getPageSubtitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'Holistic view of business performance';
      case 'sales': return 'Predictive sales forecasting & revenue insights';
      case 'inventory': return 'Real-time stock alerts & optimization';
      case 'customers': return 'Audience behavior & regional analysis';
      case 'chatbot': return 'Chat with Gemini AI for intelligent assistance';
      case 'marketing': return 'AI-generated captions, emails, and promo strategies';
      case 'tasks': return 'Dynamic AI-prioritized business operations';
      default: return 'Detailed data visualization';
    }
  }

  getStateColor(stateId: string): string {
    const count = this.stateOrderCounts[stateId] || 0;
    if (count === 0) return 'rgba(20, 184, 166, 0.1)'; // Very faded teal/green
    if (count < 3) return 'rgba(16, 185, 129, 0.4)';  // Emerald
    if (count < 8) return 'rgba(16, 185, 129, 0.6)';
    if (count < 15) return 'rgba(5, 150, 105, 0.8)'; // Deep Emerald
    return 'rgba(6, 95, 70, 1)'; // Darkest Forest
  }

  getStateOrderCount(stateId: string): number {
    return this.stateOrderCounts[stateId] || 0;
  }



  getCourierColor(percent: number): string {
    if (percent > 60) return 'linear-gradient(90deg, #10b981, #059669)'; // Emerald
    if (percent > 30) return 'linear-gradient(90deg, #84cc16, #65a30d)'; // Lime
    return 'linear-gradient(90deg, #f59e0b, #d97706)'; // Stay orange for warning
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
      error: (err) => console.error('Failed to fetch orders', err)
    });
  }

  fetchRegionalStats() {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;
    this.http.get<any>('/api/admin/regional-analytics', {
      headers: { 'x-auth-token': token }
    }).subscribe({
      next: (data) => this.regionalIntelligence.set(data),
      error: (err) => console.error('Failed to fetch regional analytics', err)
    });
  }

  onStateClick(state: any) {
    const nameKey = state.name.trim().toUpperCase();
    const stats = this.regionalIntelligence()[nameKey];

    this.selectedState = {
      name: state.name,
      count: this.getStateOrderCount(state.id),
      topProducts: stats?.topProducts || [],
      priceRange: stats?.priceRange || { low: 0, high: 0 },
      avg: stats?.avgOrderValue || 0
    };
    
    // Auto-hide after 8 seconds for a better reading experience
    setTimeout(() => {
      if (this.selectedState?.name === state.name) {
        this.selectedState = null;
      }
    }, 8000);
  }

  onRegionClick(id: string) {
    const state = this.statePaths.find(p => p.id === id);
    if (!state) return;
    this.onStateClick(state);
    
    // Also scroll the map into view if on mobile
    if (window.innerWidth < 768) {
      document.querySelector('.map-card')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getRegionRange(id: string) {
    const state = this.statePaths.find(p => p.id === id);
    if (!state) return null;
    const nameKey = state.name.trim().toUpperCase();
    return this.regionalIntelligence()[nameKey]?.priceRange;
  }

  fetchProducts(headers: any) {
    this.http.get<any[]>('/api/products', { headers }).subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[AI-PANEL] Products fetch failed:', err);
        this.isLoading = false;
      }
    });
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.allProducts];
    const cat = this.selectedCategory();
    
    if (cat !== 'All') {
      filtered = filtered.filter(p => p.category === cat);
    }
    
    // Sort by stock ascending
    filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    
    // Process status badges
    filtered.forEach(item => {
      const s = typeof item.stock === 'number' ? item.stock : 999;
      if (s <= 10) item.status = 'CRITICAL';
      else if (s <= 30) item.status = 'LOW';
      else if (s <= 60) item.status = 'MODERATE';
      else item.status = 'GOOD';
    });

    this.lowStockItems = filtered.slice(0, 15);
    this.filteredInventory.set(this.lowStockItems);
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
    this.totalRevenue = this.orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    this.avgOrderValue = this.orders.length > 0 ? Math.round(this.totalRevenue / this.orders.length) : 0;

    // Generate projection data (Past 7 days)
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    this.projectionLabels = last7Days;
    
    // Simple projection logic: actual revenue spread over days + some random growth
    const dailyBase = this.totalRevenue / 7;
    this.projectionValues = last7Days.map((_, i) => Math.round((dailyBase || 1200) * (0.8 + Math.random() * 0.4 + (i * 0.1))));

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
      // Robust state extraction: prioritize shippingDetails, then fallback to userId or root
      const rawState = (o.shippingDetails?.state || o.userId?.state || o.state || '').trim();
      if (!rawState) return;

      let stateId: string = normalizedMap[rawState.toLowerCase()] || '';
      
      // If still no direct match, try fuzzy matching (e.g. "UTTAR PRADESH" -> "IN-UP")
      if (!stateId) {
        const fuzzyMatch = Object.keys(normalizedMap).find(k => k.includes(rawState.toLowerCase()));
        stateId = fuzzyMatch ? normalizedMap[fuzzyMatch] : '';
      }

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
    setTimeout(() => this.scrollToBottom(), 100);
  }

  generateAIResponse(query: string, retryCount = 0) {
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
        this.chatMessages.push({ type: 'ai', text: res.text || 'Request processed!', time: new Date() });
        this.isChatLoading.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        // If backend fails completely (not just AI fallback), show one final report
        this.chatMessages.push({
          type: 'ai',
          text: `⚠️ **System Link Interrupted**\n\n- Total Orders: **${this.orders.length}**\n- Revenue: **₹${this.totalRevenue.toLocaleString()}**\n\nYour business data is still safe in the dashboard. Try refreshing the AI link soon.`,
          time: new Date()
        });
        this.isChatLoading.set(false);
      }
    });
  }

  logNavigation() {
    console.log('Navigating back to Admin Dashboard...');
  }

  // Growth Hub Methods
  generateMarketing(type: string, prod: string, details: string) {
    if (!prod.trim() || !details.trim()) {
      alert("Please enter both Product Name and Offer Details before generating content! 🌱");
      return;
    }
    this.lastType = type;
    this.isMarketingLoading.set(true);
    const token = sessionStorage.getItem('auth_token');
    this.http.post<any>('/api/admin/generate-marketing', { type, productName: prod, offerDetails: details }, {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (res) => {
        this.marketingContent.set(res.text);
        this.isMarketingLoading.set(false);
      },
      error: () => this.isMarketingLoading.set(false)
    });
  }

  getAiTasks() {
    this.isTasksLoading.set(true);
    const token = sessionStorage.getItem('auth_token');
    this.http.get<any>('/api/admin/ai-tasks', {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (res) => {
        this.aiTasks.set(res.tasks);
        this.isTasksLoading.set(false);
      },
      error: () => this.isTasksLoading.set(false)
    });
  }

  completeTask(index: number) {
    const currentTasks = this.aiTasks();
    const updatedTasks = currentTasks.filter((_, i) => i !== index);
    this.aiTasks.set(updatedTasks);
  }

  getPlantReminders() {
    this.isRemindersLoading.set(true);
    const token = sessionStorage.getItem('auth_token');
    this.http.get<any[]>('/api/admin/plant-reminders', {
      headers: { 'x-auth-token': token || '' }
    }).subscribe({
      next: (res) => {
        this.plantReminders.set(res);
        this.groupReminders(res);
        this.isRemindersLoading.set(false);
      },
      error: () => this.isRemindersLoading.set(false)
    });
  }

  groupReminders(reminders: any[]) {
    const groups: { [key: string]: { user: any, reminders: any[] } } = {};
    
    reminders.forEach(rem => {
      const userId = rem.userId?._id || 'anonymous';
      if (!groups[userId]) {
        groups[userId] = {
          user: rem.userId || { fullName: 'Anonymous', email: 'N/A' },
          reminders: []
        };
      }
      groups[userId].reminders.push(rem);
    });

    this.groupedReminders.set(Object.values(groups));
  }

  openRemindersModal(group: any) {
    this.selectedUserGroup.set(group);
    this.showRemindersModal.set(true);
  }

  closeRemindersModal() {
    this.showRemindersModal.set(false);
    this.selectedUserGroup.set(null);
  }

  getReminderCounts(reminders: any[]) {
    const sent = reminders.filter(r => r.notificationStatus === 'sent').length;
    const pending = reminders.filter(r => r.notificationStatus === 'pending').length;
    return { sent, pending };
  }

  // Search Logic
  toggleSearch() {
    this.isSearchVisible.set(!this.isSearchVisible());
    if (this.isSearchVisible()) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.searchResults.set([]);
      return;
    }
    const q = this.searchQuery.toLowerCase();
    
    // Search in orders and insights
    const results: any[] = [];
    
    // Search Orders (by ID or customer)
    this.orders.forEach(o => {
      if (o._id.toLowerCase().includes(q) || (o.userId?.fullName || '').toLowerCase().includes(q)) {
        results.push({ type: 'order', title: `Order ${o._id.substr(-6)}`, sub: o.userId?.fullName, icon: 'fa-box', data: o });
      }
    });

    // Search Insights
    this.insightStream().forEach(i => {
      if (i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)) {
        results.push({ type: 'insight', title: i.title, sub: i.content, icon: i.icon, data: i });
      }
    });

    this.searchResults.set(results.slice(0, 6));
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('AI Copy copied to clipboard! ✨');
  }
}
