import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-all-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-reviews.html',
  styleUrl: './all-reviews.css',
})
export class AllReviews {
  reviewService = inject(ReviewService);
  reviews = this.reviewService.reviews;

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
