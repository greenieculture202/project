import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-garden-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './garden-offer.html',
    styleUrls: ['./garden-offer.css']
})
export class GardenOfferComponent implements OnInit {
    private productService = inject(ProductService);
    gardenTools: Product[] = [];

    ngOnInit() {
        // Fetch products from 'Garden Toolkits' category, limit to 6
        this.productService.getProducts('Garden Toolkits', 6).subscribe(products => {
            this.gardenTools = products;
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
