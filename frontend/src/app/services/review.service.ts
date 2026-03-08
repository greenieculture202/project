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
        // Optimistically update the UI
        const current = this.reviewsSignal();
        const updated = [review, ...current];
        this.reviewsSignal.set(updated);

        // Save to Database
        fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        })
            .then(res => res.json())
            .then(savedReview => {
                console.log('Review saved to DB:', savedReview);
            })
            .catch(err => {
                console.error('Failed to save review to DB:', err);
                // Revert on failure (optional, but good UX practice)
                this.reviewsSignal.set(current);
            });
    }

    private loadReviews() {
        fetch('http://localhost:5000/api/reviews')
            .then(res => res.json())
            .then(data => {
                let parsedReviews = data;
                const userName = sessionStorage.getItem('user_name');

                // If user is logged in, retroactively claim "Guest User" reviews where logic allows,
                // however for a real DB we usually update the DB instead. For now we will just show it correctly on frontend.
                if (userName && Array.isArray(parsedReviews)) {
                    parsedReviews = parsedReviews.map((r: any) => {
                        if (r.userName === 'Guest User' || !r.userName || r.userName === 'null' || r.userName === 'undefined') {
                            return { ...r, userName: userName };
                        }
                        return r;
                    });
                }

                // If DB is totally empty, supply the defaults 
                if (!Array.isArray(parsedReviews) || parsedReviews.length === 0) {
                    parsedReviews = [
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

                this.reviewsSignal.set(parsedReviews);
            })
            .catch(err => console.error("Could not fetch reviews from backend", err));

        return []; // Initial empty state before load completes
    }
}
