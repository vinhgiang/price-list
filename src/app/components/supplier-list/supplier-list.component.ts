import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ISupplier } from '../../model/Supplier';
import { SupplierServices } from '../../services/supplier.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.scss'],
    providers: [SupplierServices, CommonServices]
})
export class SupplierListComponent implements OnInit {
    suppliers: ISupplier[];
    rows = [];
    temp = [];
    editing = [];

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private supplierServices: SupplierServices, private commonServices: CommonServices) {}

    ngOnInit() {
        this.supplierServices.getSupplier()
            .then(res => {
                this.suppliers = res.result;
                this.temp = [...this.suppliers];
                this.rows = this.suppliers;
            })
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg);
            });
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || ! val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    updateValue(event, cell, rowIndex) {
        let newValue = event.target.value;
        let oldValue = this.rows[rowIndex][cell];

        this.editing[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = newValue;

        this.supplierServices.updateSupplier(this.rows[rowIndex])
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000)
                this.rows[rowIndex][cell] = oldValue;
            });
    }

}
