import { Component, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Supplier } from '../../model/Supplier';

@Component({
    selector: 'app-supplier-list',
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent {
    suppliers: Supplier[];
    rows = [];
    temp = [];
    editing = [];

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor() {
        this.suppliers = [
            { _id: '1', name: 'Tenosis', created: new Date() },
            { _id: '2', name: 'Subic', created: new Date() },
            { _id: '3', name: 'Fante', created: new Date() },
            { _id: '4', name: 'Pyrolium', created: new Date() },
            { _id: '5', name: 'Yadel', created: new Date() },
            { _id: '6', name: 'Diare', created: new Date() },
            { _id: '7', name: 'Audoid', created: new Date() },
            { _id: '8', name: 'Inist', created: new Date() }
        ];
        this.temp = [...this.suppliers];
        this.rows = this.suppliers;
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
        console.log('inline editing rowIndex', rowIndex)
        this.editing[rowIndex + '-' + cell] = false;
        let newValue = event.target.value;
        
        this.suppliers[rowIndex][cell] = newValue;

        this.suppliers = [...this.suppliers];
        console.log('UPDATED!', this.suppliers[rowIndex][cell]);
    }

}
