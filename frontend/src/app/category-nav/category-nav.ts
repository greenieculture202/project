import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './category-nav.html',
    styleUrl: './category-nav.css'
})
export class CategoryNavComponent {
    categories = [
        'Indoor', 'Outdoor', 'Flowering', 'Gardening', 'Seeds', 'Accessories', 'Flowers',
        'Cakes', 'Personalised', 'Plants', 'Balloon Decor', 'Chocolates',
        'Luxe', 'Hampers', 'Lifestyle', 'International'
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
            // Note: No sendTo as per user request
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
                'Philodendron', 'Fiddle Leaf Fig', 'English Ivy', 'Croton', 'Parlor Palm'
            ],
            image: 'https://images.unsplash.com/photo-1416870262648-2513dfeffabd?auto=format&fit=crop&w=360&q=80',
            imageText: 'Gardening Essentials'
        },
        'Seeds': {
            vegetables: [
                'Tomato', 'Potato', 'Onion', 'Garlic', 'Carrot',
                'Cabbage', 'Cauliflower', 'Spinach', 'Brinjal (Eggplant)', 'Lady Finger (Okra)',
                'Peas', 'Capsicum', 'Radish', 'Beetroot', 'Bottle Gourd',
                'Bitter Gourd', 'Pumpkin', 'Cucumber', 'Turnip', 'Green Chilli'
            ],
            fruits: [
                'Mango', 'Apple', 'Banana', 'Orange', 'Guava',
                'Papaya', 'Pomegranate', 'Grapes', 'Pineapple', 'Watermelon',
                'Muskmelon', 'Strawberry', 'Cherry', 'Litchi', 'Coconut',
                'Pear', 'Peach', 'Plum', 'Kiwi', 'Fig'
            ],
            image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=360&q=80',
            imageText: 'Premium Seeds'
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
        }
    };

    activeCategory: string | null = null;

    getMenuColumns(cat: string): { title: string, items: any[] }[] {
        const menu = this.menus[cat];
        if (!menu) return [];

        const columns: { title: string, items: any[] }[] = [];

        if (cat === 'Seeds') {
            if (menu.vegetables) {
                columns.push({ title: 'Vegetable', items: menu.vegetables.slice(0, 10) });
                columns.push({ title: 'Vegetable', items: menu.vegetables.slice(10, 20) });
            }
            if (menu.fruits) {
                columns.push({ title: 'Fruit', items: menu.fruits.slice(0, 10) });
                columns.push({ title: 'Fruit', items: menu.fruits.slice(10, 20) });
            }
        } else if (cat === 'Accessories') {
            if (menu.potsAndPlanters) columns.push({ title: 'Pots & Planters', items: menu.potsAndPlanters });
            if (menu.wateringEquipment) columns.push({ title: 'Watering Equipment', items: menu.wateringEquipment });
            if (menu.plantSupport) columns.push({ title: 'Support & Protection', items: menu.plantSupport });
            if (menu.lightingEquipment) columns.push({ title: 'Lighting Equipment', items: menu.lightingEquipment });
            if (menu.decorativeAccessories) columns.push({ title: 'Decorative & Display', items: menu.decorativeAccessories });
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

    hasMenu(category: string): boolean {
        return !!this.menus[category];
    }

    isComplexItem(item: any): boolean {
        return typeof item === 'object' && item !== null && 'name' in item;
    }
}
