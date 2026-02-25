import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { ReviewService } from '../services/review.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './footer.html',
    styleUrl: './footer.css'
})
export class FooterComponent {
    reviewService = inject(ReviewService);
    reviews = this.reviewService.reviews;
    currentYear = new Date().getFullYear();
}
