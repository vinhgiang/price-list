import { Component, OnInit } from '@angular/core';
import { BrandServices } from '../../services/brand.services';
import { Http, HttpModule, Headers } from '@angular/http';

@Component({
    selector: 'app-brand-add',
    templateUrl: './brand-add.component.html',
    styleUrls: ['./brand-add.component.scss'],
    providers: [ BrandServices ]
})
export class BrandAddComponent implements OnInit {

    txtName: String = '';

    constructor(private http: Http, private BrandServices: BrandServices) { }

    ngOnInit() {
    }

    onSubmit(formValue) {
        this.BrandServices.createBrand(formValue)
            .then(response => console.log(response));
        this.txtName = '';
    }

}
