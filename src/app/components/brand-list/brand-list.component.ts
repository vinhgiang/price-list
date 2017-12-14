import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Brand } from '../../model/Brand';
import { Http, Headers } from '@angular/http';
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

    constructor(private http: Http, private brandServices: BrandServices) {
        // this.brands = [
        //     { _id: '1', name: 'Apple' },
        //     { _id: '2', name: 'Samsung' },
        //     { _id: '3', name: 'HTC' },
        //     { _id: '4', name: 'Sony' },
        //     { _id: '5', name: 'Xiaomi' },
        //     { _id: '6', name: 'Huawei' },
        // ];
        // this.temp = [...this.brands];
        // this.rows = this.brands;
    }

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
        console.log('inline editing rowIndex', rowIndex)
        this.editing[rowIndex + '-' + cell] = false;
        let newValue = event.target.value;

        this.brands[rowIndex][cell] = newValue;

        this.brands = [...this.brands];
        console.log('UPDATED!', this.brands[rowIndex][cell]);

        this.brandServices.updateBrand(this.brands[rowIndex]);
    }

}
