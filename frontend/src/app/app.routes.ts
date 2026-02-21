import { Routes } from '@angular/router';
import { ProductListingComponent } from './product-listing/product-listing';
import { HomeComponent } from './home/home';
import { BogoOfferComponent } from './bogo-offer/bogo-offer';
import { IndoorOfferComponent } from './indoor-offer/indoor-offer';
import { GardenOfferComponent } from './garden-offer/garden-offer';
import { ToolGuideComponent } from './tool-guide/tool-guide';
import { FloweringOfferComponent } from './flowering-offer/flowering-offer';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products/:category', component: ProductListingComponent },
    { path: 'product/:id', loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent) },
    { path: 'bogo-offer', component: BogoOfferComponent },
    { path: 'indoor-offer', component: IndoorOfferComponent },
    { path: 'garden-offer', component: GardenOfferComponent },
    { path: 'tool-guide', component: ToolGuideComponent },
    { path: 'flowering-offer', component: FloweringOfferComponent },
    { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./register/register').then(m => m.RegisterComponent) }
];
