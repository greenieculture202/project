import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews';

export interface FaqItem {
    question: string;
    answer: string;
    category: string;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, RouterLink, ReviewsComponent],
    templateUrl: './faq.html',
    styleUrl: './faq.css'
})
export class FaqComponent {
    openIndex = signal<number | null>(null);

    previewFaqs: FaqItem[] = [
        {
            category: 'Orders',
            question: 'How do I track my order?',
            answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard under "My Orders".'
        },
        {
            category: 'Payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery. All transactions are 100% secure.'
        },
        {
            category: 'Delivery',
            question: 'How long does delivery take?',
            answer: 'We deliver within 3–7 business days depending on your location. Metro cities usually receive orders within 2–3 days.'
        },
        {
            category: 'Plants',
            question: 'Are the plants safe for pets?',
            answer: 'Some plants are pet-friendly and some are not. Check the individual product page for a "Pet Safe" badge. Commonly safe plants include Spider Plant, Boston Fern, and Areca Palm.'
        },
        {
            category: 'Returns',
            question: 'What is your return policy?',
            answer: 'We have a 7-day return/replacement policy. If the plant arrives damaged or dead, simply send us a photo within 7 days and we will send a free replacement.'
        },
        {
            category: 'Orders',
            question: 'Can I cancel my order after placing it?',
            answer: 'Orders can be cancelled within 2 hours of placement. After that, the order is prepared for shipping and cannot be cancelled. Please contact our support team immediately.'
        }
    ];

    toggle(index: number) {
        this.openIndex.set(this.openIndex() === index ? null : index);
    }
}
