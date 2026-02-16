import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-seed-categories',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './seed-categories.html',
    styleUrls: ['./seed-categories.css']
})
export class SeedCategoriesComponent {
    categories = [
        {
            name: 'Vegetable Seeds',
            image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop',
            route: '/products/vegetable-seeds'
        },
        {
            name: 'Fruit Seeds',
            image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&h=400&fit=crop',
            route: '/products/fruit-seeds'
        },
        {
            name: 'Herb Seeds',
            image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop',
            route: '/products/herb-seeds'
        },
        {
            name: 'Seeds Kit',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop',
            route: '/products/seeds-kit'
        },
        {
            name: 'Flower Seeds',
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
            route: '/products/flower-seeds'
        },
        {
            name: 'Microgreen Seeds',
            image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400&h=400&fit=crop',
            route: '/products/microgreen-seeds'
        }
    ];
}
