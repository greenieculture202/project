import { __decorate } from "tslib";
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../services/review.service';
let ReviewsComponent = class ReviewsComponent {
    constructor() {
        this.reviewService = inject(ReviewService);
        this.reviews = this.reviewService.reviews;
        this.ratingStats = computed(() => {
            const allReviews = this.reviews();
            const total = allReviews.length;
            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let sum = 0;
            allReviews.forEach(r => {
                sum += r.rating;
                const rounded = Math.round(r.rating);
                if (counts[rounded] !== undefined) {
                    counts[rounded]++;
                }
                else if (rounded > 5) {
                    counts[5]++;
                }
                else if (rounded < 1) {
                    counts[1]++;
                }
            });
            const average = total > 0 ? (sum / total).toFixed(1) : '0.0';
            // As per user request: "agar 100 user ka review 5 star de tabhi ye line puri fill honi chahiye".
            // Treat the maximum width as 100, so 1 vote = 1% fill up to 100.
            // If the site gets > 100 reviews, the bar scales to the actual total instead to not overflow.
            const fillScale = Math.max(total, 100);
            return {
                total,
                average,
                breakdown: [
                    { stars: 5, count: counts[5], pct: (counts[5] / fillScale) * 100 },
                    { stars: 4, count: counts[4], pct: (counts[4] / fillScale) * 100 },
                    { stars: 3, count: counts[3], pct: (counts[3] / fillScale) * 100 },
                    { stars: 2, count: counts[2], pct: (counts[2] / fillScale) * 100 },
                    { stars: 1, count: counts[1], pct: (counts[1] / fillScale) * 100 }
                ]
            };
        });
    }
};
ReviewsComponent = __decorate([
    Component({
        selector: 'app-reviews',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './reviews.html',
        styleUrl: './reviews.css'
    })
], ReviewsComponent);
export { ReviewsComponent };
//# sourceMappingURL=reviews.js.map