import { Component, signal, OnInit } from '@angular/core';
import { InteractiveHeroComponent } from '../interactive-hero/interactive-hero';
import { ProductTabsComponent } from '../product-tabs/product-tabs';
import { OffersSliderComponent } from '../offers-slider/offers-slider';
import { SeedCategoriesComponent } from '../seed-categories/seed-categories';
import { PlacementsComponent } from '../placements/placements';
import { AccessoriesSection } from '../accessories-section/accessories-section';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';

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
export class HomeComponent {
    openIndex = signal<number | null>(null);

    previewFaqs = [
        { category: 'Orders', question: 'How do I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard under "My Orders".' },
        { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery. All transactions are 100% secure.' },
        { category: 'Delivery', question: 'How long does delivery take?', answer: 'We deliver within 3–7 business days. Metro cities usually receive orders within 2–3 days.' },
        { category: 'Plants', question: 'Are the plants safe for pets?', answer: 'Check the individual product page for a "Pet Safe" badge. Spider Plant, Boston Fern, and Areca Palm are commonly safe for pets.' },
        { category: 'Returns', question: 'What is your return policy?', answer: 'We have a 7-day replacement policy. If the plant arrives damaged, send us a photo within 7 days and we will send a free replacement.' },
        { category: 'Orders', question: 'Can I cancel my order after placing it?', answer: 'Orders can be cancelled within 2 hours of placement. After that the order is prepared for shipping. Please contact our support team immediately.' }
    ];

    toggle(i: number) {
        this.openIndex.set(this.openIndex() === i ? null : i);
    }
}
