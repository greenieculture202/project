import { __decorate } from "tslib";
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlacementService } from '../services/placement.service';
let PlacementsComponent = class PlacementsComponent {
    constructor() {
        this.router = inject(Router);
        this.placementService = inject(PlacementService);
        this.sanitizer = inject(DomSanitizer);
        this.selectedPlacement = null;
        this.placements = [];
        this.isLoading = true;
        this.selectedVideo = null;
        this.isModalOpen = false;
        this.showViewPlantsBtn = false;
    }
    ngOnInit() {
        this.loadPlacements();
    }
    loadPlacements() {
        this.isLoading = true;
        this.placementService.getPlacements().subscribe({
            next: (data) => {
                this.placements = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading placements:', err);
                this.isLoading = false;
            }
        });
    }
    openVideo(item) {
        this.selectedPlacement = { ...item };
        let url = item.videoUrl;
        // Auto-detect YouTube and transform to embed URL
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            this.selectedPlacement.isLocal = false;
            if (url.includes('watch?v=')) {
                url = url.replace('watch?v=', 'embed/');
            }
            else if (url.includes('youtu.be/')) {
                url = url.replace('youtu.be/', 'youtube.com/embed/');
            }
            // Clean up extra parameters if any
            if (url.includes('&')) {
                url = url.split('&')[0];
            }
        }
        else {
            this.selectedPlacement.isLocal = true;
        }
        this.selectedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isModalOpen = true;
        this.showViewPlantsBtn = false;
    }
    onVideoEnded() {
        this.showViewPlantsBtn = true;
    }
    navigateToPlants() {
        if (this.selectedPlacement) {
            const route = this.selectedPlacement.categoryRoute;
            this.closeModal();
            this.router.navigateByUrl(route);
        }
    }
    closeModal() {
        this.isModalOpen = false;
        this.selectedVideo = null;
        this.selectedPlacement = null;
        this.showViewPlantsBtn = false;
    }
};
PlacementsComponent = __decorate([
    Component({
        selector: 'app-placements',
        standalone: true,
        imports: [CommonModule],
        templateUrl: './placements.html',
        styleUrls: ['./placements.css']
    })
], PlacementsComponent);
export { PlacementsComponent };
//# sourceMappingURL=placements.js.map