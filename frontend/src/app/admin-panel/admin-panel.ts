import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './admin-panel.html',
    styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
    authService = inject(AuthService);
    userService = inject(UserService);
    productService = inject(ProductService);
    router = inject(Router);

    activeTab: string = 'dashboard';
    userFilter: string = 'All';
    users: any[] = [];
    isLoading: boolean = false;
    productMap: { [key: string]: any[] } = {};
    isLoadingProducts: boolean = false;
    productCategoryFilter: string = 'All';
    activeMainCategory: string = 'Types';

    readonly mainCategoryGroups: { [key: string]: { key: string, label: string }[] } = {
        'Types': [
            { key: 'Indoor Plants', label: 'Indoor' },
            { key: 'Outdoor Plants', label: 'Outdoor' },
            { key: 'Bestsellers', label: 'Bestsellers' },
            { key: 'Flowering Plants', label: 'Flowering' },
            { key: 'Gardening', label: 'Gardening' }
        ],
        'Seeds': [
            { key: 'Vegetable Seeds', label: 'Vegetable Seeds' },
            { key: 'Fruit Seeds', label: 'Fruit Seeds' },
            { key: 'Herb Seeds', label: 'Herb Seeds' },
            { key: 'Seeds Kit', label: 'Seeds Kit' },
            { key: 'Flower Seeds', label: 'Flower Seeds' },
            { key: 'Microgreen Seeds', label: 'Microgreen Seeds' }
        ]
    };

    showDetailModal: boolean = false;
    showAddProductModal: boolean = false;
    selectedUser: any = null;

    newProduct: any = {
        name: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: '',
        image: '',
        tags: ''
    };

    get filteredUsers() {
        if (this.userFilter === 'All') return this.users;
        return this.users.filter(u => u.method === this.userFilter);
    }

    stats = [
        { label: 'Total Users', value: '0', icon: 'users', color: '#4f46e5' },
        { label: 'Total Orders', value: '456', icon: 'shopping-bag', color: '#10b981' },
        { label: 'Revenue', value: '₹84,290', icon: 'credit-card', color: '#f59e0b' },
        { label: 'Pending Reviews', value: '12', icon: 'star', color: '#ef4444' }
    ];

    recentOrders = [
        { id: '#ORD-7721', user: 'Rahul Sharma', date: '2024-03-20', status: 'Delivered', amount: '₹1,250' },
        { id: '#ORD-7722', user: 'Priya Patel', date: '2024-03-21', status: 'Processing', amount: '₹2,100' },
        { id: '#ORD-7723', user: 'Amit Kumar', date: '2024-03-21', status: 'Shipped', amount: '₹850' },
        { id: '#ORD-7724', user: 'Sneha Gupta', date: '2024-03-22', status: 'Pending', amount: '₹3,400' }
    ];

    ngOnInit() {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/login']);
            return;
        }
        this.loadUsers();
    }

    loadUsers() {
        // Only show spinner if we have no users yet (first load)
        if (this.users.length === 0) {
            this.isLoading = true;
        }

        this.userService.getAllUsers().subscribe({
            next: (data: any[]) => {
                this.users = data.map((user: any) => ({
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    phone: user.phone || 'N/A',
                    address: user.address || 'N/A',
                    method: user.method || 'Website',
                    greenPoints: user.greenPoints || 0,
                    profilePic: user.profilePic
                }));
                this.stats[0].value = this.users.length.toString();
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error fetching users:', err);
                this.isLoading = false;
            }
        });
    }

    viewUserDetails(user: any) {
        this.selectedUser = user;
        this.showDetailModal = true;
    }

    closeDetailModal() {
        this.showDetailModal = false;
        this.selectedUser = null;
    }

    setTab(tab: string) {
        this.activeTab = tab;
        if (tab === 'users') {
            this.loadUsers();
        } else if (tab === 'products') {
            this.loadProducts();
        }
    }

    loadProducts() {
        this.isLoadingProducts = true;
        this.productService.getAllProductsMap().subscribe({
            next: (data: any) => {
                this.productMap = data;
                this.isLoadingProducts = false;
            },
            error: (err: any) => {
                console.error('Error loading products for admin:', err);
                this.isLoadingProducts = false;
            }
        });
    }

    setMainGroup(group: string) {
        this.activeMainCategory = group;
        this.productCategoryFilter = 'All';
    }

    getCategoryList() {
        const currentGroup = this.mainCategoryGroups[this.activeMainCategory];
        // Only return categories that exist in the map and are in our defined group
        return currentGroup
            .filter(cat => this.productMap[cat.key])
            .map(cat => cat.key);
    }

    getCategoryLabel(key: string) {
        if (key === 'All') return 'All';
        const allCats = [...this.mainCategoryGroups['Types'], ...this.mainCategoryGroups['Seeds']];
        const match = allCats.find(c => c.key === key);
        return match ? match.label : key;
    }

    get filteredProductCategories() {
        const categories = this.getCategoryList();
        if (this.productCategoryFilter === 'All') return categories;
        return categories.filter(c => c === this.productCategoryFilter);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    deleteUser(id: string, name: string) {
        if (confirm(`Are you sure you want to delete user: ${name}?`)) {
            this.userService.deleteUser(id).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== id);
                    this.stats[0].value = this.users.length.toString();
                },
                error: (err: any) => {
                    console.error('Error deleting user:', err);
                    alert('Failed to delete user');
                }
            });
        }
    }

    openAddProductModal() {
        this.newProduct = {
            name: '',
            price: '',
            originalPrice: '',
            discount: '',
            category: this.productCategoryFilter !== 'All' ? this.productCategoryFilter : '',
            image: '',
            tags: ''
        };
        this.showAddProductModal = true;
    }

    closeAddProductModal() {
        this.showAddProductModal = false;
    }

    submitProduct() {
        if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.category || !this.newProduct.image) {
            alert('Please fill in all required fields (Name, Price, Category, Image)');
            return;
        }

        this.productService.addProduct(this.newProduct).subscribe({
            next: (res: any) => {
                alert('Product added successfully! ✅');
                this.closeAddProductModal();
                this.loadProducts(); // Reload to show the new product
            },
            error: (err: any) => {
                console.error('Error adding product:', err);
                const msg = err?.error?.message || 'Failed to add product. Please check the server and try again.';
                alert('Error: ' + msg);
            }
        });
    }
}
