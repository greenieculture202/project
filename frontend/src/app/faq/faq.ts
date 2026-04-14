import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FaqService, Faq } from '../services/faq.service';
import { InquiryService } from '../services/inquiry.service';
import { AuthService } from '../services/auth.service';

interface CategoryGroup {
    name: string;
    icon: string;
    faqs: Faq[];
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './faq.html',
    styleUrl: './faq.css'
})
export class FaqComponent implements OnInit {
    private faqService = inject(FaqService);
    private inquiryService = inject(InquiryService);
    private authService = inject(AuthService);

    openKey = signal<string | null>(null); // Use string key for groups
    faqs: Faq[] = [];
    isLoading = true;
    selectedCategory = signal<string>('All');
    categories: string[] = ['Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];

    // User FAQ Submission
    userQuestion = '';
    isSubmitting = signal(false);
    showSuccessModal = signal(false);
    showSubmissionModal = signal(false);

    categoryIcons: Record<string, string> = {
        'Orders': 'fas fa-box-open',
        'Payment': 'fas fa-credit-card',
        'Delivery': 'fas fa-truck',
        'Plants': 'fas fa-leaf',
        'Returns': 'fas fa-undo',
        'Account': 'fas fa-user-circle',
        'Exchange': 'fas fa-arrows-rotate'
    };

    ngOnInit() {
        this.loadFaqs();
    }

    loadFaqs() {
        this.isLoading = true;
        this.faqService.getFaqs().subscribe({
            next: (data: Faq[]) => {
                this.faqs = data;
                
                // Dynamically update categories from data
                const uniqueCategories = [...new Set(data.map(f => f.category))].filter(Boolean) as string[];
                const mergedSub = [...new Set([...this.categories, ...uniqueCategories])];
                this.categories = mergedSub;

                this.isLoading = false;
            },
            error: (err: any) => {
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
        return this.categoryMetadata().filter((m: any) => m.count > 0).map((m: any) => ({
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

    submitUserFaq() {
        if (!this.userQuestion.trim() || this.isSubmitting()) return;

        this.isSubmitting.set(true);

        const inquiryData = {
            name: this.authService.currentUserValue?.fullName || 'Guest User',
            email: this.authService.currentUserValue?.email || 'guest@example.com',
            subject: 'User-Submitted FAQ',
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
