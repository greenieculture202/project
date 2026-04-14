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
import { InquiryService } from '../services/inquiry.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

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
        ReviewsComponent,
        FormsModule
    ],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
    private faqService = inject(FaqService);
    private inquiryService = inject(InquiryService);
    private authService = inject(AuthService);

    openIndex = signal<number | null>(null);
    previewFaqs: Faq[] = [];

    // User FAQ Submission
    userQuestion = '';
    isSubmitting = signal(false);
    showSuccessModal = signal(false);
    showSubmissionModal = signal(false);

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

    submitUserFaq() {
        if (!this.userQuestion.trim() || this.isSubmitting()) return;

        this.isSubmitting.set(true);

        const inquiryData = {
            name: this.authService.currentUserValue?.fullName || 'Guest User',
            email: this.authService.currentUserValue?.email || 'guest@example.com',
            subject: 'User-Submitted FAQ (Home)',
            message: this.userQuestion,
            userId: this.authService.currentUserId || null
        };

        this.inquiryService.submitInquiry(inquiryData).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.showSuccessModal.set(true);
                this.userQuestion = '';
            },
            error: (err: any) => {
                console.error('Failed to submit FAQ suggestion:', err);
                this.isSubmitting.set(false);
                alert('Connection sprouted a leak! Please try again later.');
            }
        });
    }

    closeModal() {
        this.showSuccessModal.set(false);
    }
}
