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
            image: '/images/seed_veg.png',
            route: '/products/vegetable-seeds'
        },
        {
            name: 'Fruit Seeds',
            image: '/images/seed_fruit.png',
            route: '/products/fruit-seeds'
        },
        {
            name: 'Herb Seeds',
            image: '/images/seed_herb.png',
            route: '/products/herb-seeds'
        },
        {
            name: 'Seeds Kit',
            image: '/images/seed_kit.png',
            route: '/products/seeds-kit'
        },
        {
            name: 'Flower Seeds',
            image: '/images/seed_flower.png',
            route: '/products/flower-seeds'
        },
        {
            name: 'Microgreen Seeds',
            image: '/images/seed_micro.png',
            route: '/products/microgreen-seeds'
        }
    ];
}
