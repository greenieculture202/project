import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-category-nav',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './category-nav.html',
    styleUrl: './category-nav.css'
})
export class CategoryNavComponent {
    private productService = inject(ProductService);
    private router = inject(Router);
    categories = [
        'Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Seeds', 'Accessories', 'Soil & Growing Media',
        'Fertilizers & Nutrients', 'Gardening Tools'
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
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=360&q=80',
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
            images: [
                { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=360&q=80', text: 'Outdoor Trees' },
                { url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=360&q=80', text: 'Garden Plants' }
            ]
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
            image: 'https://images.unsplash.com/photo-1512423924558-124e4d50937c?auto=format&fit=crop&w=360&q=80',
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
            image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=360&q=80',
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
            image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=360&q=80',
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
            image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=360&q=80',
            imageText: 'Garden Tools'
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
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=360&q=80',
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
            image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=360&q=80',
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
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=360&q=80',
            imageText: 'Essential Garden Tools'
        }
    };

    activeCategory: string | null = null;

    getMenuColumns(cat: string): { title: string, items: any[] }[] {
        const menu = this.menus[cat];
        if (!menu) return [];

        const columns: { title: string, items: any[] }[] = [];

        if (cat === 'Seeds') {
            if (menu.vegetableSeeds) columns.push({ title: 'Vegetable Seeds', items: menu.vegetableSeeds });
            if (menu.fruitSeeds) columns.push({ title: 'Fruit Seeds', items: menu.fruitSeeds });
            if (menu.herbSeeds) columns.push({ title: 'Herb Seeds', items: menu.herbSeeds });
            if (menu.flowerSeeds) columns.push({ title: 'Flower Seeds', items: menu.flowerSeeds });
            if (menu.microgreenSeeds) columns.push({ title: 'Microgreen Seeds', items: menu.microgreenSeeds });
        } else if (cat === 'Soil & Growing Media') {
            if (menu.soilTypes) columns.push({ title: 'Soil Types', items: menu.soilTypes });
            if (menu.organicAmendments) columns.push({ title: 'Organic Amendments', items: menu.organicAmendments });
            if (menu.growthMedia) columns.push({ title: 'Growth Media', items: menu.growthMedia });
        } else if (cat === 'Fertilizers & Nutrients') {
            if (menu.organicFertilizers) columns.push({ title: 'Organic Fertilizers', items: menu.organicFertilizers });
            if (menu.chemicalFertilizers) columns.push({ title: 'Chemical Fertilizers', items: menu.chemicalFertilizers });
            if (menu.plantBoosters) columns.push({ title: 'Plant Boosters', items: menu.plantBoosters });
        } else if (cat === 'Gardening Tools') {
            if (menu.handTools) columns.push({ title: 'Hand Tools', items: menu.handTools });
            if (menu.cuttingTools) columns.push({ title: 'Cutting Tools', items: menu.cuttingTools });
            if (menu.diggingTools) columns.push({ title: 'Digging Tools', items: menu.diggingTools });
            if (menu.powerTools) columns.push({ title: 'Power Tools', items: menu.powerTools });
        } else if (cat === 'Accessories') {
            if (menu.potsAndPlanters) columns.push({ title: 'Pots & Planters', items: menu.potsAndPlanters });
            if (menu.wateringEquipment) columns.push({ title: 'Watering Equipment', items: menu.wateringEquipment });
            if (menu.plantSupport) columns.push({ title: 'Support & Protection', items: menu.plantSupport });
            if (menu.lightingEquipment) columns.push({ title: 'Lighting Equipment', items: menu.lightingEquipment });
            if (menu.decorativeAccessories) columns.push({ title: 'Decorative & Display', items: menu.decorativeAccessories });
        } else if (cat === 'Gardening') {
            if (menu.outdoorBlooms) columns.push({ title: 'Outdoor Blooms', items: menu.outdoorBlooms });
            if (menu.homeGardenEssentials) columns.push({ title: 'Home Garden Essentials', items: menu.homeGardenEssentials });
            if (menu.foliageAndGreens) columns.push({ title: 'Foliage & Greens', items: menu.foliageAndGreens });
            if (menu.decorativeStyle) columns.push({ title: 'Decorative Style', items: menu.decorativeStyle });
        } else {
            if (menu.eliteGreens) columns.push({ title: 'Elite Greens', items: menu.eliteGreens });
            if (menu.perfectPlacements) columns.push({ title: 'Perfect Placements', items: menu.perfectPlacements });
            if (menu.plantsCollection) columns.push({ title: 'Collection', items: menu.plantsCollection });
            if (menu.plantersStyle) columns.push({ title: 'Style', items: menu.plantersStyle });
            if (menu.sendTo || menu.sendPlantsTo) columns.push({ title: 'Delivery To', items: menu.sendTo || menu.sendPlantsTo });
        }

        return columns;
    }

    showMenu(category: string) {
        this.activeCategory = category;
    }

    hideMenu() {
        this.activeCategory = null;
    }

    navigateToCategory(category: string, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const link = this.getCategoryLink(category);
        this.router.navigateByUrl(link);
        this.hideMenu();
    }

    navigateToItem(category: string, item: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const link = this.getItemLink(category, item);
        this.router.navigateByUrl(link);
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

        // For specific plant categories and accessories, navigate directly to individual product detail page
        const directToProductCategories = ['Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Accessories'];
        if (directToProductCategories.includes(category)) {
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        // For Seeds category items, navigate to individual product detail page
        // But for column titles (like "Vegetable Seeds"), navigate to category page
        if (category === 'Seeds') {
            // Column titles should go to category pages
            const seedCategoryTitles = ['Vegetable Seeds', 'Fruit Seeds', 'Herb Seeds', 'Flower Seeds', 'Microgreen Seeds'];
            if (seedCategoryTitles.includes(itemName)) {
                return `/products/${this.productService.createSlug(itemName)}`;
            }
            // Individual seed items go to product detail page directly using itemName
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        // For other categories, try to match with product categories
        const productCategories = ['Flowering Plants', 'Air Purifying', 'Bestsellers', 'New Arrivals'];
        if (productCategories.includes(itemName)) {
            return `/products/${this.productService.createSlug(itemName)}`;
        }

        // For new gardening categories, navigate to individual product detail pages
        const gardeningCategories = ['Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
        if (gardeningCategories.includes(category)) {
            // Individual items go to product detail page
            return `/product/${this.productService.createSlug(itemName)}`;
        }

        // Default: navigate to the parent category
        return `/products/${category} Plants`;
    }

    getCategoryLink(category: string): string {
        // For new gardening categories, navigate to category page
        const gardeningCategories = ['Soil & Growing Media', 'Fertilizers & Nutrients', 'Gardening Tools'];
        if (gardeningCategories.includes(category)) {
            return `/products/${this.productService.createSlug(category)}`;
        }

        // For other categories with products
        const directCategories = ['Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Seeds', 'Accessories'];
        if (directCategories.includes(category)) {
            return `/products/${this.productService.createSlug(category + ' Plants')}`;
        }

        // Default
        return `/products/${this.productService.createSlug(category)}`;
    }
}
