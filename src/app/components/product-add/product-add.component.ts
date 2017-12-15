import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Supplier } from '../../model/Supplier';
import { Brand } from '../../model/Brand';
import { Category } from '../../model/Category';
import { Product } from '../../model/Product';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

    suppliers: Supplier[];
    brands: Brand[];
    categories: Category[];

    suplierCtrl: FormControl;
    filteredSupliers: Observable<Supplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<Brand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<Category[]>;

    constructor(private http: Http) {
        this.suppliers = [
            { _id: '1', name: 'Arkansas', created: new Date() },
            { _id: '2', name: 'California', created: new Date() },
            { _id: '3', name: 'Florida', created: new Date() },
            { _id: '4', name: 'Texas', created: new Date() }
        ];

        this.suplierCtrl = new FormControl();
        this.filteredSupliers = this.suplierCtrl.valueChanges
            .startWith(null)
            .map(suplier => suplier ? this.filterSupliers(suplier) : this.suppliers.slice());

        this.brands = [
            { _id: '1', name: 'Apple', created: new Date() },
            { _id: '2', name: 'Samsung', created: new Date() },
            { _id: '3', name: 'HTC', created: new Date() },
            { _id: '4', name: 'Sony', created: new Date() },
            { _id: '5', name: 'Xiaomi', created: new Date() },
            { _id: '6', name: 'Huawei', created: new Date() },
        ];

        this.brandCtrl = new FormControl();
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brands.slice());

        this.categories = [
            { _id: '1', name: 'Mobile', ebay_au: 'Mobile AU', ebay_uk: 'Mobile UK', created: new Date() },
            { _id: '2', name: 'Wearable', ebay_au: 'Wearable AU', ebay_uk: 'Wearable UK', created: new Date() },
            { _id: '3', name: 'Laptop', ebay_au: 'Laptop AU', ebay_uk: 'Laptop UK', created: new Date() },
            { _id: '4', name: 'Camera', ebay_au: 'Camera AU', ebay_uk: 'Camera UK', created: new Date() },
            { _id: '5', name: 'PC', ebay_au: 'PC AU', ebay_uk: 'PC UK', created: new Date() }
        ];

        this.categoryCtrl = new FormControl();
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categories.slice());
    }

    ngOnInit() {
        // this.http.get('https://jsonplaceholder.typicode.com/photos').toPromise()
        // .then(Response => {
        //     return this.suppliers = Response.json()
        // })
        // .catch(err => console.log(err.message));
    }

    filterSupliers(name: string) {
        return this.suppliers.filter(suplier => suplier.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBrands(name: string) {
        return this.brands.filter(brand => brand.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterCategories(name: string) {
        return this.categories.filter(category => category.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

}
