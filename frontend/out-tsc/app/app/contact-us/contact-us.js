import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
let ContactUsComponent = class ContactUsComponent {
    constructor(inquiryService, authService) {
        this.inquiryService = inquiryService;
        this.authService = authService;
        this.showSuccessModal = false;
        this.isSubmitting = false;
        this.contactData = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
    }
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
};
ContactUsComponent = __decorate([
    Component({
        selector: 'app-contact-us',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterLink],
        templateUrl: './contact-us.html',
        styleUrls: ['./contact-us.css']
    })
], ContactUsComponent);
export { ContactUsComponent };
//# sourceMappingURL=contact-us.js.map