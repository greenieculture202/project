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
        // Get indoor plants and limit to 6 for a clean grid as requested previously for BOGO
        this.indoorPlants = this.productService.getProducts('Indoor Plants').slice(0, 6);
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
