import { Injectable, signal } from '@angular/core';

export interface Review {
    userName: string;
    rating: number;
    description: string;
    date: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsSignal = signal<Review[]>(this.loadReviews());

    get reviews() {
        return this.reviewsSignal;
    }

    addReview(review: Review) {
        const current = this.reviewsSignal();
        const updated = [review, ...current];
        this.reviewsSignal.set(updated);
        localStorage.setItem('greenie_reviews', JSON.stringify(updated));
    }

    private loadReviews(): Review[] {
        const saved = localStorage.getItem('greenie_reviews');
        if (saved) {
            return JSON.parse(saved);
        }
        // Default reviews
        return [
            {
                userName: 'Rahul Sharma',
                rating: 5,
                description: 'Amazing experience! The plants arrived in great condition.',
                date: '25 Feb 2026'
            },
            {
                userName: 'Anjali Gupta',
                rating: 4,
                description: 'Very fast delivery and good packaging.',
                date: '24 Feb 2026'
            }
        ];
    }
}
