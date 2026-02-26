import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewsComponent {
  reviewService = inject(ReviewService);
  reviews = this.reviewService.reviews;
}
