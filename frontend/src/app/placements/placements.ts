import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface Placement {
    name: string;
    description: string;
    image: string;
    videoUrl: string;
    features: string[];
    badge: string;
    isLocal?: boolean;
    categoryRoute: string;
}

@Component({
    selector: 'app-placements',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './placements.html',
    styleUrls: ['./placements.css']
})
export class PlacementsComponent {
    private router = inject(Router);
    selectedPlacement: Placement | null = null;
    placements: Placement[] = [
        {
            name: 'SmartLeaf Indoors',
            description: 'The living room is the heart of your home. Adding plants here creates a welcoming atmosphere and naturally purifies the air.',
            image: '/images/smartleaf_indoors.jpg',
            videoUrl: '/videos/living-room.mp4',
            features: ['Air Purifying', 'Low Maintenance', 'Stunning Decor'],
            badge: 'LIVING SPACES',
            isLocal: true,
            categoryRoute: '/products/indoor-plants'
        },
        {
            name: 'EcoScape Outdoors',
            description: 'Transform your garden or balcony with plants that thrive under the open sky and enhance your outdoor living.',
            image: '/images/outdoor_vibe_new.jpg',
            videoUrl: '/videos/outdoor.mp4',
            features: ['Weather Resistant', 'Sun Loving', 'Natural Growth'],
            badge: 'OUTDOOR LIVING',
            isLocal: true,
            categoryRoute: '/products/outdoor-plants'
        },
        {
            name: 'Gardening',
            description: 'Start your own green journey. Our gardening kits and plants are perfect for both beginners and experts.',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop',
            videoUrl: '/videos/gardening.mp4',
            features: ['Beginner Friendly', 'Complete Kits', 'Sustainable'],
            badge: 'START GROWING',
            isLocal: true,
            categoryRoute: '/products/gardening'
        },
        {
            name: 'EcoHaven Rooftop',
            description: 'Elevate your urban living with a sustainable rooftop garden that brings nature closer to the sky.',
            image: '/images/rooftop_garden.jpg',
            videoUrl: '/videos/ecohaven.mp4',
            features: ['Sustainable Living', 'Urban Oasis', 'Low Carbon Footprint'],
            badge: 'ECO FRIENDLY',
            isLocal: true,
            categoryRoute: '/products/outdoor-plants'
        },
        {
            name: 'miniheaven balcony',
            description: 'Create your own mini heaven in your balcony with our curated collection of outdoor plants that flourish in open spaces.',
            image: '/images/miniheaven_balcony.jpg',
            videoUrl: '/videos/home_balcony.mp4',
            features: ['Sun Loving', 'Urban Oasis', 'Low Maintenance'],
            badge: 'BALCONY GARDEN',
            isLocal: true,
            categoryRoute: '/products/flowering-plants'
        },
        {
            name: 'kitchen',
            description: 'Fresh herbs and air-purifying plants make your kitchen a more vibrant and healthy place to cook and gather.',
            image: '/images/kitchen_image.jpg',
            videoUrl: '/videos/kitchen.mp4',
            features: ['Culinary Herbs', 'Air Purifying', 'Compact Size'],
            badge: 'FRESH COOKING',
            isLocal: true,
            categoryRoute: '/products/indoor-plants'
        }
    ];

    selectedVideo: SafeResourceUrl | null = null;
    isModalOpen = false;
    showViewPlantsBtn = false;

    constructor(private sanitizer: DomSanitizer) { }

    openVideo(item: Placement) {
        this.selectedPlacement = item;
        this.selectedVideo = this.sanitizer.bypassSecurityTrustResourceUrl(item.videoUrl);
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
}
