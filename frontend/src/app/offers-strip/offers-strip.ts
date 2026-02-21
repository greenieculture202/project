import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-offers-strip',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './offers-strip.html',
    styleUrl: './offers-strip.css'
})
export class OffersStripComponent implements OnInit, OnDestroy {
    offers = [
        {
            pre: "BOGO OFFER: Buy 2 XL Plants & Get a ",
            highlight: "FREE Greenie Medium Plant!",
            post: "",
            color: "linear-gradient(90deg, #ecfccb 0%, #dcfce7 100%)", // Light Lime -> Light Green
            icon: "fas fa-leaf",
            buttonText: "GRAB OFFER",
            link: "/bogo-offer",
            btnColor: "#15803d" // Green 700
        },
        {
            pre: "INDOOR JUNGLE: Buy 2 Indoor Plants & Get a ",
            highlight: "FREE Ceramic Pot!",
            post: "",
            color: "linear-gradient(90deg, #f3e8ff 0%, #fae8ff 100%)", // Light Purple -> Light Pink
            icon: "fas fa-gift",
            buttonText: "SHOP NOW",
            link: "/indoor-offer",
            btnColor: "#7e22ce" // Purple 700
        },
        {
            pre: "GARDEN ESSENTIALS: Professional Garden Toolkits @ ",
            highlight: "Flat 40% OFF!",
            post: "",
            color: "linear-gradient(90deg, #fef3c7 0%, #fee2e2 100%)", // Light Amber -> Light Red
            icon: "fas fa-tools",
            buttonText: "SHOP TOOLKITS",
            link: "/garden-offer",
            btnColor: "#b45309" // Amber 700
        },
        {
            pre: "FLOWERING BONANZA: ",
            highlight: "Free Fertilizer",
            post: " with Every Flowering Plant!",
            color: "linear-gradient(90deg, #e0f2fe 0%, #dbeafe 100%)", // Light Sky -> Light Blue
            icon: "fas fa-seedling",
            buttonText: "START PLANTING",
            link: "/flowering-offer",
            btnColor: "#0369a1" // Sky 700
        }
    ];

    currentIndex = 0;
    intervalId: any;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef, private router: Router) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.startAutoScroll();
        }
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    startAutoScroll() {
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.offers.length;
            this.cdr.detectChanges(); // Force update
        }, 3000); // 3 seconds
    }
}
