import { Component, OnInit } from '@angular/core';
import { BrandServices } from '../../services/brand.services';
import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-brand-add',
    templateUrl: './brand-add.component.html',
    styleUrls: ['./brand-add.component.scss'],
    providers: [ BrandServices, CommonServices ]
})
export class BrandAddComponent implements OnInit {

    txtName: String = '';

    constructor(private BrandServices: BrandServices, private commonServices: CommonServices) { }

    ngOnInit() {}

    onSubmit(formValue) {
        this.BrandServices.createBrand(formValue)
            .then(response => console.log(response));
        this.commonServices.toastMessage(this.txtName + ' has been added!');
        this.txtName = '';
    }

}
