import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Custom validator: only @gmail.com allowed
function gmailOnlyValidator(control) {
    const value = control.value || '';
    if (value && !value.toLowerCase().endsWith('@gmail.com')) {
        return { gmailOnly: true };
    }
    return null;
}
let RegisterComponent = class RegisterComponent {
    constructor(fb, router, authService, notificationService) {
        this.fb = fb;
        this.router = router;
        this.authService = authService;
        this.notificationService = notificationService;
        this.isPasswordVisible = false;
        this.isRegistered = false;
        this.registerError = '';
        this.isLoading = false;
        this.states = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
            'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
            'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
            'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
        ].sort();
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
            state: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email, gmailOnlyValidator]],
            phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    togglePasswordVisibility() { this.isPasswordVisible = !this.isPasswordVisible; }
    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.registerError = '';
            this.authService.registerUser(this.registerForm.value)
                .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.isRegistered = true;
                    this.notificationService.show('Account created! Please login to continue.', 'Registration Successful 🎉', 'success', 'standard', '/login');
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 1800);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.registerError = err.error?.message || 'Registration failed. Please try again.';
                    this.notificationService.show(this.registerError, 'Registration Error', 'error');
                    this.isRegistered = false;
                }
            });
        }
        else {
            this.registerForm.markAllAsTouched();
        }
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterModule],
        templateUrl: './register.html',
        styleUrl: './register.css'
    })
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.js.map