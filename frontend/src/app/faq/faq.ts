import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';
import { FaqService, Faq } from '../services/faq.service';

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, RouterLink, ReviewsComponent],
    templateUrl: './faq.html',
    styleUrl: './faq.css'
})
export class FaqComponent implements OnInit {
    private faqService = inject(FaqService);
    openIndex = signal<number | null>(null);
    faqs: Faq[] = [];
    isLoading = true;
    selectedCategory = signal<string>('All');
    categories: string[] = ['Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];

    ngOnInit() {
        this.loadFaqs();
    }

    loadFaqs() {
        this.isLoading = true;
        this.faqService.getFaqs().subscribe({
            next: (data) => {
                this.faqs = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading FAQs:', err);
                this.isLoading = false;
            }
        });
    }

    get filteredFaqs() {
        if (this.selectedCategory() === 'All') return this.faqs;
        return this.faqs.filter(f => f.category === this.selectedCategory());
    }

    setCategory(cat: string) {
        this.selectedCategory.set(cat);
        this.openIndex.set(null); // Reset open accordion on category change
    }

    toggle(index: number) {
        this.openIndex.set(this.openIndex() === index ? null : index);
    }
}
