import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero-slider.html',
    styleUrl: './hero-slider.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
    slides = [
        {
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&q=80', // Happy/Cozy vibe
            title: 'Happiness is',
            subtitle: 'availing great offers on',
            highlight: 'Mejor App', // Using project name instead of Nurserylive strict copy if preferred, but user said 'same to same' so maybe keep generic or 'Mejor'
            discount: 'Download Now',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=1920&q=80', // Lush plants
            title: 'Value For Money',
            subtitle: 'Get high quality plants',
            highlight: 'Upto 35% Off',
            discount: 'Shop Now',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1920&q=80', // Potted plants
            title: 'Top 5',
            subtitle: 'Easiest to grow plants',
            highlight: 'For Beginners',
            discount: 'Starting ₹199',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1920&q=80', // Reliable Garden Decor
            title: 'Garden Decor',
            subtitle: 'Beautify your space',
            highlight: 'Planters & Pebbles',
            discount: 'Best Styles',
            color: '#fff',
            bgType: 'plain'
        }
    ];

    currentIndex = 0;
    intervalId: any;

    ngOnInit() {
        this.startAutoPlay();
    }

    ngOnDestroy() {
        this.stopAutoPlay();
    }

    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    goToSlide(index: number) {
        this.currentIndex = index;
        this.stopAutoPlay();
        this.startAutoPlay(); // Restart timer
    }
}
