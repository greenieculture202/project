import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from '../reviews/reviews';
import { FaqService, Faq } from '../services/faq.service';

interface CategoryGroup {
    name: string;
    icon: string;
    faqs: Faq[];
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, ReviewsComponent],
    templateUrl: './faq.html',
    styleUrl: './faq.css'
})
export class FaqComponent implements OnInit {
    private faqService = inject(FaqService);
    openKey = signal<string | null>(null); // Use string key for groups
    faqs: Faq[] = [];
    isLoading = true;
    selectedCategory = signal<string>('All');
    categories: string[] = ['Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];

    categoryIcons: Record<string, string> = {
        'Orders': 'fas fa-box-open',
        'Payment': 'fas fa-credit-card',
        'Delivery': 'fas fa-truck',
        'Plants': 'fas fa-leaf',
        'Returns': 'fas fa-undo',
        'Account': 'fas fa-user-circle'
    };

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

    categoryMetadata = computed(() => {
        return this.categories.map(cat => ({
            name: cat,
            icon: this.categoryIcons[cat] || 'fas fa-question-circle',
            count: this.faqs.filter(f => f.category === cat).length
        }));
    });

    categoryGroups = computed(() => {
        return this.categoryMetadata().filter(m => m.count > 0).map(m => ({
            name: m.name,
            icon: m.icon,
            faqs: this.faqs.filter(f => f.category === m.name)
        }));
    });

    get filteredFaqs() {
        if (this.selectedCategory() === 'All') return this.faqs;
        return this.faqs.filter(f => f.category === this.selectedCategory());
    }

    setCategory(cat: string) {
        this.selectedCategory.set(cat);
        this.openKey.set(null);

        // Scroll to list if not All
        if (cat !== 'All') {
            setTimeout(() => {
                const el = document.querySelector('.faq-list');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }, 100);
        }
    }

    toggle(key: string) {
        this.openKey.set(this.openKey() === key ? null : key);
    }
}
