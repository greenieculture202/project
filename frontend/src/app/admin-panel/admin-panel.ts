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
    activeMainCategory: string = 'Plants';
    activeAccessoryGroup: string = 'All'; // For the 4 big tabs in Accessories
    readonly mainCategoryGroups: { [key: string]: { key: string, label: string }[] } = {
        'Plants': [
            { key: 'Indoor Plants', label: 'Indoor' },
            { key: 'Outdoor Plants', label: 'Outdoor' },
            { key: 'Bestsellers', label: 'Bestsellers' },
            { key: 'Flowering Plants', label: 'Flowering' },
            { key: 'Gardening', label: 'Gardening' },
            { key: 'New Arrivals', label: 'New Arrivals' },
            { key: 'Air Purifying Plants', label: 'Air Purifying' }
        ],
        'Seeds': [
            { key: 'Vegetable Seeds', label: 'Vegetable Seeds' },
            { key: 'Fruit Seeds', label: 'Fruit Seeds' },
            { key: 'Herb Seeds', label: 'Herb Seeds' },
            { key: 'Seeds Kit', label: 'Seeds Kit' },
            { key: 'Flower Seeds', label: 'Flower Seeds' },
            { key: 'Microgreen Seeds', label: 'Microgreen Seeds' }
        ],
        'Accessories': [
            { key: 'Pots & Planters', label: 'Pots & Planters' },
            { key: 'Watering Equipment', label: 'Watering Equipment' },
            { key: 'Support & Protection', label: 'Support & Protection' },
            { key: 'Lighting Equipment', label: 'Lighting Equipment' },
            { key: 'Decorative & Display', label: 'Decorative & Display' },
            // Pots & Planters
            { key: 'Plastic Pots', label: 'Plastic Pots' },
            { key: 'Ceramic Pots', label: 'Ceramic Pots' },
            { key: 'Terracotta Pots', label: 'Terracotta Pots' },
            { key: 'Hanging Planters', label: 'Hanging Planters' },
            { key: 'Self-Watering Pots', label: 'Self-Watering Pots' },
            { key: 'Grow Bags', label: 'Grow Bags' },
            { key: 'Metal Planters', label: 'Metal Planters' },
            { key: 'Wooden Planters', label: 'Wooden Planters' },
            { key: 'Wall-Mounted Planters', label: 'Wall-Mounted Planters' },
            { key: 'Balcony Railing Planters', label: 'Balcony Railing Planters' },
            { key: 'Decorative Planters', label: 'Decorative Planters' },
            { key: 'Seedling Trays', label: 'Seedling Trays' },
            { key: 'Nursery Pots', label: 'Nursery Pots' },
            { key: 'Vertical Garden Pots', label: 'Vertical Garden Pots' },
            { key: 'Large Outdoor Planters', label: 'Large Outdoor Planters' },
            // Watering Equipment
            { key: 'Watering Can', label: 'Watering Can' },
            { key: 'Spray Bottle', label: 'Spray Bottle' },
            { key: 'Garden Hose', label: 'Garden Hose' },
            { key: 'Hose Nozzle', label: 'Hose Nozzle' },
            { key: 'Drip Irrigation Kit', label: 'Drip Irrigation Kit' },
            { key: 'Sprinkler', label: 'Sprinkler' },
            { key: 'Water Pump', label: 'Water Pump' },
            { key: 'Mist Sprayer', label: 'Mist Sprayer' },
            { key: 'Automatic Water Timer', label: 'Automatic Water Timer' },
            { key: 'Soaker Hose', label: 'Soaker Hose' },
            { key: 'Water Pipe', label: 'Water Pipe' },
            { key: 'Hose Connector', label: 'Hose Connector' },
            { key: 'Water Tank', label: 'Water Tank' },
            { key: 'Self-Watering Spikes', label: 'Self-Watering Spikes' },
            { key: 'Pressure Sprayer', label: 'Pressure Sprayer' },
            // Support & Protection
            { key: 'Plant Support Stick', label: 'Plant Support Stick' },
            { key: 'Trellis', label: 'Trellis' },
            { key: 'Plant Clips', label: 'Plant Clips' },
            { key: 'Garden Net', label: 'Garden Net' },
            { key: 'Shade Net', label: 'Shade Net' },
            { key: 'Frost Cover', label: 'Frost Cover' },
            { key: 'Plant Cover Bag', label: 'Plant Cover Bag' },
            { key: 'Tree Guard', label: 'Tree Guard' },
            { key: 'Bamboo Stakes', label: 'Bamboo Stakes' },
            { key: 'Wire Support Ring', label: 'Wire Support Ring' },
            { key: 'Plant Tie', label: 'Plant Tie' },
            { key: 'Mulching Sheet', label: 'Mulching Sheet' },
            { key: 'Bird Net', label: 'Bird Net' },
            { key: 'Greenhouse Cover', label: 'Greenhouse Cover' },
            { key: 'Wind Protection Screen', label: 'Wind Protection Screen' },
            // Lighting Equipment
            { key: 'LED Grow Light', label: 'LED Grow Light' },
            { key: 'Full Spectrum Light', label: 'Full Spectrum Light' },
            { key: 'UV Grow Light', label: 'UV Grow Light' },
            { key: 'Grow Light Bulb', label: 'Grow Light Bulb' },
            { key: 'Hanging Grow Lamp', label: 'Hanging Grow Lamp' },
            { key: 'Clip Grow Light', label: 'Clip Grow Light' },
            { key: 'Light Timer', label: 'Light Timer' },
            { key: 'Reflector Panel', label: 'Reflector Panel' },
            { key: 'Grow Light Stand', label: 'Grow Light Stand' },
            { key: 'Solar Garden Light', label: 'Solar Garden Light' },
            { key: 'Tube Grow Light', label: 'Tube Grow Light' },
            { key: 'Seedling Grow Light', label: 'Seedling Grow Light' },
            { key: 'Smart Grow Light', label: 'Smart Grow Light' },
            { key: 'Light Controller', label: 'Light Controller' },
            { key: 'Heat Lamp', label: 'Heat Lamp' },
            // Decorative & Display
            { key: 'Plant Stand', label: 'Plant Stand' },
            { key: 'Hanging Basket', label: 'Hanging Basket' },
            { key: 'Wall Shelf', label: 'Wall Shelf' },
            { key: 'Macrame Hanger', label: 'Macrame Hanger' },
            { key: 'Garden Statue', label: 'Garden Statue' },
            { key: 'Decorative Stones', label: 'Decorative Stones' },
            { key: 'Pebbles', label: 'Pebbles' },
            { key: 'Plant Tray', label: 'Plant Tray' },
            { key: 'Moss Decoration', label: 'Moss Decoration' },
            { key: 'Terrarium Glass', label: 'Terrarium Glass' },
            { key: 'Garden Lights', label: 'Garden Lights' },
            { key: 'Balcony Stand', label: 'Balcony Stand' },
            { key: 'Vertical Frame', label: 'Vertical Frame' },
            { key: 'Garden Border Fence', label: 'Garden Border Fence' },
            { key: 'Plant Labels', label: 'Plant Labels' },
            // Soil & Growing Media
            { key: 'Soil Types', label: 'Soil Types' },
            { key: 'Organic Amendments', label: 'Organic Amendments' },
            { key: 'Growth Media', label: 'Growth Media' },
            { key: 'Garden Soil', label: 'Garden Soil' },
            { key: 'Potting Mix', label: 'Potting Mix' },
            { key: 'Red Soil', label: 'Red Soil' },
            { key: 'Black Soil', label: 'Black Soil' },
            { key: 'Sand Mix', label: 'Sand Mix' },
            { key: 'Coco Peat', label: 'Coco Peat' },
            { key: 'Vermicompost', label: 'Vermicompost' },
            { key: 'Peat Moss', label: 'Peat Moss' },
            { key: 'Compost', label: 'Compost' },
            { key: 'Organic Manure', label: 'Organic Manure' },
            { key: 'Perlite', label: 'Perlite' },
            { key: 'Vermiculite', label: 'Vermiculite' },
            { key: 'Hydroponic Media', label: 'Hydroponic Media' },
            { key: 'Mulch', label: 'Mulch' },
            { key: 'Leaf Mold', label: 'Leaf Mold' },
            // Fertilizers & Nutrients
            { key: 'Organic Fertilizers', label: 'Organic Fertilizers' },
            { key: 'Chemical Fertilizers', label: 'Chemical Fertilizers' },
            { key: 'Plant Boosters', label: 'Plant Boosters' },
            { key: 'Organic Fertilizer', label: 'Organic Fertilizer' },
            { key: 'Bone Meal', label: 'Bone Meal' },
            { key: 'Compost Tea', label: 'Compost Tea' },
            { key: 'Bio Fertilizer', label: 'Bio Fertilizer' },
            { key: 'Liquid Fertilizer', label: 'Liquid Fertilizer' },
            { key: 'NPK Fertilizer', label: 'NPK Fertilizer' },
            { key: 'Urea', label: 'Urea' },
            { key: 'Slow Release Fertilizer', label: 'Slow Release Fertilizer' },
            { key: 'Micronutrient Mix', label: 'Micronutrient Mix' },
            { key: 'Plant Growth Booster', label: 'Plant Growth Booster' },
            { key: 'Flower Booster', label: 'Flower Booster' },
            { key: 'Root Booster', label: 'Root Booster' },
            { key: 'Seaweed Extract', label: 'Seaweed Extract' },
            { key: 'Fish Emulsion', label: 'Fish Emulsion' },
            { key: 'Humic Acid', label: 'Humic Acid' },
            // Gardening Tools
            { key: 'Hand Tools', label: 'Hand Tools' },
            { key: 'Cutting Tools', label: 'Cutting Tools' },
            { key: 'Digging Tools', label: 'Digging Tools' },
            { key: 'Power Tools', label: 'Power Tools' },
            { key: 'Hand Trowel', label: 'Hand Trowel' },
            { key: 'Garden Fork', label: 'Garden Fork' },
            { key: 'Soil Scoop', label: 'Soil Scoop' },
            { key: 'Dibber', label: 'Dibber' },
            { key: 'Transplanter', label: 'Transplanter' },
            { key: 'Pruning Shears', label: 'Pruning Shears' },
            { key: 'Hedge Cutter', label: 'Hedge Cutter' },
            { key: 'Garden Scissors', label: 'Garden Scissors' },
            { key: 'Garden Knife', label: 'Garden Knife' },
            { key: 'Rake', label: 'Rake' },
            { key: 'Shovel', label: 'Shovel' },
            { key: 'Spade', label: 'Spade' },
            { key: 'Hoe', label: 'Hoe' },
            { key: 'Weeder', label: 'Weeder' },
            { key: 'Lawn Mower', label: 'Lawn Mower' }
        ]
    };

    showDetailModal: boolean = false;
    showAddProductModal: boolean = false;
    isEditingProduct: boolean = false;
    editingProductId: string | null = null;
    selectedUser: any = null;

    newProduct: any = {
        name: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: '',
        image: '',
        images: ['', '', '', ''], // 4 additional images
        description: '',
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

    setTab(tab: string, mainCategory?: string) {
        this.activeTab = tab;
        if (mainCategory) {
            this.activeMainCategory = mainCategory;
            this.productCategoryFilter = 'All';
        }

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
        if (!this.mainCategoryGroups[this.activeMainCategory]) return [];
        const cats = this.mainCategoryGroups[this.activeMainCategory];
        const keys = cats.map(c => c.key);

        if (this.activeMainCategory === 'Accessories') {
            const accHeaders = ['Pots & Planters', 'Watering Equipment', 'Support & Protection', 'Lighting Equipment', 'Decorative & Display'];
            const soilHeaders = ['Soil Types', 'Organic Amendments', 'Growth Media'];
            const fertHeaders = ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'];
            const toolHeaders = ['Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools'];
            const allHeaders = [...accHeaders, ...soilHeaders, ...fertHeaders, ...toolHeaders];

            if (this.activeAccessoryGroup === 'All') return allHeaders;

            if (this.activeAccessoryGroup === 'Accessories') return accHeaders;
            if (this.activeAccessoryGroup === 'Soil & Growing Media') return soilHeaders;
            if (this.activeAccessoryGroup === 'Fertilizers & Nutrients') return fertHeaders;
            if (this.activeAccessoryGroup === 'Gardening Tools') return toolHeaders;
        }

        return keys;
    }

    getProductsForCategory(category: string): any[] {
        if (this.productMap[category] && this.productMap[category].length > 0) {
            return this.productMap[category];
        }

        // Fallback for Accessories sub-categories and items that don't exist in DB yet
        if (this.activeMainCategory === 'Accessories') {
            const accItems = [
                'Pots & Planters', 'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots', 'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters', 'Decorative Planters', 'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters',
                'Watering Equipment', 'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit', 'Sprinkler', 'Water Pump', 'Mist Sprayer', 'Automatic Water Timer', 'Soaker Hose', 'Water Pipe', 'Hose Connector', 'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer',
                'Support & Protection', 'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net', 'Frost Cover', 'Plant Cover Bag', 'Tree Guard', 'Bamboo Stakes', 'Wire Support Ring', 'Plant Tie', 'Mulching Sheet', 'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen',
                'Lighting Equipment', 'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb', 'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel', 'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light', 'Smart Grow Light', 'Light Controller', 'Heat Lamp',
                'Decorative & Display', 'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue', 'Decorative Stones', 'Pebbles', 'Plant Tray', 'Moss Decoration', 'Terrarium Glass', 'Garden Lights', 'Balcony Stand', 'Vertical Frame', 'Garden Border Fence', 'Plant Labels'
            ];
            const soilItems = ['Soil Types', 'Organic Amendments', 'Growth Media', 'Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix', 'Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure', 'Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'];
            const fertItems = ['Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters', 'Organic Fertilizer', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer', 'Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix', 'Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'];
            const toolItems = ['Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools', 'Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter', 'Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife', 'Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder', 'Lawn Mower'];

            if (accItems.includes(category)) return this.productMap['Accessories'] || [];
            if (soilItems.includes(category)) return this.productMap['Soil & Growing Media'] || [];
            if (fertItems.includes(category)) return this.productMap['Fertilizers & Nutrients'] || [];
            if (toolItems.includes(category)) return this.productMap['Gardening Tools'] || [];
        }

        return [];
    }

    getCategoryLabel(key: string) {
        if (key === 'All') return 'All';
        const allCats = [
            ...this.mainCategoryGroups['Plants'],
            ...this.mainCategoryGroups['Seeds'],
            ...this.mainCategoryGroups['Accessories']
        ];
        const match = allCats.find(c => c.key === key);
        return match ? match.label : key;
    }

    get filteredProductCategories() {
        if (this.activeMainCategory === 'Accessories') {
            if (this.productCategoryFilter === 'All') {
                if (this.activeAccessoryGroup === 'All') {
                    return ['Accessories', 'Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
                }
                return this.getCategoryList();
            }

            // Expanded view for Accessories headers
            if (this.productCategoryFilter === 'Pots & Planters') {
                return ['Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters', 'Self-Watering Pots', 'Grow Bags', 'Metal Planters', 'Wooden Planters', 'Wall-Mounted Planters', 'Balcony Railing Planters', 'Decorative Planters', 'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters'];
            }
            if (this.productCategoryFilter === 'Watering Equipment') {
                return ['Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle', 'Drip Irrigation Kit', 'Sprinkler', 'Water Pump', 'Mist Sprayer', 'Automatic Water Timer', 'Soaker Hose', 'Water Pipe', 'Hose Connector', 'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer'];
            }
            if (this.productCategoryFilter === 'Support & Protection') {
                return ['Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net', 'Shade Net', 'Frost Cover', 'Plant Cover Bag', 'Tree Guard', 'Bamboo Stakes', 'Wire Support Ring', 'Plant Tie', 'Mulching Sheet', 'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen'];
            }
            if (this.productCategoryFilter === 'Lighting Equipment') {
                return ['LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb', 'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel', 'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light', 'Smart Grow Light', 'Light Controller', 'Heat Lamp'];
            }
            if (this.productCategoryFilter === 'Decorative & Display') {
                return ['Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger', 'Garden Statue', 'Decorative Stones', 'Pebbles', 'Plant Tray', 'Moss Decoration', 'Terrarium Glass', 'Garden Lights', 'Balcony Stand', 'Vertical Frame', 'Garden Border Fence', 'Plant Labels'];
            }

            // Expanded view for Soil
            if (this.productCategoryFilter === 'Soil Types') return ['Garden Soil', 'Potting Mix', 'Red Soil', 'Black Soil', 'Sand Mix'];
            if (this.productCategoryFilter === 'Organic Amendments') return ['Coco Peat', 'Vermicompost', 'Peat Moss', 'Compost', 'Organic Manure'];
            if (this.productCategoryFilter === 'Growth Media') return ['Perlite', 'Vermiculite', 'Hydroponic Media', 'Mulch', 'Leaf Mold'];

            // Expanded view for Fertilizers
            if (this.productCategoryFilter === 'Organic Fertilizers') return ['Organic Fertilizer', 'Bone Meal', 'Compost Tea', 'Bio Fertilizer'];
            if (this.productCategoryFilter === 'Chemical Fertilizers') return ['Liquid Fertilizer', 'NPK Fertilizer', 'Urea', 'Slow Release Fertilizer', 'Micronutrient Mix'];
            if (this.productCategoryFilter === 'Plant Boosters') return ['Plant Growth Booster', 'Flower Booster', 'Root Booster', 'Seaweed Extract', 'Fish Emulsion', 'Humic Acid'];

            // Expanded view for Tools
            if (this.productCategoryFilter === 'Hand Tools') return ['Hand Trowel', 'Garden Fork', 'Soil Scoop', 'Dibber', 'Transplanter'];
            if (this.productCategoryFilter === 'Cutting Tools') return ['Pruning Shears', 'Hedge Cutter', 'Garden Scissors', 'Garden Knife'];
            if (this.productCategoryFilter === 'Digging Tools') return ['Rake', 'Shovel', 'Spade', 'Hoe', 'Weeder'];
            if (this.productCategoryFilter === 'Power Tools') return ['Lawn Mower'];

            return [this.productCategoryFilter];
        }

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
        this.isEditingProduct = false;
        this.editingProductId = null;
        this.newProduct = {
            name: '',
            price: '',
            originalPrice: '',
            discount: '',
            category: (this.productCategoryFilter !== 'All' && this.productCategoryFilter) ? this.productCategoryFilter : '',
            image: '',
            images: ['', '', '', ''],
            description: '',
            tags: ''
        };
        this.showAddProductModal = true;
    }

    openEditProductModal(product: any) {
        this.isEditingProduct = true;
        this.editingProductId = product._id;

        // Populate the form with existing product data
        this.newProduct = {
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || '',
            discount: product.discount || '',
            category: product.category,
            image: product.image,
            images: product.images && product.images.length > 0 ? [...product.images] : ['', '', '', ''],
            description: product.description || '',
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || '')
        };

        // Ensure images array has at least 4 elements for the UI inputs
        while (this.newProduct.images.length < 4) {
            this.newProduct.images.push('');
        }

        this.showAddProductModal = true;
    }

    closeAddProductModal() {
        this.showAddProductModal = false;
    }

    submitProduct() {
        // Filter out empty strings from images array
        const cleanedImages = this.newProduct.images.filter((img: string) => img && img.trim() !== '');

        const productToSubmit = {
            ...this.newProduct,
            images: cleanedImages
        };

        if (this.isEditingProduct && this.editingProductId) {
            // UPDATE existing product
            this.productService.updateProduct(this.editingProductId, productToSubmit).subscribe({
                next: (res: any) => {
                    alert('Product updated successfully! ✅');
                    this.closeAddProductModal();
                    this.loadProducts();
                },
                error: (err: any) => {
                    console.error('Error updating product:', err);
                    alert('Failed to update product');
                }
            });
        } else {
            // ADD new product
            this.productService.addProduct(productToSubmit).subscribe({
                next: (res: any) => {
                    alert('Product added successfully! ✅');
                    this.closeAddProductModal();
                    this.loadProducts();
                },
                error: (err: any) => {
                    console.error('Error adding product:', err);
                    const msg = err?.error?.message || 'Failed to add product. Please check the server and try again.';
                    alert('Error: ' + msg);
                }
            });
        }
    }

    deleteProduct(id: string, name: string) {
        if (confirm(`Are you sure you want to delete product: ${name}?`)) {
            this.productService.deleteProduct(id).subscribe({
                next: () => {
                    alert('Product deleted successfully! 🗑️');
                    this.loadProducts();
                },
                error: (err: any) => {
                    console.error('Error deleting product:', err);
                    alert('Failed to delete product');
                }
            });
        }
    }
}
