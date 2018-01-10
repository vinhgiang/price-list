import { Component, OnInit } from '@angular/core';
import { SupplierServices } from '../../services/supplier.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-supplier-add',
    templateUrl: './supplier-add.component.html',
    styleUrls: ['./supplier-add.component.scss'],
    providers: [SupplierServices, CommonServices]
})
export class SupplierAddComponent implements OnInit {

    txtName: string;

    constructor(private supplierServices: SupplierServices, private commonServices: CommonServices) { }

    ngOnInit() {}

    onSubmit(formValue) {
        this.supplierServices.createSupplier(formValue)
            .then(response => console.log(response));
        this.commonServices.toastMessage(this.txtName + ' has been added');
        this.txtName = '';
    }
}
