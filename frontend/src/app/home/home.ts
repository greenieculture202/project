import { Component } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';
import { SeedCategoriesComponent } from '../seed-categories/seed-categories';

@Component({
    selector: 'app-home',
    imports: [InteractiveHeroComponent, ProductTabsComponent, OffersSliderComponent, SeedCategoriesComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent { }
