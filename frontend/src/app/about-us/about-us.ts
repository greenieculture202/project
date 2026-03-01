import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AboutService, AboutSection } from '../services/about.service';

@Component({
    selector: 'app-about-us',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about-us.html',
    styleUrl: './about-us.css'
})
export class AboutUsComponent implements OnInit {
    private aboutService = inject(AboutService);
    private sanitizer = inject(DomSanitizer);

    isModalOpen = false;
    videoUrl: string = '/videos/ecohaven.mp4';

    sections: AboutSection[] = [];
    journeySections: AboutSection[] = [];
    valueSections: AboutSection[] = [];
    statSections: AboutSection[] = [];
    quoteSections: AboutSection[] = [];
    founderSection: AboutSection | null = null;

    ngOnInit() {
        this.loadSections();
    }

    loadSections() {
        this.aboutService.getAboutSections().subscribe({
            next: (data) => {
                this.sections = data;
                this.journeySections = data.filter(s => s.type === 'journey');
                this.valueSections = data.filter(s => s.type === 'value');
                this.statSections = data.filter(s => s.type === 'stat');
                this.quoteSections = data.filter(s => s.type === 'quote');
                this.founderSection = data.find(s => s.type === 'founder') || null;
            },
            error: (err) => console.error('Error loading about sections:', err)
        });
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
