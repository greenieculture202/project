import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-interactive-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-hero.html',
  styleUrl: './interactive-hero.css'
})
export class InteractiveHeroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private intervalId: any;

  // Images for the auto-slider (Orchid/Plant theme)
  heroImages = [
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', // Orchid/Pink pot
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', // Aloe/White pot
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80', // Succulent/Texture
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Money Plant/Pot
    'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80'  // Potted Plant on Stand
  ];

  // Shapes corresponding to each image
  imageShapes = [
    'shape-rectangle', // Default
    'shape-circle',
    'shape-landscape',
    'shape-oval',
    'shape-square'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startSlider();
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
}
