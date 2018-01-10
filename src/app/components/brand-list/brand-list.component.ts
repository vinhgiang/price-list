import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { IBrand } from '../../model/Brand';
import { BrandServices } from '../../services/brand.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-brand-list',
    templateUrl: './brand-list.component.html',
    styleUrls: ['./brand-list.component.scss'],
    providers: [BrandServices, CommonServices]
})
export class BrandListComponent implements OnInit {

    brands: IBrand[];
    rows = [];
    temp = [];
    editing = [];

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private brandServices: BrandServices, private commonService: CommonServices) {}
    
    ngOnInit() {
        this.brandServices.getBrands()
            .then(res => {
                this.brands = res.result;
                this.temp = [...this.brands];
                this.rows = this.brands;
            })
            .catch(error => {
                this.commonService.toastMessage(error.json().msg);
            });
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
        let oldValue = this.brands[rowIndex][cell];

        this.editing[rowIndex + '-' + cell] = false;
        
        this.brands[rowIndex][cell] = newValue;

        this.brandServices.updateBrand(this.brands[rowIndex])
            .catch(error => {
                this.commonService.toastMessage(error.json().msg, 2000)
                this.brands[rowIndex][cell] = oldValue;
            });

        this.brands = [...this.brands];
    }

}
