import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ToastMsgComponent } from '../shared/toast-msg/toast-msg.component';

@Injectable()

export class CommonServices {
    
    constructor(private snackBar: MatSnackBar) {}

    toastMessage(msg: string, duration: number = 1000) {
        this.snackBar.openFromComponent(ToastMsgComponent, {
            duration: duration,
            data: msg
        });
    }
}