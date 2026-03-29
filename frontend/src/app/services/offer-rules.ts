export interface OfferBenefit {
    code: string;
    name: string;
    benefit: string;
    shortBenefit: string;
    discount?: number;
    freeProduct?: any;
    minQty: number;
    category?: string;
    image?: string;
}

export const OFFER_RULES: OfferBenefit[] = [
    {
        code: 'G-BOGO-6-SECTION',
        name: 'BOGO XL Plants',
        benefit: 'Buy 2 XL Plants, Get 1 Medium Plant FREE',
        shortBenefit: 'Buy 2 Get 1 FREE',
        minQty: 2,
        category: 'XL Plants',
        image: 'https://images.unsplash.com/photo-1597072634124-6a60774ec894?auto=format&fit=crop&w=400&q=80',
        freeProduct: { 
            name: 'Gift: Bonus Medium Plant', 
            quantity: 1, 
            price: 0, 
            image: 'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=200&q=80' 
        }
    },
    {
        code: 'G-INDOOR-6-SEC',
        name: 'Indoor Jungle',
        benefit: 'Buy 2 Indoor Plants, Get 1 Ceramic Pot FREE',
        shortBenefit: 'FREE Ceramic Pot',
        minQty: 2,
        category: 'Indoor Plants',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=400&q=80',
        freeProduct: { 
            name: 'Gift: Premium Ceramic Pot', 
            quantity: 1, 
            price: 0, 
            image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=200&q=80' 
        }
    },
    {
        code: 'G-GARDEN-6-SEC',
        name: 'Garden Essentials',
        benefit: 'Buy 2+, Get Flat 40% Instant Discount',
        shortBenefit: '40% OFF',
        minQty: 2,
        category: 'Gardening Tools',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
        discount: 0.40
    },
    {
        code: 'G-FLOWER-6-SEC',
        name: 'Flowering Bonanza',
        benefit: 'Buy 2+, Get Free Professional Fertilizer Pack',
        shortBenefit: 'FREE Fertilizer Pack',
        minQty: 2,
        category: 'Flowering Plants',
        image: 'https://images.unsplash.com/photo-1596724898730-6644f774317f?auto=format&fit=crop&w=400&q=80',
        freeProduct: { 
            name: 'Gift: Organic Fertilizer (1kg)', 
            quantity: 1, 
            price: 0, 
            image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=200&q=80' 
        }
    }
];

export const CATEGORY_TO_OFFER: { [key: string]: string } = {
    'XL Plants': 'G-BOGO-6-SECTION',
    'Indoor Plants': 'G-INDOOR-6-SEC',
    'Gardening Tools': 'G-GARDEN-6-SEC',
    'Flowering Plants': 'G-FLOWER-6-SEC'
};
