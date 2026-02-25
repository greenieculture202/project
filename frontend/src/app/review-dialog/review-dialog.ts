import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-dialog.html',
  styleUrl: './review-dialog.css'
})
export class ReviewDialogComponent {
  rating = 0;
  description = '';
  @Output() submitReview = new EventEmitter<{ rating: number, description: string }>();
  @Output() close = new EventEmitter<void>();

  setRating(r: number) {
    this.rating = r;
  }

  submit() {
    if (this.rating === 0) {
      alert('Please select a rating');
      return;
    }
    this.submitReview.emit({ rating: this.rating, description: this.description });
  }
}
