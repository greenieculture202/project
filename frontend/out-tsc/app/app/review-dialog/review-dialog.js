import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let ReviewDialogComponent = class ReviewDialogComponent {
    constructor() {
        this.rating = 0;
        this.description = '';
        this.submitReview = new EventEmitter();
        this.close = new EventEmitter();
    }
    setRating(r) {
        this.rating = r;
    }
    submit() {
        if (this.rating === 0) {
            alert('Please select a rating');
            return;
        }
        this.submitReview.emit({ rating: this.rating, description: this.description });
    }
};
__decorate([
    Output()
], ReviewDialogComponent.prototype, "submitReview", void 0);
__decorate([
    Output()
], ReviewDialogComponent.prototype, "close", void 0);
ReviewDialogComponent = __decorate([
    Component({
        selector: 'app-review-dialog',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './review-dialog.html',
        styleUrl: './review-dialog.css'
    })
], ReviewDialogComponent);
export { ReviewDialogComponent };
//# sourceMappingURL=review-dialog.js.map