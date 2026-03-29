import { __decorate, __param } from "tslib";
import { Component, PLATFORM_ID, Inject, inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
let InteractiveHeroComponent = class InteractiveHeroComponent {
    constructor(platformId) {
        this.platformId = platformId;
        this.sanitizer = inject(DomSanitizer);
        this.currentSlide = 0;
        // Modal related variables
        this.selectedVideo = null;
        this.selectedPlacementName = null;
        this.isModalOpen = false;
        // Images for the auto-slider (Orchid/Plant theme)
        this.heroImages = [
            'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', // Orchid/Pink pot
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', // Aloe/White pot
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80', // Succulent/Texture
            'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Money Plant/Pot
            'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80' // Potted Plant on Stand
        ];
        // Shapes corresponding to each image
        this.imageShapes = [
            'shape-rectangle', // Default
            'shape-circle',
            'shape-landscape',
            'shape-oval',
            'shape-square'
        ];
        // Preview data for the placement rail
        this.previewPlacements = [
            { name: 'Indoors', image: '/images/smartleaf_indoors.jpg', video: '/videos/living-room.mp4' },
            { name: 'Outdoors', image: '/images/outdoor_vibe_new.jpg', video: '/videos/outdoor.mp4' },
            { name: 'Gardening', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&auto=format&fit=crop', video: '/videos/gardening.mp4' },
            { name: 'Rooftop', image: '/images/rooftop_garden.jpg', video: '/videos/ecohaven.mp4' },
            { name: 'Balcony', image: '/images/miniheaven_balcony.jpg', video: '/videos/home_balcony.mp4' },
            { name: 'Kitchen', image: '/images/kitchen_image.jpg', video: '/videos/kitchen.mp4' }
        ];
    }
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.startSlider();
        }
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId) && this.bgVideo) {
            // Force play for autoplay policies
            this.bgVideo.nativeElement.muted = true;
            this.bgVideo.nativeElement.play().catch(e => console.log('Auto-play prevented:', e));
        }
    }
    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    startSlider() {
        // Start immediately
        this.intervalId = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.heroImages.length;
        }, 1500);
    }
    scrollToPlacements() {
        const element = document.getElementById('placements');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    openVideoPreview(item, event) {
        event.stopPropagation(); // Avoid triggering parent click
        this.selectedPlacementName = item.name;
        this.selectedVideo = item.video;
        this.isModalOpen = true;
    }
    watchStory() {
        this.selectedPlacementName = 'Greenie Culture Story';
        this.selectedVideo = '/videos/homepagevideo.mp4';
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        this.selectedVideo = null;
        this.selectedPlacementName = null;
    }
};
__decorate([
    ViewChild('bgVideo')
], InteractiveHeroComponent.prototype, "bgVideo", void 0);
InteractiveHeroComponent = __decorate([
    Component({
        selector: 'app-interactive-hero',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './interactive-hero.html',
        styleUrl: './interactive-hero.css'
    }),
    __param(0, Inject(PLATFORM_ID))
], InteractiveHeroComponent);
export { InteractiveHeroComponent };
//# sourceMappingURL=interactive-hero.js.map