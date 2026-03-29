import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let AiService = class AiService {
    constructor() {
        this.chatTrigger = new Subject();
        this.chatTrigger$ = this.chatTrigger.asObservable();
    }
    triggerChat(query, autoSend = false) {
        this.chatTrigger.next({ query, autoSend });
    }
};
AiService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AiService);
export { AiService };
//# sourceMappingURL=ai.service.js.map