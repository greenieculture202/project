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
            image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&h=600&q=80', // Wide plant banner
            title: 'Happiness',
            subtitle: 'is having more and more',
            highlight: 'plants...',
            discount: 'Get up to 35% OFF',
            color: '#1a4d1a',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=1600&h=600&q=80', // Succulents wide
            title: 'Happiness',
            subtitle: 'is having cute succulents',
            highlight: 'Collection',
            discount: 'Get up to 35% OFF',
            color: '#1a4d1a',
            bgType: 'gradient'
        },
        {
            image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&h=600&q=80', // Gardening wide
            title: 'Happiness',
            subtitle: 'is growing your own',
            highlight: 'food',
            discount: 'Get up to 70% OFF on seeds',
            color: '#000',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&w=1600&h=600&q=80', // Festive light/plant wide
            title: 'Happiness',
            subtitle: 'is turning your space into a',
            highlight: 'garden...',
            discount: 'Instant 30% Discount',
            color: '#e63946',
            bgType: 'festive'
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
