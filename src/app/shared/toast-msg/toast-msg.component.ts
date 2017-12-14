import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material'

@Component({
    selector: 'app-toast-msg',
    templateUrl: './toast-msg.component.html',
    styleUrls: ['./toast-msg.component.scss']
})
export class ToastMsgComponent implements OnInit {

    constructor( @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

    ngOnInit() {
    }

}
