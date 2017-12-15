import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Category } from '../../model/Category';
import { CategoryServices } from '../../services/category.services';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
    providers: [CategoryServices]
})
export class CategoryListComponent implements OnInit {
    categories: Category[];
    rows = [];
    temp = [];
    editing = {};

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private categoryServices: CategoryServices) {
    }

    ngOnInit() {
        this.categoryServices.getCategory()
            .then(result => {
                this.categories = result;
                this.temp = [...this.categories];
                this.rows = this.categories;
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
        console.log('inline editing rowIndex', rowIndex)
        this.editing[rowIndex + '-' + cell] = false;
        let newValue = event.target.value;
        
        this.categories[rowIndex][cell] = newValue;

        this.categories = [...this.categories];
        console.log('UPDATED!', this.categories[rowIndex][cell]);
    }
}
