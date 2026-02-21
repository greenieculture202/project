import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './navbar/navbar';
import { CategoryNavComponent } from './category-nav/category-nav';
import { OffersStripComponent } from './offers-strip/offers-strip';
import { NotificationModalComponent } from './notification-modal/notification-modal';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, CategoryNavComponent, OffersStripComponent, NotificationModalComponent],
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
    const hiddenRoutes = ['/login', '/register'];
    this.hideTopLayout.set(hiddenRoutes.some((route) => cleanUrl.startsWith(route)));
  }
}
