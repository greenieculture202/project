import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
let FooterComponent = class FooterComponent {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }
};
FooterComponent = __decorate([
    Component({
        selector: 'app-footer',
        standalone: true,
        imports: [CommonModule, RouterModule],
        templateUrl: './footer.html',
        styleUrl: './footer.css'
    })
], FooterComponent);
export { FooterComponent };
//# sourceMappingURL=footer.js.map