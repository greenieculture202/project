import { __decorate } from "tslib";
import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { HttpClient } from '@angular/common/http';
let LoginComponent = class LoginComponent {
    constructor(fb, router) {
        this.fb = fb;
        this.router = router;
        this.isPasswordVisible = false;
        this.isLoggedInSuccess = false;
        this.loginError = '';
        this.isLoading = false;
        this.isBlooming = false;
        // OTP related
        this.showOtpModal = false;
        this.otpEmail = '';
        this.otpCode = '';
        this.tempIdToken = '';
        this.authService = inject(AuthService);
        this.notificationService = inject(NotificationService);
        this.ngZone = inject(NgZone);
        this.http = inject(HttpClient);
        this.cdr = inject(ChangeDetectorRef);
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }
    ngOnInit() {
        this.initializeGoogleLogin();
    }
    initializeGoogleLogin() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: '245945304873-qv3ci0hquk7q087bljei6dusabaj6c4l.apps.googleusercontent.com',
                callback: (response) => this.handleCredentialResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            // Try to auto-show One Tap prompt in the top-right
            google.accounts.id.prompt();
        }
        else {
            setTimeout(() => this.initializeGoogleLogin(), 1000);
        }
    }
    handleCredentialResponse(response) {
        this.ngZone.run(() => {
            this.isLoading = true;
            this.tempIdToken = response.credential;
            console.log('[Google Login] Requesting OTP for email in credential...');
            this.authService.requestGoogleOTP(this.tempIdToken).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.otpEmail = res.email;
                    this.showOtpModal = true;
                    this.notificationService.show('Please check your Gmail for OTP!', 'OTP Sent', 'info');
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('[Google Login] Request error:', err);
                    const errorMsg = err.error?.message || 'Failed to send OTP. Please try again.';
                    this.loginError = errorMsg;
                    this.notificationService.show(errorMsg, 'Error', 'error');
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
            next: (res) => {
                this.isLoading = false;
                this.showOtpModal = false;
                this.notificationService.show('Logged in with Google!', 'Success', 'success');
                this.router.navigate(['/']);
            },
            error: (err) => {
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
            const email = this.loginForm.value.email.trim();
            const password = this.loginForm.value.password;
            console.log('[Login] Attempting login for:', email);
            // Admin Login Check — any email ending in @greenie.com is treated as admin attempt
            if (email.toLowerCase().endsWith('@greenie.com')) {
                console.log('[Login] Detected admin email, routing to admin-login');
                this.http.post(`${this.authService.apiUrl}/admin-login`, { email, password }).subscribe({
                    next: (res) => {
                        console.log('[Login] Admin login successful:', res.user.fullName);
                        this.isLoading = false;
                        sessionStorage.setItem('auth_token', res.token);
                        sessionStorage.setItem('user_name', res.user.fullName);
                        this.authService.setAdmin(true, res.user.fullName);
                        this.notificationService.show(`Welcome ${res.user.fullName}!`, 'Admin Login Successful', 'success');
                        this.router.navigate(['/admin-dashboard']);
                    },
                    error: (err) => {
                        console.error('[Login] Admin login error:', err);
                        this.isLoading = false;
                        const errorMsg = err.error?.message || 'Admin login failed. Please check credentials.';
                        this.loginError = errorMsg;
                        this.notificationService.show(errorMsg, 'Login Failed', 'error');
                        this.cdr.detectChanges(); // Force UI update
                    }
                });
                return;
            }
            const emailPrefix = email.split('@')[0]; // Strip domain if user typed it
            const loginEmail = `${emailPrefix}@gmail.com`;
            console.log('[Login] Routing to user-login with:', loginEmail);
            const loginPayload = {
                email: loginEmail,
                password: password
            };
            this.authService.login(loginPayload)
                .subscribe({
                next: (res) => {
                    console.log('[Login] User login successful');
                    this.isLoading = false;
                    this.notificationService.show('Welcome back to Greenie Culture!', 'Login Successful', 'success');
                    this.isLoggedInSuccess = true;
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('[Login] User login error:', err);
                    this.isLoading = false;
                    if (err.status === 404 || err.error?.message === 'User not found') {
                        this.notificationService.show('Account not found. First Register is compulsory!', 'Account Missing', 'error', 'standard', '/register');
                    }
                    else {
                        const errorMsg = err.error?.message || 'Invalid email or password. Please try again.';
                        this.loginError = errorMsg;
                        // Auto-clear toast after 4s (matching CSS animation)
                        setTimeout(() => {
                            if (this.loginError === errorMsg)
                                this.loginError = '';
                            this.cdr.detectChanges();
                        }, 4000);
                        this.notificationService.show(errorMsg, 'Login Failed', 'error');
                    }
                    this.isLoggedInSuccess = false;
                    this.cdr.detectChanges();
                }
            });
        }
        else {
            this.loginForm.markAllAsTouched();
        }
    }
    loginWithGoogle() {
        if (typeof google !== 'undefined') {
            console.log('[Google Login] Triggering prompt...');
            google.accounts.id.prompt((notification) => {
                console.log('[Google Login] Prompt notification:', notification);
                if (notification.isNotDisplayed()) {
                    const reason = notification.getNotDisplayedReason();
                    console.warn('[Google Login] Prompt was not displayed:', reason);
                    // If suppressed or dismissed too many times, Google blocks it for a while.
                    // We notify the user so they aren't confused why 'nothing happens'.
                    if (reason === 'suppressed_by_user' || reason === 'dismissed') {
                        this.notificationService.show('Google login prompt was dismissed recently. Please refresh the page or try again in a few minutes.', 'Login Notice', 'info');
                    }
                    else {
                        this.notificationService.show('Wait a moment for Google login to load, or refresh the page.', 'Login Notice', 'info');
                    }
                }
            });
        }
        else {
            this.notificationService.show('Google login is not ready yet. Please refresh.', 'Wait', 'info');
        }
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
        templateUrl: './login.html',
        styleUrl: './login.css'
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.js.map