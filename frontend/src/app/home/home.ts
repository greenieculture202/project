import { Component, signal, OnInit, inject } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';
import { SeedCategoriesComponent } from '../seed-categories/seed-categories';
import { PlacementsComponent } from '../placements/placements';
import { AccessoriesSection } from '../accessories-section/accessories-section';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';
import { FaqService, Faq } from '../services/faq.service';

@Component({
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
export class HomeComponent implements OnInit {
    private faqService = inject(FaqService);
    openIndex = signal<number | null>(null);
    previewFaqs: Faq[] = [];

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

    toggle(i: number) {
        this.openIndex.set(this.openIndex() === i ? null : i);
    }
}
