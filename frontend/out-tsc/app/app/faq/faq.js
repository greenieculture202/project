import { __decorate } from "tslib";
import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';
import { FaqService } from '../services/faq.service';
let FaqComponent = class FaqComponent {
    constructor() {
        this.faqService = inject(FaqService);
        this.openKey = signal(null); // Use string key for groups
        this.faqs = [];
        this.isLoading = true;
        this.selectedCategory = signal('All');
        this.categories = ['Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];
        this.categoryIcons = {
            'Orders': 'fas fa-box-open',
            'Payment': 'fas fa-credit-card',
            'Delivery': 'fas fa-truck',
            'Plants': 'fas fa-leaf',
            'Returns': 'fas fa-undo',
            'Account': 'fas fa-user-circle'
        };
        this.categoryMetadata = computed(() => {
            return this.categories.map(cat => ({
                name: cat,
                icon: this.categoryIcons[cat] || 'fas fa-question-circle',
                count: this.faqs.filter(f => f.category === cat).length
            }));
        });
        this.categoryGroups = computed(() => {
            return this.categoryMetadata().filter(m => m.count > 0).map(m => ({
                name: m.name,
                icon: m.icon,
                faqs: this.faqs.filter(f => f.category === m.name)
            }));
        });
    }
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
        if (this.selectedCategory() === 'All')
            return this.faqs;
        return this.faqs.filter(f => f.category === this.selectedCategory());
    }
    setCategory(cat) {
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
    toggle(key) {
        this.openKey.set(this.openKey() === key ? null : key);
    }
};
FaqComponent = __decorate([
    Component({
        selector: 'app-faq',
        standalone: true,
        imports: [CommonModule, RouterLink, ReviewsComponent],
        templateUrl: './faq.html',
        styleUrl: './faq.css'
    })
], FaqComponent);
export { FaqComponent };
//# sourceMappingURL=faq.js.map