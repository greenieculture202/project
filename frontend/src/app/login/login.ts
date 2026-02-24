import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    isPasswordVisible = false;
    isLoggedInSuccess = false;
    loginError = '';
    isLoading = false;
    isBlooming = false;

    authService = inject(AuthService);
    notificationService = inject(NotificationService);

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    togglePasswordVisibility() { this.isPasswordVisible = !this.isPasswordVisible; }

    toggleBloom() {
        this.isBlooming = true;
        setTimeout(() => this.isBlooming = false, 1500);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.loginError = '';

            const rawEmail = this.loginForm.value.email;
            const emailPrefix = rawEmail.split('@')[0]; // Strip domain if user typed it

            const loginPayload = {
                ...this.loginForm.value,
                email: `${emailPrefix}@gmail.com`
            };

            this.authService.login(loginPayload)
                .subscribe({
                    next: (res: any) => {
                        this.isLoading = false;
                        this.notificationService.show('Welcome back to Greenie Culture!', 'Login Successful', 'success');
                        this.isLoggedInSuccess = true;
                        this.router.navigate(['/']);
                    },
                    error: (err: any) => {
                        this.isLoading = false;
                        if (err.status === 404 || err.error?.message === 'User not found') {
                            this.notificationService.show(
                                'Account not found. First Register is compulsory!',
                                'Account Missing',
                                'error',
                                'standard',
                                '/register'
                            );
                        } else {
                            const errorMsg = err.error?.message || 'Invalid email or password. Please try again.';
                            this.loginError = errorMsg;

                            // Auto-clear toast after 4s (matching CSS animation)
                            setTimeout(() => {
                                if (this.loginError === errorMsg) this.loginError = '';
                            }, 4000);

                            this.notificationService.show(errorMsg, 'Login Failed', 'error');
                        }
                        this.isLoggedInSuccess = false;
                    }
                });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
