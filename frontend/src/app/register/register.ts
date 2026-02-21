import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Custom validator: only @gmail.com allowed
function gmailOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    if (value && !value.toLowerCase().endsWith('@gmail.com')) {
        return { gmailOnly: true };
    }
    return null;
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    registerForm: FormGroup;
    isPasswordVisible = false;
    isRegistered = false;
    registerError = '';
    isLoading = false;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private notificationService: NotificationService) {
        this.registerForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
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
                        this.notificationService.show(
                            'Account created! Please login to continue.',
                            'Registration Successful 🎉',
                            'success',
                            'standard',
                            '/login'
                        );
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
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
