import { Component, signal, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

declare var google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isPasswordVisible = false;
    isLoggedInSuccess = false;
    loginError = '';
    isLoading = false;
    isBlooming = false;

    // OTP related
    showOtpModal = false;
    otpEmail = '';
    otpCode = '';
    tempIdToken = '';

    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    private ngZone = inject(NgZone);

    constructor(private fb: FormBuilder, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.initializeGoogleLogin();
    }

    private initializeGoogleLogin() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com',
                callback: (response: any) => this.handleCredentialResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            // Try to auto-show One Tap prompt in the top-right
            google.accounts.id.prompt();
        } else {
            setTimeout(() => this.initializeGoogleLogin(), 1000);
        }
    }

    handleCredentialResponse(response: any) {
        this.ngZone.run(() => {
            this.isLoading = true;
            this.tempIdToken = response.credential;
            console.log('[Google Login] Requesting OTP for email in credential...');

            this.authService.requestGoogleOTP(this.tempIdToken).subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    this.otpEmail = res.email;
                    this.showOtpModal = true;
                    this.notificationService.show('Please check your Gmail for OTP!', 'OTP Sent', 'info');
                },
                error: (err: any) => {
                    this.isLoading = false;
                    console.error('[Google Login] Request error:', err);
                    this.loginError = err.error?.message || 'Failed to send OTP. Please try again.';
                    this.notificationService.show(this.loginError, 'Error', 'error');
                }
            });
        });
    }

    onVerifyOtp() {
        if (this.otpCode.length !== 6) {
            this.notificationService.show('Please enter a valid 6-digit OTP', 'Invalid OTP', 'error');
            return;
        }

        this.isLoading = true;
        this.authService.verifyGoogleOTP(this.otpEmail, this.otpCode).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                this.showOtpModal = false;
                this.notificationService.show('Logged in with Google!', 'Success', 'success');
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('[Google Verification] Error:', err);
                const msg = err.error?.message || 'Invalid or expired OTP. Please try again.';
                this.notificationService.show(msg, 'Verification Failed', 'error');
            }
        });
    }

    closeOtpModal() {
        this.showOtpModal = false;
        this.otpCode = '';
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
            const password = this.loginForm.value.password;

            // Admin Login Check
            if (rawEmail === 'admin@greenie.com' && password === 'radheradhe') {
                this.isLoading = false;
                this.authService.setAdmin(true);
                this.notificationService.show('Welcome Admin!', 'Admin Login Successful', 'success');
                this.router.navigate(['/admin-dashboard']);
                return;
            }

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


    loginWithGoogle() {
        if (typeof google !== 'undefined') {
            console.log('[Google Login] Triggering prompt...');
            google.accounts.id.prompt((notification: any) => {
                console.log('[Google Login] Prompt notification:', notification);
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.warn('[Google Login] Prompt was not displayed:', reason);

                    // If suppressed or dismissed too many times, Google blocks it for a while.
                    // We notify the user so they aren't confused why 'nothing happens'.
                    if (reason === 'suppressed_by_user' || reason === 'dismissed') {
                        this.notificationService.show('Google login prompt was dismissed recently. Please refresh the page or try again in a few minutes.', 'Login Notice', 'info');
                    } else {
                        this.notificationService.show('Wait a moment for Google login to load, or refresh the page.', 'Login Notice', 'info');
                    }
                }
            });
        } else {
            this.notificationService.show('Google login is not ready yet. Please refresh.', 'Wait', 'info');
        }
    }
}
