import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationState {
    isVisible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    layout?: 'standard' | 'cart';
    redirectUrl?: string;
    confirmLabel?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private initialState: NotificationState = {
        isVisible: false,
        title: '',
        message: '',
        type: 'info'
    };

    private stateSubject = new BehaviorSubject<NotificationState>(this.initialState);
    state$: Observable<NotificationState> = this.stateSubject.asObservable();

    show(message: string, title: string = 'Notification', type: 'success' | 'error' | 'info' = 'info', layout: 'standard' | 'cart' = 'standard', redirectUrl?: string, confirmLabel: string = 'OK') {
        this.stateSubject.next({
            isVisible: true,
            title,
            message,
            type,
            layout,
            redirectUrl,
            confirmLabel
        });
    }

    hide() {
        this.stateSubject.next({ ...this.stateSubject.value, isVisible: false });
    }
}
