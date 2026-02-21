import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-indoor-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './indoor-offer.html',
    styleUrls: ['./indoor-offer.css']
})
export class IndoorOfferComponent implements OnInit {
    private productService = inject(ProductService);
    indoorPlants: Product[] = [];

    ngOnInit() {
        // Get all indoor plants, limit to 6
        this.productService.getProducts('Indoor Plants', 6).subscribe(products => {
            this.indoorPlants = products;
        });
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
