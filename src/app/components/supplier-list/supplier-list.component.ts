import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Supplier } from '../../model/Supplier';
import { SupplierServices } from '../../services/supplier.services';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.scss'],
    providers: [SupplierServices]
})
export class SupplierListComponent implements OnInit {
    suppliers: Supplier[];
    rows = [];
    temp = [];
    editing = [];

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private supplierServices: SupplierServices) {}

    ngOnInit() {
        this.supplierServices.getSupplier()
            .then(list => {
                this.suppliers = list;
                this.temp = [...this.suppliers];
                this.rows = this.suppliers;
            })
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

        this.editing[rowIndex + '-' + cell] = false;
        this.suppliers[rowIndex][cell] = newValue;
        this.suppliers = [...this.suppliers];

        this.supplierServices.updateSupplier(this.suppliers[rowIndex]);
    }

}
