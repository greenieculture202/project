import { Component } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';

@Component({
    selector: 'app-home',
    imports: [InteractiveHeroComponent, ProductTabsComponent, OffersSliderComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent { }
