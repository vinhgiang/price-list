import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Brand } from '../../model/Brand';
import { BrandServices } from '../../services/brand.services';

@Component({
    selector: 'app-brand-list',
    templateUrl: './brand-list.component.html',
    styleUrls: ['./brand-list.component.scss'],
    providers: [BrandServices]
})
export class BrandListComponent implements OnInit {

    brands: Brand[];
    rows = [];
    temp = [];
    editing = [];

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private brandServices: BrandServices) {}
    
    ngOnInit() {
        this.brandServices.getBrands()
            .then(list => {
                this.brands = list;
                this.temp = [...this.brands];
                this.rows = this.brands;
            })
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    updateValue(event, cell, rowIndex) {
        let newValue = event.target.value;

        this.editing[rowIndex + '-' + cell] = false;
        this.brands[rowIndex][cell] = newValue;
        this.brands = [...this.brands];

        this.brandServices.updateBrand(this.brands[rowIndex]);
    }

}
