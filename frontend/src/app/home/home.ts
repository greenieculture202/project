import { Component } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';
import { SeedCategoriesComponent } from '../seed-categories/seed-categories';
import { PlacementsComponent } from '../placements/placements';
import { AccessoriesSection } from '../accessories-section/accessories-section';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        InteractiveHeroComponent,
        ProductTabsComponent,
        OffersSliderComponent,
        SeedCategoriesComponent,
        PlacementsComponent,
        AccessoriesSection
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent { }
