import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import { OptionServices } from '../../services/option.services';
import { IOption } from '../../model/Option';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-option-list',
    templateUrl: './option-list.component.html',
    styleUrls: ['./option-list.component.scss'],
    providers: [ CommonServices, OptionServices ]
})
export class OptionListComponent implements OnInit {

    options: IOption[];
    rows = [];
    temp = [];
    editing = {};

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private optionServices: OptionServices, private commonServices: CommonServices) {}

    ngOnInit() {
        this.optionServices.getOption()
            .then(res => {
                this.options = res.result;
                this.temp = [...this.options];
                this.rows = this.options;
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
        let oldValue = this.rows[rowIndex][cell];

        this.editing[rowIndex + '-' + cell] = false;
        this.rows[rowIndex][cell] = newValue;

        this.optionServices.updateOption(this.rows[rowIndex])
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000)
                this.options[rowIndex][cell] = oldValue;
            });
    }

}
