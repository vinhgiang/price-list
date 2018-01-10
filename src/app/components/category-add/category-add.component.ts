import { Component, OnInit } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http'
import { CategoryServices } from '../../services/category.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-category-add',
    templateUrl: './category-add.component.html',
    styleUrls: ['./category-add.component.scss'],
    providers: [CategoryServices]
})
export class CategoryAddComponent implements OnInit {

    txtName: string;
    txtEbayAu: string;
    txtEbayUk: string

    constructor(private categoryServices: CategoryServices, private commonServices: CommonServices) { }

    ngOnInit() {}

    onSubmit(formValue) {
        this.categoryServices.createCategory(formValue)
            .then(response => console.log(response))
        this.commonServices.toastMessage(this.txtName + ' has been added');
        this.txtName = '';
        this.txtEbayUk = '';
        this.txtEbayAu = '';
    }

}
