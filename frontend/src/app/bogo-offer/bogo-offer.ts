import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-bogo-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './bogo-offer.html',
    styleUrls: ['./bogo-offer.css']
})
export class BogoOfferComponent implements OnInit {
    private productService = inject(ProductService);
    xlPlants: Product[] = [];

    ngOnInit() {
        this.xlPlants = this.productService.getProducts('XL Plants');
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
