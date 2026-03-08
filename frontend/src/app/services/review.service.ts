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
                let dbReviews = Array.isArray(data) ? data : [];
                const userName = sessionStorage.getItem('user_name');

                if (userName && dbReviews.length > 0) {
                    dbReviews = dbReviews.map((r: any) => {
                        if (r.userName === 'Guest User' || !r.userName || r.userName === 'null' || r.userName === 'undefined') {
                            return { ...r, userName: userName };
                        }
                        return r;
                    });
                }

                // --- RESTORE LOCAL STORAGE REVIEWS ---
                const localStr = localStorage.getItem('greenie_reviews');
                if (localStr) {
                    try {
                        const localReviews: Review[] = JSON.parse(localStr);
                        // Filter out default stubs to prevent spamming DB 
                        const actualLocalReviews = localReviews.filter(r => r.userName !== 'Rahul Sharma' && r.userName !== 'Anjali Gupta');

                        // Find local reviews NOT yet in the DB (basic deduplication by description or exact match)
                        const newLocalReviews = actualLocalReviews.filter(localRev =>
                            !dbReviews.some((dbRev: any) => dbRev.description === localRev.description && dbRev.rating === localRev.rating)
                        );

                        if (newLocalReviews.length > 0) {
                            newLocalReviews.forEach(rev => {
                                if (userName && (rev.userName === 'Guest User' || !rev.userName || rev.userName === 'null')) {
                                    rev.userName = userName;
                                }
                                this.addReview(rev); // Save to DB
                            });
                            dbReviews = [...newLocalReviews, ...dbReviews];
                        }
                    } catch (e) {
                        console.error("Local storage parsing error", e);
                    }
                }

                // If STILL totally empty (no local, no DB), supply the defaults 
                if (dbReviews.length === 0) {
                    dbReviews = [
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

                this.reviewsSignal.set(dbReviews);
            })
            .catch(err => console.error("Could not fetch reviews from backend", err));

        // Return localStorage immediately so UI doesn't flash empty while fetching
        const fallbackStr = localStorage.getItem('greenie_reviews');
        if (fallbackStr) {
            try { return JSON.parse(fallbackStr); } catch (e) { }
        }
        return [];
    }
}
