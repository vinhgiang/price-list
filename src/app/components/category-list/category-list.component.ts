import { Component, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Category } from '../../model/Category';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
    categories: Category[];
    rows = [];
    temp = [];
    editing = {};

    columns = [
        { name: 'ID', prop: '_id', maxWidth: 50 },
        { name: 'Name' },
        { name: 'eBay AU', prop: 'ebay_au' },
        { name: 'eBay UK', prop: 'ebay_uk' }
    ];
    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor() {
        this.categories = [
            { _id: '1', name: 'Mobile', ebay_au: 'Mobile AU', ebay_uk: 'Mobile UK' },
            { _id: '2', name: 'Wearable', ebay_au: 'Wearable AU', ebay_uk: 'Wearable UK' },
            { _id: '3', name: 'Laptop', ebay_au: 'Laptop AU', ebay_uk: 'Laptop UK' },
            { _id: '4', name: 'Camera', ebay_au: 'Camera AU', ebay_uk: 'Camera UK' },
            { _id: '5', name: 'PC', ebay_au: 'PC AU', ebay_uk: 'PC UK' }
        ];
        this.temp = [...this.categories];
        this.rows = this.categories;
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
        
        this.categories[rowIndex][cell] = newValue;

        this.categories = [...this.categories];
        console.log('UPDATED!', this.categories[rowIndex][cell]);
    }
}
