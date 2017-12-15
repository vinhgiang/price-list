import { Component, OnInit } from '@angular/core';
import { BrandServices } from '../../services/brand.services';
import { MatSnackBar } from '@angular/material';
import { ToastMsgComponent } from '../../shared/toast-msg/toast-msg.component';

@Component({
    selector: 'app-brand-add',
    templateUrl: './brand-add.component.html',
    styleUrls: ['./brand-add.component.scss'],
    providers: [ BrandServices ]
})
export class BrandAddComponent implements OnInit {

    txtName: String = '';

    constructor(private BrandServices: BrandServices, public snackBar: MatSnackBar) { }

    ngOnInit() {}

    onSubmit(formValue) {
        this.BrandServices.createBrand(formValue)
            .then(response => console.log(response));
        this.toastMessage(this.txtName + ' has been added!');
        this.txtName = '';
    }

    toastMessage(msg: string, duration: number = 1000) {
        this.snackBar.openFromComponent(ToastMsgComponent, {
            duration: duration,
            data: msg
        });
    }

}
