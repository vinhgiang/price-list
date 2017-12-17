import { Component, OnInit } from '@angular/core';
import { SupplierServices } from '../../services/supplier.services';
import { MatSnackBar } from '@angular/material'
import { ToastMsgComponent } from '../../shared/toast-msg/toast-msg.component';

@Component({
    selector: 'app-supplier-add',
    templateUrl: './supplier-add.component.html',
    styleUrls: ['./supplier-add.component.scss'],
    providers: [SupplierServices]
})
export class SupplierAddComponent implements OnInit {

    txtName: string;

    constructor(private supplierServices: SupplierServices, private snackBar: MatSnackBar) { }

    ngOnInit() {
    }

    onSubmit(formValue) {
        this.supplierServices.createSupplier(formValue)
            .then(response => console.log(response));
        this.toastMessage(this.txtName + ' has been added');
        this.txtName = '';
    }

    toastMessage(msg: string, duration: number = 1000) {
        this.snackBar.openFromComponent(ToastMsgComponent, {
            duration: duration,
            data: msg
        });
    }
}
