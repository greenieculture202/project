import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlacementService, Placement } from '../services/placement.service';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-placements',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './placements.html',
    styleUrls: ['./placements.css']
})
export class PlacementsComponent implements OnInit {
    private router = inject(Router);
    private placementService = inject(PlacementService);
    private sanitizer = inject(DomSanitizer);
    private productService = inject(ProductService);

    selectedPlacement: Placement | null = null;
    placements: Placement[] = [];
    isLoading: boolean = true;
    selectedVideo: SafeResourceUrl | null = null;
    isModalOpen = false;
    showViewPlantsBtn = false;
    
    // Shop Plants Pop-up state
    showShopPlantsModal = false;
    relatedPlants: any[] = [];
    isLoadingPlants = false;

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

    openVideo(item: Placement) {
        this.selectedPlacement = { ...item };
        let url = item.videoUrl;

        // Auto-detect YouTube and transform to embed URL
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            this.selectedPlacement.isLocal = false;
            if (url.includes('watch?v=')) {
                url = url.replace('watch?v=', 'embed/');
            } else if (url.includes('youtu.be/')) {
                url = url.replace('youtu.be/', 'youtube.com/embed/');
            } else if (url.includes('youtube.com/shorts/')) {
                url = url.replace('youtube.com/shorts/', 'youtube.com/embed/');
            }

            // Clean up extra parameters if any
            if (url.includes('&')) {
                url = url.split('&')[0];
            }
        } 
        // Auto-detect Pinterest and transform to embed URL
        else if (url.includes('pinterest.com/pin/') || url.includes('pin.it/')) {
            this.selectedPlacement.isLocal = false;
            const pinId = this.extractPinterestId(url);
            if (pinId) {
                url = `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
            }
        } 
        else {
            // Detect if it is a direct media file
            const mediaExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
            const isMediaFile = mediaExtensions.some(ext => url.toLowerCase().split('?')[0].endsWith(ext));
            this.selectedPlacement.isLocal = isMediaFile;
        }

        this.selectedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isModalOpen = true;
        this.showViewPlantsBtn = false; // Back to false, show only at the end
        this.showShopPlantsModal = false;
    }

    private extractPinterestId(url: string): string | null {
        const pinMatch = url.match(/pin\/(\d+)/);
        if (pinMatch && pinMatch[1]) return pinMatch[1];
        return null;
    }

    onVideoEnded() {
        this.showViewPlantsBtn = true;
    }

    toggleShopPlants() {
        if (!this.selectedPlacement) return;
        
        this.showShopPlantsModal = !this.showShopPlantsModal;
        
        if (this.showShopPlantsModal && this.relatedPlants.length === 0) {
            this.fetchPlacementPlants();
        }
    }

    fetchPlacementPlants() {
        if (!this.selectedPlacement) return;
        
        this.isLoadingPlants = true;
        this.relatedPlants = [];
        
        const route = this.selectedPlacement.categoryRoute || '';
        let categoryMatch = '';
        const segments = route.split('/').filter(s => !!s);
        const slug = segments[segments.length - 1];
        
        if (route.includes('=')) {
            categoryMatch = route.split('=')[1];
        } else if (slug) {
            // Send the raw slug first, backend is now robust enough to handle it
            categoryMatch = slug; 
        }
        
        if (!categoryMatch) {
            this.isLoadingPlants = false;
            return;
        }

        console.log(`[Placements] Fetching plants for: "${categoryMatch}"`);
        
        this.productService.getProducts(categoryMatch).subscribe({
            next: (plants) => {
                if (plants.length === 0 && !route.includes('=')) {
                    // Title case fallback if slug match failed
                    const titleFallback = slug.split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    
                    this.productService.getProducts(titleFallback).subscribe({
                        next: (fallbackPlants) => {
                            this.relatedPlants = fallbackPlants.slice(0, 6);
                            this.isLoadingPlants = false;
                        },
                        error: () => this.isLoadingPlants = false
                    });
                } else {
                    this.relatedPlants = plants.slice(0, 6);
                    this.isLoadingPlants = false;
                }
            },
            error: (err) => {
                console.error('Error fetching placement plants:', err);
                this.isLoadingPlants = false;
            }
        });
    }

    navigateToProduct(slug: string, name: string) {
        const productSlug = slug || this.productService.createSlug(name);
        this.closeModal();
        this.router.navigate(['/product', productSlug]);
    }

    navigateToCategory() {
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
        this.showShopPlantsModal = false;
        this.relatedPlants = [];
    }
}
