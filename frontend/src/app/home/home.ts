import { Component } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';

@Component({
    selector: 'app-home',
    imports: [InteractiveHeroComponent, ProductTabsComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent { }
