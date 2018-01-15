import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ICategory } from '../../model/Category';
import { CategoryServices } from '../../services/category.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
    providers: [CategoryServices, CommonServices]
})
export class CategoryListComponent implements OnInit {
    categories: ICategory[];
    rows = [];
    temp = [];
    editing = {};

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private categoryServices: CategoryServices, private commonServices: CommonServices) {}

    ngOnInit() {
        this.categoryServices.getCategory()
            .then(res => {
                this.categories = res.result;
                this.temp = [...this.categories];
                this.rows = this.categories;
            })
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg);
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
        let oldValue = this.categories[rowIndex][cell];

        this.editing[rowIndex + '-' + cell] = false;
        this.categories[rowIndex][cell] = newValue;

        this.categoryServices.updateCategory(this.categories[rowIndex])
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000)
                this.categories[rowIndex][cell] = oldValue;
            });

        this.categories = [...this.categories];
    }
}
