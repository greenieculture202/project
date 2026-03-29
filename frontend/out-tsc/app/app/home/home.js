import { __decorate } from "tslib";
import { Component, signal, inject } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';
import { SeedCategoriesComponent } from '../seed-categories/seed-categories';
import { PlacementsComponent } from '../placements/placements';
import { AccessoriesSection } from '../accessories-section/accessories-section';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';
import { FaqService } from '../services/faq.service';
let HomeComponent = class HomeComponent {
    constructor() {
        this.faqService = inject(FaqService);
        this.openIndex = signal(null);
        this.previewFaqs = [];
    }
    ngOnInit() {
        this.loadFaqs();
    }
    loadFaqs() {
        this.faqService.getFaqs().subscribe({
            next: (data) => {
                // Show first 6 FAQs as preview
                this.previewFaqs = data.slice(0, 6);
            },
            error: (err) => console.error('Error loading home FAQs:', err)
        });
    }
    toggle(i) {
        this.openIndex.set(this.openIndex() === i ? null : i);
    }
};
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        standalone: true,
        imports: [
            InteractiveHeroComponent,
            ProductTabsComponent,
            OffersSliderComponent,
            SeedCategoriesComponent,
            PlacementsComponent,
            AccessoriesSection,
            CommonModule,
            RouterLink,
            ReviewsComponent
        ],
        templateUrl: './home.html',
        styleUrl: './home.css'
    })
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.js.map