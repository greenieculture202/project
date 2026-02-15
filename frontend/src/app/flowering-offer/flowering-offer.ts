import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-flowering-offer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './flowering-offer.html',
    styleUrls: ['./flowering-offer.css']
})
export class FloweringOfferComponent implements OnInit {
    private productService = inject(ProductService);
    flowerSeeds: Product[] = [];

    ngOnInit() {
        this.flowerSeeds = this.productService.getProducts('Flower Seeds');
    }

    createSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
