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
    visionSections: AboutSection[] = [];
    missionSections: AboutSection[] = [];
    accoladeSections: AboutSection[] = [];
    statSections: AboutSection[] = [];
    quoteSections: AboutSection[] = [];
    founderSection: AboutSection | null = null;

    ngOnInit() {
        this.loadSections();
    }

    private initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => observer.observe(el));
    }

    loadSections() {
        this.aboutService.getAboutSections().subscribe({
            next: (data) => {
                console.log('[AboutUs] Raw data received:', data);
                if (!data) return;
                const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
                this.sections = sortedData;
                this.journeySections = sortedData.filter(s => s.type === 'journey');
                this.valueSections = sortedData.filter(s => s.type === 'value');
                this.visionSections = sortedData.filter(s => s.type === 'vision');
                this.missionSections = sortedData.filter(s => s.type === 'mission');
                this.accoladeSections = sortedData.filter(s => s.type === 'accolade');
                this.statSections = sortedData.filter(s => s.type === 'stat');
                this.quoteSections = sortedData.filter(s => s.type === 'quote');

                const founders = sortedData.filter(s => s.type === 'founder');
                this.founderSection = founders.length > 0 ? founders[founders.length - 1] : null;

                // Mark top sections for immediate visibility to prevent "blank" feeling
                this.sections.forEach((s, idx) => {
                    if (idx < 2) (s as any).isImmediate = true;
                });

                // Initialize animations after a short delay to ensure DOM is ready
                setTimeout(() => {
                    this.initScrollAnimations();
                    // Fallback: mark as ready after 1 second to ensure visibility
                    setTimeout(() => {
                        const container = document.querySelector('.fnp-about-container');
                        if (container) container.classList.add('ready');
                    }, 1000);
                }, 300);
            },
            error: (err) => {
                console.error('Error loading about sections:', err);
                const container = document.querySelector('.fnp-about-container');
                if (container) container.classList.add('ready');
                setTimeout(() => this.initScrollAnimations(), 300);
            }
        });
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
