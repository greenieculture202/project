import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contact-us',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './contact-us.html',
    styleUrls: ['./contact-us.css']
})
export class ContactUsComponent {
    showSuccessModal = false;

    contactData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    onSubmit() {
        // In a real app, this would call a service to send the message
        console.log('Contact form submitted:', this.contactData);
        this.showSuccessModal = true;

        // Reset form
        this.contactData = {
            name: '',
            email: '',
            subject: '',
            message: ''
        };
    }

    closeModal() {
        this.showSuccessModal = false;
    }
}
