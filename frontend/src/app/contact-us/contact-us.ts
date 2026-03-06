import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InquiryService } from '../services/inquiry.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-contact-us',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './contact-us.html',
    styleUrls: ['./contact-us.css']
})
export class ContactUsComponent {
    showSuccessModal = false;
    isSubmitting = false;

    contactData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    constructor(
        private inquiryService: InquiryService,
        private authService: AuthService
    ) { }

    onSubmit() {
        this.isSubmitting = true;
        const payload = {
            ...this.contactData,
            userId: this.authService.currentUserId
        };

        this.inquiryService.submitInquiry(payload).subscribe({
            next: (res) => {
                console.log('Inquiry submitted:', res);
                this.showSuccessModal = true;
                this.isSubmitting = false;
                // Reset form
                this.contactData = {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                };
            },
            error: (err) => {
                console.error('Submission error:', err);
                alert('Failed to send message. Please try again.');
                this.isSubmitting = false;
            }
        });
    }

    closeModal() {
        this.showSuccessModal = false;
    }
}
