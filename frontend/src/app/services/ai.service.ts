import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AiTrigger {
  query: string;
  autoSend: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private chatTrigger = new Subject<AiTrigger>();
  chatTrigger$ = this.chatTrigger.asObservable();

  private reminderTrigger = new Subject<void>();
  reminderTrigger$ = this.reminderTrigger.asObservable();

  triggerChat(query: string, autoSend: boolean = false) {
    this.chatTrigger.next({ query, autoSend });
  }

  triggerReminderCheck() {
    this.reminderTrigger.next();
  }
}
