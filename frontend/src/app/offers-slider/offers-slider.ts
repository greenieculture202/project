import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Offer {
    id: number;
    title: string;
    subtitle: string;
    discount: string;
    description: string;
    buttonText: string;
    image: string;
    backgroundColor: string;
    link: string;
}

@Component({
    selector: 'app-offers-slider',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './offers-slider.html',
    styleUrls: ['./offers-slider.css']
})
export class OffersSliderComponent implements OnInit {
    @ViewChild('sliderContainer', { static: false }) sliderContainer!: ElementRef;

    currentSlide = 0;
    autoPlayInterval: any;

    offers: Offer[] = [
        {
            id: 1,
            title: 'BOGO OFFER',
            subtitle: 'Buy 2 XL Plants & Get',
            discount: 'GREENIE MEDIUM PLANT',
            description: 'Get a premium medium plant free with XL plants',
            buttonText: 'GRAB OFFER',
            image: 'https://images.unsplash.com/photo-1512428813838-659ddce53363?auto=format&fit=crop&w=1920&q=80', // Reliable fallback: Beautiful indoor plants arrangement
            backgroundColor: '#064e3b',
            link: '/bogo-offer'
        },
        {
            id: 2,
            title: 'INDOOR JUNGLE',
            subtitle: 'Buy any 2 Indoor Plants & Get',
            discount: 'FREE CERAMIC POT',
            description: 'Style your space with premium plants and a free gift',
            buttonText: 'SHOP NOW',
            image: 'https://images.unsplash.com/photo-1512428813833-ed1107380905?auto=format&fit=crop&w=1920&q=80',
            backgroundColor: '#111827',
            link: '/indoor-offer'
        },
        {
            id: 3,
            title: 'GARDEN ESSENTIALS',
            subtitle: 'Get Professional Grade',
            discount: 'GARDEN TOOLKITS @ 40% OFF',
            description: 'Everything you need in one premium toolkit',
            buttonText: 'SHOP TOOLKITS',
            image: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=1920&q=80',
            backgroundColor: '#78350f',
            link: '/garden-offer'
        },
        {
            id: 4,
            title: 'FLOWERING BONANZA',
            subtitle: 'Get a FREE Fertilizer Packet with',
            discount: 'EVERY FLOWERING PURCHASE',
            description: 'Grow vibrant blooms with our premium seeds and free plant food',
            buttonText: 'START PLANTING',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1920&q=80',
            backgroundColor: '#4c1d95',
            link: '/flowering-offer'
        }
    ];

    constructor(private router: Router) { }

    ngOnInit() {
        this.startAutoPlay();
    }

    ngOnDestroy() {
        this.stopAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 3000); // Change slide every 3 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.offers.length;
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.offers.length) % this.offers.length;
        this.resetAutoPlay();
    }

    goToSlide(index: number) {
        this.currentSlide = index;
        this.resetAutoPlay();
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    onMouseEnter() {
        // Removed pause on hover to keep it sliding as requested
    }

    onMouseLeave() {
        // Already sliding, no action needed
    }
}
