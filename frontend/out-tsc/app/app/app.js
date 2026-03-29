import { __decorate } from "tslib";
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './navbar/navbar';
import { CategoryNavComponent } from './category-nav/category-nav';
import { OffersStripComponent } from './offers-strip/offers-strip';
import { NotificationModalComponent } from './notification-modal/notification-modal';
import { CartDrawerComponent } from './cart-drawer/cart-drawer';
import { FooterComponent } from './footer/footer';
import { AiPlantAssistantComponent } from './ai-plant-assistant/ai-plant-assistant';
let App = class App {
    constructor(router) {
        this.router = router;
        this.title = signal('frontend');
        this.hideTopLayout = signal(false);
        this.updateTopLayoutVisibility(this.router.url);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => this.updateTopLayoutVisibility(event.urlAfterRedirects));
    }
    updateTopLayoutVisibility(url) {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const hiddenRoutes = ['/login', '/register', '/admin-dashboard', '/delivery-panel', '/ai-analytics'];
        const isHidden = hiddenRoutes.some((route) => cleanUrl.startsWith(route));
        this.hideTopLayout.set(isHidden);
        // Toggle class on body to handle padding
        if (isHidden) {
            document.body.classList.add('no-padding');
        }
        else {
            document.body.classList.remove('no-padding');
        }
    }
};
App = __decorate([
    Component({
        selector: 'app-root',
        imports: [CommonModule, RouterOutlet, NavbarComponent, CategoryNavComponent, OffersStripComponent, NotificationModalComponent, CartDrawerComponent, FooterComponent, AiPlantAssistantComponent],
        templateUrl: './app.html',
        styleUrl: './app.css'
    })
], App);
export { App };
//# sourceMappingURL=app.js.map