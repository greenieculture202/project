import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-about-us',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about-us.html',
    styleUrl: './about-us.css'
})
export class AboutUsComponent {
    private sanitizer = inject(DomSanitizer);

    isModalOpen = false;
    videoUrl: string = '/videos/ecohaven.mp4';

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
