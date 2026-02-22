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
    offerIcon: string;
    offerType: string;
    offerTypeColor: string;
    accentColor: string;
    tagLine: string;
    savingsBadge: string;
    savingsBadgeBg: string;
    ribbonL1: string;       // corner ribbon line 1
    ribbonL2: string;       // corner ribbon line 2
    ribbonColor: string;    // ribbon gradient color
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
            discount: 'GREENIE MEDIUM PLANT FREE',
            description: 'Get a premium medium plant free with XL plants',
            buttonText: 'GRAB OFFER',
            image: '/images/bogo_offer_v2.jpg',
            backgroundColor: '#064e3b',
            link: '/bogo-offer',
            offerIcon: '🎁',
            offerType: 'BUY 2 GET 1',
            offerTypeColor: '#fbbf24',
            accentColor: '#10b981',
            tagLine: '🌿 Exclusive Plant Gift Deal',
            savingsBadge: 'Save ₹499!',
            savingsBadgeBg: '#ef4444',
            ribbonL1: 'BUY 2',
            ribbonL2: 'GET 1',
            ribbonColor: '#16a34a'
        },
        {
            id: 2,
            title: 'INDOOR JUNGLE',
            subtitle: 'Buy any 2 Indoor Plants & Get',
            discount: 'FREE CERAMIC POT',
            description: 'Style your space with premium plants and a free gift',
            buttonText: 'SHOP NOW',
            image: '/images/indoor_jungle_offer.jpg',
            backgroundColor: '#111827',
            link: '/indoor-offer',
            offerIcon: '🏺',
            offerType: 'FREE GIFT',
            offerTypeColor: '#a78bfa',
            accentColor: '#8b5cf6',
            tagLine: '🏠 Premium Designer Pot Included',
            savingsBadge: 'Pot Worth ₹399 FREE',
            savingsBadgeBg: '#7c3aed',
            ribbonL1: 'FREE',
            ribbonL2: 'GIFT',
            ribbonColor: '#7c3aed'
        },
        {
            id: 3,
            title: 'GARDEN ESSENTIALS',
            subtitle: 'Get Professional Grade',
            discount: 'GARDEN TOOLKITS @ 40% OFF',
            description: 'Everything you need in one premium toolkit',
            buttonText: 'SHOP TOOLKITS',
            image: '/images/garden_essentials_offer.jpg',
            backgroundColor: '#78350f',
            link: '/garden-offer',
            offerIcon: '🛠️',
            offerType: 'FLAT 40% OFF',
            offerTypeColor: '#fb923c',
            accentColor: '#f59e0b',
            tagLine: '⚒️ Pro-Grade Tools Sale',
            savingsBadge: '40% OFF Today!',
            savingsBadgeBg: '#dc2626',
            ribbonL1: '40%',
            ribbonL2: 'OFF',
            ribbonColor: '#dc2626'
        },
        {
            id: 4,
            title: 'FLOWERING BONANZA',
            subtitle: 'Get a FREE Fertilizer Packet with',
            discount: 'EVERY FLOWERING PURCHASE',
            description: 'Grow vibrant blooms with our premium seeds and free plant food',
            buttonText: 'START PLANTING',
            image: '/images/flowering_bonanza_offer.jpg',
            backgroundColor: '#4c1d95',
            link: '/flowering-offer',
            offerIcon: '🌸',
            offerType: '70% OFF + FREE',
            offerTypeColor: '#f472b6',
            accentColor: '#ec4899',
            tagLine: '🌺 Seeds + Free Fertilizer Bundle',
            savingsBadge: '70% OFF Seeds!',
            savingsBadgeBg: '#be185d',
            ribbonL1: '70%',
            ribbonL2: 'OFF',
            ribbonColor: '#be185d'
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
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.offers.length;
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

    onMouseEnter() { }
    onMouseLeave() { }
}
