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
      image: 'images/designer-pots.png',
      link: '/products/accessories',
      proTip: 'Ensure your pot has drainage holes to prevent root rot.',
      themeColor: 'rgba(45, 140, 111, 0.1)'
    },
    {
      id: 'gardening-tools',
      name: 'Precision Tools',
      subtitle: 'Forged for durability',
      description: 'Professional grade tools that make gardening effortless and enjoyable.',
      image: 'images/precision-tools.png',
      link: '/products/gardening-tools',
      proTip: 'Clean tools after every use to prevent the spread of plant diseases.',
      themeColor: 'rgba(100, 116, 139, 0.1)'
    },
    {
      id: 'seeds',
      name: 'Premium Seeds',
      subtitle: 'The beginning of life',
      description: 'Highly curated organic and heirloom seeds for a vibrant and healthy garden.',
      image: 'images/premium-seeds.png',
      link: '/products/seeds',
      proTip: 'Plant seeds at a depth of 2-3 times their width for optimal germination.',
      themeColor: 'rgba(34, 197, 94, 0.1)'
    },
    {
      id: 'soil-media',
      name: 'Premium Media',
      subtitle: 'The foundation of life',
      description: 'Rich, nutrient-dense soil mixes tailored for indoor and outdoor growth.',
      image: 'images/premium-media.png',
      link: '/products/soil-growing-media',
      proTip: 'Refresh the top inch of soil every spring to replenish nutrients.',
      themeColor: 'rgba(120, 113, 108, 0.1)'
    },
    {
      id: 'decor',
      name: 'Botanical Decor',
      subtitle: 'Style your sanctuary',
      description: 'From stands to lights, everything you need to complete your green oasis.',
      image: 'images/botanical-decor.png',
      link: '/products/accessories',
      proTip: 'Group plants of different heights to create a more natural lush look.',
      themeColor: 'rgba(234, 179, 8, 0.1)'
    }
  ];
}


