import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../services/review.service';
let AllReviews = class AllReviews {
    constructor() {
        this.reviewService = inject(ReviewService);
        this.reviews = this.reviewService.reviews;
    }
    ngOnInit() {
        window.scrollTo(0, 0);
    }
};
AllReviews = __decorate([
    Component({
        selector: 'app-all-reviews',
        standalone: true,
        imports: [CommonModule, RouterLink],
        templateUrl: './all-reviews.html',
        styleUrl: './all-reviews.css',
    })
], AllReviews);
export { AllReviews };
//# sourceMappingURL=all-reviews.js.map