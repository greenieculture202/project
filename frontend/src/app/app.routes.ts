import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products/:category', loadComponent: () => import('./product-listing/product-listing').then(m => m.ProductListingComponent) },
    { path: 'product/:id', loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent) },
    { path: 'offers', loadComponent: () => import('./offers-page/offers-page').then(m => m.OffersPageComponent) },
    { path: 'bogo-offer', loadComponent: () => import('./bogo-offer/bogo-offer').then(m => m.BogoOfferComponent) },
    { path: 'indoor-offer', loadComponent: () => import('./indoor-offer/indoor-offer').then(m => m.IndoorOfferComponent) },
    { path: 'garden-offer', loadComponent: () => import('./garden-offer/garden-offer').then(m => m.GardenOfferComponent) },
    { path: 'tool-guide', loadComponent: () => import('./tool-guide/tool-guide').then(m => m.ToolGuideComponent) },
    { path: 'flowering-offer', loadComponent: () => import('./flowering-offer/flowering-offer').then(m => m.FloweringOfferComponent) },
    { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./register/register').then(m => m.RegisterComponent) },
    { path: 'checkout', loadComponent: () => import('./checkout/checkout').then(m => m.CheckoutComponent) },
    { path: 'about-us', loadComponent: () => import('./about-us/about-us').then(m => m.AboutUsComponent) },
    { path: 'contact-us', loadComponent: () => import('./contact-us/contact-us').then(m => m.ContactUsComponent) },
    { path: 'placements', loadComponent: () => import('./placements/placements').then(m => m.PlacementsComponent) }
];
