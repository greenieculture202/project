import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './navbar/navbar';
import { CategoryNavComponent } from './category-nav/category-nav';
import { OffersStripComponent } from './offers-strip/offers-strip';
import { NotificationModalComponent } from './notification-modal/notification-modal';
import { CartDrawerComponent } from './cart-drawer/cart-drawer';
import { FooterComponent } from './footer/footer';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, CategoryNavComponent, OffersStripComponent, NotificationModalComponent, CartDrawerComponent, FooterComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly hideTopLayout = signal(false);

  constructor(private router: Router) {
    this.updateTopLayoutVisibility(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateTopLayoutVisibility(event.urlAfterRedirects));
  }

  private updateTopLayoutVisibility(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const hiddenRoutes = ['/login', '/register', '/admin-dashboard'];
    const isHidden = hiddenRoutes.some((route) => cleanUrl.startsWith(route));
    this.hideTopLayout.set(isHidden);

    // Toggle class on body to handle padding
    if (isHidden) {
      document.body.classList.add('no-padding');
    } else {
      document.body.classList.remove('no-padding');
    }
  }
}
