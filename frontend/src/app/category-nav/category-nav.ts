import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { OFFER_RULES, CATEGORY_TO_OFFER } from '../services/offer-rules';

@Component({
    selector: 'app-category-nav',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './category-nav.html',
    styleUrl: './category-nav.css'
})
export class CategoryNavComponent implements OnInit {
    private productService = inject(ProductService);
    private router = inject(Router);

    activeProducts: Partial<Product>[] = [];
    isInitialized: boolean = false;
    // Pre-computed cache: computed once after products load, read-only in template
    private menuColumnsCache: { [cat: string]: { title: string, items: any[] }[] } = {};
    categories = [
        'Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Seeds', 'Accessories', 'Soil & Growing Media',
        'Fertilizers & Nutrients', 'Gardening Tools', 'About Us', 'Contact Us', "FAQ's"
    ];

    // Map of categories that have specific mega menus
    menus: { [key: string]: any } = {
        'Indoor': {
            eliteGreens: [
                'Snake Plant', 'Money Plant', 'Areca Palm', 'Aloe Vera', 'Peace Lily'
            ],
            perfectPlacements: [
                'Spider Plant', 'Rubber Plant', 'ZZ Plant', 'Jade Plant', 'Lucky Bamboo'
            ],
            plantsCollection: [
                'Chinese Evergreen', 'Dracaena', 'Anthurium', 'Boston Fern', 'Calathea'
            ],
            plantersStyle: [
                'Philodendron', 'Croton', 'Fiddle Leaf Fig', 'English Ivy', 'Orchid'
            ],
            image: '/images/navbar_indoor.png',
            imageText: 'Indoor Plants'
        },
        'Outdoor': {
            eliteGreens: [
                'Ashoka Tree', 'Neem Tree', 'Mango Tree', 'Guava Plant', 'Coconut Tree'
            ],
            perfectPlacements: [
                'Banyan Tree', 'Peepal Tree', 'Palm Tree', 'Bamboo Plant', 'Tulsi Plant'
            ],
            plantsCollection: [
                'Curry Leaf Plant', 'Lemon Plant', 'Papaya Plant', 'Banana Plant', 'Aloe Vera'
            ],
            plantersStyle: [
                'Snake Plant', 'Hibiscus', 'Bougainvillea', 'Areca Palm', 'Croton'
            ],
            image: '/images/navbar_outdoor.png',
            imageText: 'Outdoor Plants'
        },
        'Flowering': {
            eliteGreens: [
                'Peace Lily', 'Anthurium', 'Orchid', 'Kalanchoe', 'Begonia'
            ],
            perfectPlacements: [
                'Geranium', 'African Violet', 'Jasmine (Indoor Variety)', 'Bromeliad', 'Amaryllis'
            ],
            plantsCollection: [
                'Christmas Cactus', 'Crown of Thorns', 'Clivia', 'Gloxinia', 'Flamingo Flower'
            ],
            plantersStyle: [
                'Cyclamen', 'Impatiens', 'Lipstick Plant', 'Hoya', 'Anthurium Lily'
            ],
            image: '/images/navbar_flowering.png',
            imageText: 'Flowering Plants'
        },
        'Plants': {
            eliteGreens: [
                'Lush Ferns Galore', 'All Plants', 'Best Sellers', 'Same Day Delivery',
                { name: 'Luxe Plants', badge: 'New' }, 'New Arrivals', 'Premium Plants',
                'Air Purifying Plants', 'Plants for Her', 'Plants for Him',
                { name: 'Kokedama Plants', badge: 'New' }, 'Plants Offers',
                'Garden Accessories', 'Terrariums Plants', 'Personalised Plants'
            ],
            perfectPlacements: ['Indoor Plants', 'Desktop Plants'],
            forCelebrations: ['Valentine\'s', 'Birthday', 'Anniversary', 'House Warming', 'Good Luck'],
            plantsCollection: [
                'Money Plants', 'Snake Plants', 'Jade Plants', 'Plants DIY Kits',
                'Lucky Bamboo', 'Palm Plants', 'Bonsai Plants', 'Ficus Plants',
                'Spider Plants', 'Exotic Plants', 'Aglaonema Plants', 'Flowering Plants',
                'Cactus n Succulent Plants', 'Low Maintenance Plants'
            ],
            plantersStyle: [
                'Ceramic Planters', 'Metal Planters', 'Glass Planters', 'Mugs Planters',
                'Planter Pots', 'Cake n Plants', 'Plants Combos', 'Flowers n Plants'
            ],
            sendPlantsTo: [
                'Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad',
                'Kolkata', 'Chennai', 'Lucknow', 'Ahmedabad', 'All Other Cities'
            ],
            image: 'https://www.ugaoo.com/cdn/shop/files/Agb_3.jpg?v=1719572522&width=360',
            imageText: 'Lush Plants'
        },
        'Gardening': {
            outdoorBlooms: [
                'Rose (Gulab)', 'Marigold (Genda)', 'Jasmine (Mogra)', 'Petunia', 'Sunflower'
            ],
            homeGardenEssentials: [
                'Tulsi (Holy Basil)', 'Curry Leaves (Kadi Patta)', 'Aloe Vera', 'Lemon Plant', 'Mint (Pudina)'
            ],
            foliageAndGreens: [
                'Areca Palm', 'Ferns', 'Bamboo Palm', 'Croton', 'Cypress'
            ],
            decorativeStyle: [
                'Bougainvillea', 'Hibiscus (Gudhal)', 'Coleus', 'Golden Pothos', 'Song of India'
            ],
            image: '/images/navbar_gardening.png',
            imageText: 'Gardening Essentials'
        },
        'Seeds': {
            vegetableSeeds: [
                'Spinach (Palak)',
                'Fenugreek (Methi)',
                'Coriander (Dhaniya)',
                'Lettuce',
                'Mustard Greens (Sarson)',
                'Tomato (Tamatar)',
                'Chilli (Mirch)',
                'Capsicum (Shimla Mirch)',
                'Brinjal (Baingan)',
                'Cucumber (Kheera)'
            ],
            fruitSeeds: [
                'Mango (Aam)',
                'Apple (Seb)',
                'Orange (Santra)',
                'Papaya',
                'Guava (Amrood)',
                'Pomegranate (Anar)',
                'Watermelon (Tarbooj)',
                'Muskmelon (Kharbooja)',
                'Strawberry',
                'Blueberry',
                'Raspberry',
                'Blackberry'
            ],
            herbSeeds: [
                'Coriander (Dhaniya)',
                'Mint (Pudina)',
                'Basil (Tulsi)',
                'Parsley',
                'Thyme',
                'Oregano',
                'Rosemary',
                'Sage',
                'Ashwagandha',
                'Chamomile',
                'Lemongrass',
                'Aloe Vera'
            ],
            flowerSeeds: [
                'Marigold (Genda)',
                'Sunflower',
                'Rose',
                'Zinnia',
                'Petunia',
                'Cosmos',
                'Daisy',
                'Pansy',
                'Hibiscus (Gudhal)',
                'Balsam (Gulmehendi)',
                'Portulaca (Moss Rose)',
                'Gomphrena'
            ],
            microgreenSeeds: [
                'Mustard (Sarson)',
                'Radish (Mooli)',
                'Broccoli',
                'Cabbage (Patta Gobhi)',
                'Fenugreek (Methi)',
                'Peas (Matar)',
                'Sunflower',
                'Radish',
                'Mustard',
                'Methi',
                'Peas'
            ],
            seedsKit: [
                'Vegetable Garden Bundle', 'Flower Garden Mix', 'Herb Garden Collection', 'Organic Farming Kit', 'Kitchen Garden Starter Kit'
            ],
            image: '/images/navbar_seeds.png',
            imageText: 'Premium Seeds Collection'
        },
        'Accessories': {
            potsAndPlanters: [
                'Plastic Pots', 'Ceramic Pots', 'Terracotta Pots', 'Hanging Planters',
                'Self-Watering Pots', 'Grow Bags', 'Metal Planters', 'Wooden Planters',
                'Wall-Mounted Planters', 'Balcony Railing Planters', 'Decorative Planters',
                'Seedling Trays', 'Nursery Pots', 'Vertical Garden Pots', 'Large Outdoor Planters'
            ],
            wateringEquipment: [
                'Watering Can', 'Spray Bottle', 'Garden Hose', 'Hose Nozzle',
                'Drip Irrigation Kit', 'Sprinkler', 'Water Pump', 'Mist Sprayer',
                'Automatic Water Timer', 'Soaker Hose', 'Water Pipe', 'Hose Connector',
                'Water Tank', 'Self-Watering Spikes', 'Pressure Sprayer'
            ],
            plantSupport: [
                'Plant Support Stick', 'Trellis', 'Plant Clips', 'Garden Net',
                'Shade Net', 'Frost Cover', 'Plant Cover Bag', 'Tree Guard',
                'Bamboo Stakes', 'Wire Support Ring', 'Plant Tie', 'Mulching Sheet',
                'Bird Net', 'Greenhouse Cover', 'Wind Protection Screen'
            ],
            lightingEquipment: [
                'LED Grow Light', 'Full Spectrum Light', 'UV Grow Light', 'Grow Light Bulb',
                'Hanging Grow Lamp', 'Clip Grow Light', 'Light Timer', 'Reflector Panel',
                'Grow Light Stand', 'Solar Garden Light', 'Tube Grow Light', 'Seedling Grow Light',
                'Smart Grow Light', 'Light Controller', 'Heat Lamp'
            ],
            decorativeAccessories: [
                'Plant Stand', 'Hanging Basket', 'Wall Shelf', 'Macrame Hanger',
                'Garden Statue', 'Decorative Stones', 'Pebbles', 'Plant Tray',
                'Moss Decoration', 'Terrarium Glass', 'Garden Lights', 'Balcony Stand',
                'Vertical Frame', 'Garden Border Fence', 'Plant Labels'
            ],
            image: '/images/navbar_accessories.png',
            imageText: 'Premium Accessories'
        },
        'Soil & Growing Media': {
            soilTypes: [
                'Garden Soil',
                'Potting Mix',
                'Red Soil',
                'Black Soil',
                'Sand Mix'
            ],
            organicAmendments: [
                'Coco Peat',
                'Vermicompost',
                'Peat Moss',
                'Compost',
                'Organic Manure'
            ],
            growthMedia: [
                'Perlite',
                'Vermiculite',
                'Hydroponic Media',
                'Mulch',
                'Leaf Mold'
            ],
            image: '/images/navbar_soil.png',
            imageText: 'Premium Growing Media'
        },
        'Fertilizers & Nutrients': {
            organicFertilizers: [
                'Organic Fertilizer',
                'Vermicompost',
                'Bone Meal',
                'Compost Tea',
                'Bio Fertilizer'
            ],
            chemicalFertilizers: [
                'Liquid Fertilizer',
                'NPK Fertilizer',
                'Urea',
                'Slow Release Fertilizer',
                'Micronutrient Mix'
            ],
            plantBoosters: [
                'Plant Growth Booster',
                'Flower Booster',
                'Root Booster',
                'Seaweed Extract',
                'Fish Emulsion',
                'Humic Acid'
            ],
            image: '/images/navbar_fertilizers.png',
            imageText: 'Premium Fertilizers'
        },
        'Gardening Tools': {
            handTools: [
                'Hand Trowel',
                'Garden Fork',
                'Soil Scoop',
                'Dibber',
                'Transplanter'
            ],
            cuttingTools: [
                'Pruning Shears',
                'Hedge Cutter',
                'Garden Scissors',
                'Garden Knife'
            ],
            diggingTools: [
                'Rake',
                'Shovel',
                'Spade',
                'Hoe',
                'Weeder'
            ],
            powerTools: [
                'Lawn Mower'
            ],
            image: '/images/navbar_tools.png',
            imageText: 'Essential Garden Tools'
        }
    };

    activeCategory: string | null = null;

    ngOnInit() {
        this.fetchActiveProducts();
    }

    fetchActiveProducts() {
        this.productService.getActiveProductsMinimal().subscribe({
            next: (products) => {
                this.activeProducts = products;
                this.isInitialized = true;
                // Pre-compute all mega menu columns ONCE so template never does heavy work
                this.categories.forEach(cat => {
                    this.menuColumnsCache[cat] = this._computeMenuColumns(cat);
                });
            },
            error: (err) => {
                console.error('Error in CategoryNav fetch:', err);
                this.isInitialized = true;
            }
        });
    }

    // Fast O(1) lookup used by template — no computation on each change detection
    getCachedColumns(cat: string): { title: string, items: any[] }[] {
        return this.menuColumnsCache[cat] || [];
    }

    private getMappingForMegaMenu(cat: string): string[] {
        const mapping: { [key: string]: string[] } = {
            'Indoor': ['Indoor Plants'],
            'Outdoor': ['Outdoor Plants'],
            'Flowering': ['Flowering Plants'],
            'Gardening': ['Gardening'],
            'Seeds': ['Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds', 'Flower Seeds', 'Microgreen Seeds', 'Seeds Kit'],
            'Accessories': ['Accessories'],
            'Soil & Growing Media': ['Soil & Growing Media', 'Soil Types', 'Organic Amendments', 'Growth Media'],
            'Fertilizers & Nutrients': ['Fertilizers & Nutrients', 'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters'],
            'Gardening Tools': ['Gardening Tools', 'Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools']
        };
        
        let baseMapping = mapping[cat] || [cat];
        
        // Auto-include static names from the menu to prevent leakage/dropping of products with specific subcategories
        if (this.menus[cat]) {
            Object.keys(this.menus[cat]).forEach(k => {
                if (Array.isArray(this.menus[cat][k])) {
                    this.menus[cat][k].forEach((item: any) => {
                        const itemName = this.isComplexItem(item) ? item.name : item;
                        baseMapping.push(itemName);
                    });
                }
            });
        }
        
        // Return unique values only
        return [...new Set(baseMapping)];
    }

    private shouldShowItem(category: string, item: any): boolean {
        // If we haven't loaded products yet, show everything (don't break UI)
        if (!this.isInitialized) return true;

        const itemName = this.isComplexItem(item) ? item.name : item;

        // Define items that should ALWAYS be shown (not specific products)
        const persistentItems = [
            'All Plants', 'Best Sellers', 'Same Day Delivery', 'New Arrivals', 'Premium Plants',
            'Air Purifying Plants', 'Plants for Her', 'Plants for Him', 'Plants Offers',
            'Garden Accessories', 'Terrariums Plants', 'Personalised Plants', 'Indoor Plants',
            'Desktop Plants', 'Valentine\'s', 'Birthday', 'Anniversary', 'House Warming', 'Good Luck',
            'Ceramic Planters', 'Metal Planters', 'Glass Planters', 'Mugs Planter', 'Planter Pots',
            'Cake n Plants', 'Plants Combos', 'Flowers n Plants', 'Delhi NCR', 'Bengaluru', 'Mumbai',
            'Pune', 'Hyderabad', 'Kolkata', 'Chennai', 'Lucknow', 'Ahmedabad', 'All Other Cities',
            'About Us', 'Contact Us', "FAQ's", 'Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds',
            'Flower Seeds', 'Microgreen Seeds', 'Soil Types', 'Organic Amendments', 'Growth Media',
            'Organic Fertilizers', 'Chemical Fertilizers', 'Plant Boosters', 'Hand Tools',
            'Cutting Tools', 'Digging Tools', 'Power Tools', 'Pots & Planters', 'Watering Equipment',
            'Support & Protection', 'Lighting Equipment', 'Decorative & Display'
        ];

        if (persistentItems.includes(itemName)) {
            return true;
        }

        // For actual plant/seed names, check if they exist in the active products list
        // AND belong to the current category mega-menu
        const lowerName = itemName.toLowerCase().trim();
        const dbCategories = this.getMappingForMegaMenu(category).map(c => c.toLowerCase().trim());

        return this.activeProducts.some(p => {
            const activeName = (p.name || '').toLowerCase().trim();
            const pCat = (p.category || '').toLowerCase().trim();

            // Name must match AND product must belong to one of the mapped categories for this menu
            const nameMatch = lowerName === activeName || lowerName.includes(activeName) || activeName.includes(lowerName);
            const categoryMatch = dbCategories.includes(pCat);

            return nameMatch && categoryMatch;
        });
    }

    _computeMenuColumns(cat: string): { title: string, items: any[] }[] {
        if (!this.isInitialized) return [];

        const columns: { title: string, items: any[] }[] = [];
        const menuMappings = this.getMappingForMegaMenu(cat);
        const lowMappings = menuMappings.map(m => m.toLowerCase().trim());
        const menu = this.menus[cat];

        // Ensure we always have a menu object to provide premium headers
        if (menu) {
            const headerKeys = Object.keys(menu).filter(k => Array.isArray(menu[k]));

            // Get all database products for this mega-menu context
            const dbProducts = this.activeProducts.filter(p => {
                const pCat = (p.category || '').toLowerCase().trim();
                const pName = (p.name || '').toLowerCase().trim();

                // Specific matching logic to prevent leakage
                const isDirectMatch = lowMappings.some(lowM => pCat === lowM);
                const isPartialMatch = lowMappings.some(lowM =>
                    pCat.length > 4 && lowM.length > 4 && (pCat.includes(lowM) || lowM.includes(pCat))
                );

                // Safety: Avoid 'Gardening' plants leaking into 'Gardening Tools'
                if (cat === 'Gardening Tools' && pCat === 'gardening') return false;

                return isDirectMatch || isPartialMatch;
            });

            const capturedNames = new Set<string>();

            // 1. Distribute products strictly matching original premium headers
            headerKeys.forEach(key => {
                const staticItems = menu[key];
                const staticNames = staticItems.map((item: any) =>
                    (this.isComplexItem(item) ? item.name : item).toLowerCase().trim()
                );

                const matchingProducts = dbProducts.filter(p => {
                    const pName = (p.name || '').toLowerCase().trim();
                    // Flexible match: Exact or partial
                    return staticNames.some((sn: string) => sn === pName || sn.includes(pName) || pName.includes(sn));
                });

                if (matchingProducts.length > 0) {
                    columns.push({
                        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                        items: matchingProducts.map((p, pIndex) => {
                            capturedNames.add(p.name!.toLowerCase().trim());
                            let badge = this.getProductBadge(p, pIndex);
                            return { name: this.formatProductName(p.name!), badge: badge };
                        })
                    });
                }
            });

            // 2. Distribute remaining products (like Nikita) across existing columns
            const remainingProducts = dbProducts.filter(p => !capturedNames.has((p.name || '').toLowerCase().trim()));
            if (remainingProducts.length > 0 && columns.length > 0) {
                remainingProducts.forEach((p, index) => {
                    const targetCol = columns[index % columns.length];
                    targetCol.items.push({
                        name: this.formatProductName(p.name!),
                        badge: this.getProductBadge(p, index)
                    });
                });
            }

            return columns;
        }

        return [];
    }

    private getProductBadge(p: any, index: number): string | null {
        // Priority 1: High Discount (Always highlight if >= 20%)
        const discountVal = p.discountPercent || (p.discount ? parseInt(p.discount) : 0);
        if (discountVal > 0) return `${discountVal}% OFF`;

        // Priority 2: Category Promotion (e.g. Indoor Jungle, BOGO)
        const ruleCode = p.category && CATEGORY_TO_OFFER[p.category];
        const rule = ruleCode ? OFFER_RULES.find(r => r.code === ruleCode) : null;

        // We show category offers only for the first 3 items unless it's a manual tag
        if (rule && (index < 3 || (p.tags && p.tags.includes(rule.code)))) {
            return rule.shortBenefit;
        }

        // Priority 3: Manual Promo Tags (not the category one)
        if (p.tags) {
            const manualRule = OFFER_RULES.find(r => p.tags.includes(r.code) && r.code !== ruleCode);
            if (manualRule) return manualRule.shortBenefit;
        }

        // Priority 4: 'New' arrival
        if (p.createdAt) {
            const createdDate = new Date(p.createdAt);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) return 'NEW';
        }
        return null;
    }

    isOfferBadge(badge: string | null): boolean {
        if (!badge) return false;
        const b = badge.toUpperCase();
        return b.includes('OFF') || b.includes('FREE') || b.includes('BOGO') || b.includes('GIFT');
    }

    private formatProductName(name: string): string {
        if (!name) return '';
        // Smart Formatting: Keep abbreviations like XL or II in caps
        return name.split(' ').map(word => {
            const up = word.toUpperCase();
            if (up === 'XL' || up === 'II' || up === 'III') return up;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }

    showMenu(category: string) {
        // Toggle the menu if it's already open for this category
        if (this.activeCategory === category) {
            this.activeCategory = null;
        } else {
            this.activeCategory = category;
        }
    }

    hideMenu() {
        this.activeCategory = null;
    }

    navigateToCategory(category: string, event: Event) {
        this.hideMenu();
    }

    navigateToItem(category: string, item: any, event: Event) {
        this.hideMenu();
    }

    hasMenu(category: string): boolean {
        return !!this.menus[category];
    }

    isComplexItem(item: any): boolean {
        return typeof item === 'object' && item !== null && 'name' in item;
    }

    getItemLink(category: string, item: any, columnTitle?: string): string {
        const itemName = this.isComplexItem(item) ? item.name : item;

        const directToProductCategories = ['Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Accessories'];
        if (directToProductCategories.includes(category)) {
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        if (category === 'Seeds') {
            const seedCategoryTitles = ['Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds', 'Flower Seeds', 'Microgreen Seeds'];
            if (seedCategoryTitles.includes(itemName)) {
                return `/products/${this.productService.createSlug(itemName)}`;
            }
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        const productCategories = ['Flowering Plants', 'Air Purifying', 'Bestsellers', 'New Arrivals'];
        if (productCategories.includes(itemName)) {
            return `/products/${this.productService.createSlug(itemName)}`;
        }

        const gardeningCategories = ['Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
        if (gardeningCategories.includes(category)) {
            const toolCats = ['Hand Tools', 'Cutting Tools', 'Digging Tools', 'Power Tools'];
            if (toolCats.includes(itemName)) {
                return `/products/${this.productService.createSlug(itemName)}`;
            }
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        const suffix = ['Seeds', 'Accessories', 'Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'].includes(category) ? '' : ' Plants';
        return `/products/${this.productService.createSlug(category + suffix)}`;
    }

    getCategoryLink(category: string): string {
        if (category === 'About Us') return '/about-us';
        if (category === 'Contact Us') return '/contact-us';
        if (category === "FAQ's") return '/faq';

        const gardeningCategories = ['Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
        if (gardeningCategories.includes(category)) {
            return `/products/${this.productService.createSlug(category)}`;
        }

        const directCategories = ['Indoor', 'Outdoor', 'Flowering', 'Gardening'];
        if (directCategories.includes(category)) {
            return `/products/${this.productService.createSlug(category + ' Plants')}`;
        }

        const noSuffixCategories = ['Seeds', 'Accessories'];
        if (noSuffixCategories.includes(category)) {
            return `/products/${this.productService.createSlug(category)}`;
        }

        return `/products/${this.productService.createSlug(category)}`;
    }
}
