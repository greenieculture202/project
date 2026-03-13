import { Component, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  type: 'user' | 'ai';
  text: string;
  image?: string;
  time: Date;
  safeText?: SafeHtml;
}

@Component({
  selector: 'app-ai-plant-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-plant-assistant.html',
  styleUrl: './ai-plant-assistant.css'
})
export class AiPlantAssistantComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef;

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  isOpen = signal(false);
  isTyping = signal(false);
  showHistory = signal(false);
  userMessage = '';
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  messages: Message[] = [];

  private readonly STORAGE_KEY = 'ai_plant_chat_history';

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.messages = parsed.map((m: any) => ({
          ...m,
          time: new Date(m.time),
          safeText: m.type === 'ai' ? this.formatMessage(m.text) : undefined
        }));
      } catch (e) {
        console.error('Failed to parse chat history', e);
        this.setDefaultMessage();
      }
    } else {
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

  private setDefaultMessage() {
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

  private saveHistory() {
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
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

  sendShortcut(topic: string) {
    this.userMessage = topic;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.userMessage.trim() && !this.selectedImage) return;

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

  generateAIResponse(query: string, image?: string | null) {
    this.http.post<any>('/api/ai-assistant', { message: query, image: image })
      .subscribe({
        next: (res) => {
          this.messages.push({
            type: 'ai',
            text: res.text,
            time: new Date(),
            safeText: this.formatMessage(res.text)
          });
          this.saveHistory();
          this.isTyping.set(false);
          this.scrollToBottom();
        },
        error: (err) => {
          console.error('[AI-ERROR]', err);
          const errorMsg = "I'm sorry, I'm having trouble connecting to my plant brain right now. " + (err.error?.message || "Please check if the backend is running and the Gemini API key is configured.");
          this.messages.push({
            type: 'ai',
            text: errorMsg,
            time: new Date(),
            safeText: this.formatMessage(errorMsg)
          });
          this.isTyping.set(false);
          this.scrollToBottom();
        }
      });
  }

  formatMessage(text: string): SafeHtml {
    if (!text) return '';
    
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

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
