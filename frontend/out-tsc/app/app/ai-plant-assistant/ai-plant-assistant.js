import { __decorate } from "tslib";
import { Component, ViewChild, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AiService } from '../services/ai.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
let AiPlantAssistantComponent = class AiPlantAssistantComponent {
    constructor() {
        this.sanitizer = inject(DomSanitizer);
        this.http = inject(HttpClient);
        this.authService = inject(AuthService);
        this.productService = inject(ProductService);
        this.router = inject(Router);
        this.aiService = inject(AiService);
        this.isLoggedIn = () => this.authService.isLoggedIn();
        this.isOpen = signal(false);
        this.isTyping = signal(false);
        this.showHistory = signal(false);
        this.userMessage = '';
        this.selectedImage = null;
        this.selectedFile = null;
        this.showReminderModal = signal(false);
        this.activePlantName = '';
        this.activeProblemType = '';
        this.messages = [];
        this.destroy$ = new Subject();
        this.STORAGE_KEY = 'ai_plant_chat_history';
    }
    ngOnInit() {
        this.aiService.chatTrigger$.pipe(takeUntil(this.destroy$)).subscribe(trigger => {
            this.isOpen.set(true);
            this.userMessage = trigger.query;
            if (trigger.autoSend) {
                this.sendMessage();
            }
        });
        this.authService.isLoggedIn$.subscribe(loggedIn => {
            this.loadHistory();
        });
    }
    loadHistory() {
        if (this.authService.isLoggedIn()) {
            const token = this.authService.getToken();
            this.http.get('/api/chat-history', {
                headers: { 'x-auth-token': token || '' }
            }).subscribe({
                next: (history) => {
                    if (history && history.length > 0) {
                        this.messages = history.map(m => {
                            const msg = {
                                type: m.role,
                                text: m.text,
                                image: m.image,
                                time: new Date(m.timestamp || m.time),
                                safeText: m.role === 'ai' ? this.formatMessage(m.text) : undefined,
                                recommendedProducts: [],
                                plantName: m.plantName
                            };
                            // Restore recommendations from history
                            if (m.role === 'ai' && m.recommendations && m.recommendations.length > 0) {
                                const searchRequests = m.recommendations.map((term) => this.productService.searchProducts(term).pipe(catchError(() => of([]))));
                                forkJoin(searchRequests).subscribe((results) => {
                                    const allProducts = results.flat();
                                    const uniqueProducts = Array.from(new Map(allProducts.map((p) => [p._id || p.name, p])).values());
                                    msg.recommendedProducts = uniqueProducts.slice(0, 3);
                                });
                            }
                            return msg;
                        });
                        localStorage.removeItem(this.STORAGE_KEY);
                    }
                    else {
                        this.setDefaultMessage();
                    }
                    setTimeout(() => this.scrollToBottom(), 100);
                },
                error: (err) => {
                    console.error('Failed to load backend chat history', err);
                    this.loadLocalHistory();
                }
            });
        }
        else {
            this.loadLocalHistory();
        }
    }
    loadLocalHistory() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && !this.authService.isLoggedIn()) {
            try {
                const parsed = JSON.parse(saved);
                this.messages = parsed.map((m) => ({
                    ...m,
                    time: new Date(m.time),
                    safeText: m.type === 'ai' ? this.formatMessage(m.text) : undefined
                }));
            }
            catch (e) {
                this.setDefaultMessage();
            }
        }
        else {
            this.setDefaultMessage();
        }
    }
    startNewChat() {
        if (confirm('Are you sure you want to start a new chat? This will clear current conversation.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            this.setDefaultMessage();
            this.showHistory.set(false);
        }
    }
    setDefaultMessage() {
        this.messages = [
            {
                type: 'ai',
                text: 'Hello! I am your AI Plant Assistant. You can ask me anything about plant care, or upload a photo for a health diagnosis! 🌱',
                time: new Date(),
                safeText: this.formatMessage('Hello! I am your AI Plant Assistant. You can ask me anything about plant care, or upload a photo for a health diagnosis! 🌱')
            }
        ];
        this.saveHistory();
    }
    saveHistory() {
        // Only save serializable data (no SafeHtml)
        const toSave = this.messages.map(({ safeText, ...rest }) => rest);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
    }
    toggleChat() {
        this.isOpen.set(!this.isOpen());
        if (this.isOpen()) {
            setTimeout(() => this.scrollToBottom(), 100);
        }
    }
    toggleHistory() {
        this.showHistory.set(!this.showHistory());
        setTimeout(() => this.scrollToBottom(), 100);
    }
    onFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    triggerFileInput() {
        this.fileInput.nativeElement.click();
    }
    removeImage() {
        this.selectedImage = null;
        this.selectedFile = null;
    }
    sendShortcut(topic) {
        this.userMessage = topic;
        this.sendMessage();
    }
    sendMessage() {
        if (!this.userMessage.trim() && !this.selectedImage)
            return;
        const text = this.userMessage;
        const image = this.selectedImage || undefined;
        this.messages.push({
            type: 'user',
            text: text || (image ? 'Analyzing this plant...' : ''),
            image: image,
            time: new Date()
        });
        this.saveHistory();
        this.userMessage = '';
        this.selectedImage = null;
        this.isTyping.set(true);
        this.scrollToBottom();
        setTimeout(() => {
            this.generateAIResponse(text, image);
        }, 2000);
    }
    generateAIResponse(query, image) {
        const body = { message: query, image: image };
        const userId = this.authService.currentUserId;
        if (userId)
            body.userId = userId;
        const headers = {};
        const token = this.authService.getToken();
        if (token)
            headers['x-auth-token'] = token;
        this.http.post('/api/ai-assistant', body, { headers })
            .subscribe({
            next: (res) => {
                const aiMsg = {
                    type: 'ai',
                    text: res.text,
                    time: new Date(),
                    safeText: this.formatMessage(res.text),
                    recommendedProducts: [],
                    remindable: res.remindable,
                    plantName: res.plantName
                };
                this.messages.push(aiMsg);
                // Update active context for potential reminder
                if (res.remindable) {
                    // Simple extraction of plant name from AI text if possible, or use fallback
                    this.activePlantName = this.extractPlantName(res.text);
                    this.activeProblemType = query;
                }
                // Fetch recommended products if any
                if (res.recommendations && res.recommendations.length > 0) {
                    const searchRequests = res.recommendations.map((term) => this.productService.searchProducts(term).pipe(catchError(() => of([]))));
                    forkJoin(searchRequests).subscribe((results) => {
                        // Flatten and take a few unique products
                        const allProducts = results.flat();
                        let uniqueProducts = Array.from(new Map(allProducts.map((p) => [p._id || p.name, p])).values());
                        // --- CRITICAL IMPROVEMENT: Prioritize the identified plantName ---
                        if (res.plantName && res.plantName !== 'Plant') {
                            const targetName = res.plantName.toLowerCase();
                            const exactMatchIdx = uniqueProducts.findIndex(p => p.name.toLowerCase() === targetName);
                            if (exactMatchIdx !== -1) {
                                // Move exact match to first position
                                const [exactMatch] = uniqueProducts.splice(exactMatchIdx, 1);
                                uniqueProducts = [exactMatch, ...uniqueProducts];
                            }
                            else {
                                // Check for partial match if no exact match
                                const partialMatchIdx = uniqueProducts.findIndex(p => p.name.toLowerCase().includes(targetName));
                                if (partialMatchIdx !== -1) {
                                    const [partialMatch] = uniqueProducts.splice(partialMatchIdx, 1);
                                    uniqueProducts = [partialMatch, ...uniqueProducts];
                                }
                            }
                        }
                        aiMsg.recommendedProducts = uniqueProducts.slice(0, 3);
                        this.scrollToBottom();
                    });
                }
                this.saveHistory();
                this.isTyping.set(false);
                this.scrollToBottom();
            },
            error: (err) => {
                console.error('[AI-ERROR]', err);
                // The backend now sends recommendations even on error
                const errBody = err.error || {};
                const errorText = errBody.text || "Main background mein research kar raha hoon. Thodi der mein mujhse aur detailed poochhein! 😉";
                const aiMsg = {
                    type: 'ai',
                    text: errorText,
                    time: new Date(),
                    safeText: this.formatMessage(errorText),
                    recommendedProducts: [],
                    plantName: errBody.plantName
                };
                this.messages.push(aiMsg);
                // Use fallback recommendations from error body
                const fallbackRecs = errBody.recommendations || [];
                if (fallbackRecs.length > 0) {
                    const searchRequests = fallbackRecs.map((term) => this.productService.searchProducts(term).pipe(catchError(() => of([]))));
                    forkJoin(searchRequests).subscribe((results) => {
                        const allProducts = results.flat();
                        let uniqueProducts = Array.from(new Map(allProducts.map((p) => [p._id || p.name, p])).values());
                        // --- CRITICAL IMPROVEMENT: Prioritize the identified plantName (even on error) ---
                        if (errBody.plantName && errBody.plantName !== 'Plant') {
                            const targetName = errBody.plantName.toLowerCase();
                            const exactMatchIdx = uniqueProducts.findIndex(p => p.name.toLowerCase() === targetName);
                            if (exactMatchIdx !== -1) {
                                const [exactMatch] = uniqueProducts.splice(exactMatchIdx, 1);
                                uniqueProducts = [exactMatch, ...uniqueProducts];
                            }
                        }
                        aiMsg.recommendedProducts = uniqueProducts.slice(0, 3);
                        this.scrollToBottom();
                    });
                }
                this.isTyping.set(false);
                this.scrollToBottom();
            }
        });
    }
    formatMessage(text) {
        if (!text)
            return '';
        let html = text
            // Headers
            .replace(/### (.*?)(\n|$)/g, '<h3 style="margin: 10px 0 5px; color: #2e7d32; font-size: 1.1rem; font-weight: 700;">$1</h3>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1b5e20; font-weight: 800;">$1</strong>')
            // Bullet points
            .replace(/^- (.*?)(\n|$)/gm, '<div style="margin-left: 10px; display: flex; align-items: flex-start; gap: 5px; margin-bottom: 4px;"><span style="color: #2e7d32;">•</span><span>$1</span></div>')
            // Line breaks
            .replace(/\n/g, '<br>');
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    goToProduct(prod) {
        const slug = prod.slug || prod.name;
        this.isOpen.set(false); // Close chat on click
        this.router.navigate(['/product', slug]);
    }
    scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    }
    // Reminder Logic
    openReminderModal() {
        this.showReminderModal.set(true);
    }
    closeReminderModal() {
        this.showReminderModal.set(false);
    }
    confirmReminder() {
        const token = this.authService.getToken();
        if (!token) {
            alert('Please login to set a reminder!');
            return;
        }
        const body = {
            plantName: this.activePlantName || 'My Plant',
            problemType: this.activeProblemType || 'Care Follow-up'
        };
        this.http.post('/api/admin/reminders', body, {
            headers: { 'x-auth-token': token }
        }).subscribe({
            next: (res) => {
                alert("Shabash! Humne aapke liye 4 unique reminders set kar diye hain (Water, Fertilizer, Sunlight, Health). Pehla reminder 1 min mein aayega! 🌿✨");
                this.closeReminderModal();
            },
            error: () => alert('Failed to set reminders. Please try again later.')
        });
    }
    extractPlantName(text) {
        // Basic extraction - look for bolded items or specific plant keywords
        const matches = text.match(/\*\*(.*?)\*\*/);
        if (matches && matches[1])
            return matches[1];
        return 'Your Plant';
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
};
__decorate([
    ViewChild('scrollMe')
], AiPlantAssistantComponent.prototype, "myScrollContainer", void 0);
__decorate([
    ViewChild('fileInput')
], AiPlantAssistantComponent.prototype, "fileInput", void 0);
AiPlantAssistantComponent = __decorate([
    Component({
        selector: 'app-ai-plant-assistant',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterModule],
        templateUrl: './ai-plant-assistant.html',
        styleUrl: './ai-plant-assistant.css'
    })
], AiPlantAssistantComponent);
export { AiPlantAssistantComponent };
//# sourceMappingURL=ai-plant-assistant.js.map