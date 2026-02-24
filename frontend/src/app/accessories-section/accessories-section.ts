import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accessories-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accessories-section.html',
  styleUrl: './accessories-section.css',
})
export class AccessoriesSection {
  categories = [
    {
      id: 'pots-planters',
      name: 'Designer Pots',
      subtitle: 'Artisan crafted vessels',
      description: 'Elevate your plants with our hand-picked collection of ceramic and metal planters.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
      link: '/products/accessories',
      proTip: 'Ensure your pot has drainage holes to prevent root rot.',
      themeColor: 'rgba(45, 140, 111, 0.1)'
    },
    {
      id: 'gardening-tools',
      name: 'Precision Tools',
      subtitle: 'Forged for durability',
      description: 'Professional grade tools that make gardening effortless and enjoyable.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
      link: '/products/gardening-tools',
      proTip: 'Clean tools after every use to prevent the spread of plant diseases.',
      themeColor: 'rgba(100, 116, 139, 0.1)'
    },
    {
      id: 'watering',
      name: 'Smart Watering',
      subtitle: 'Hydration made simple',
      description: 'Elegant watering cans and efficient irrigation systems for every plant type.',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      link: '/products/accessories',
      proTip: 'Overwatering kills more plants than underwatering. Feel the soil first!',
      themeColor: 'rgba(14, 165, 233, 0.1)'
    },
    {
      id: 'soil-media',
      name: 'Premium Media',
      subtitle: 'The foundation of life',
      description: 'Rich, nutrient-dense soil mixes tailored for indoor and outdoor growth.',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
      link: '/products/soil-growing-media',
      proTip: 'Refresh the top inch of soil every spring to replenish nutrients.',
      themeColor: 'rgba(120, 113, 108, 0.1)'
    },
    {
      id: 'decor',
      name: 'Botanical Decor',
      subtitle: 'Style your sanctuary',
      description: 'From stands to lights, everything you need to complete your green oasis.',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
      link: '/products/accessories',
      proTip: 'Group plants of different heights to create a more natural lush look.',
      themeColor: 'rgba(234, 179, 8, 0.1)'
    }
  ];
}


