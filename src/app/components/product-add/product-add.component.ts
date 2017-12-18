import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Supplier } from '../../model/Supplier';
import { Brand } from '../../model/Brand';
import { Category } from '../../model/Category';
import { Product } from '../../model/Product';

import { BrandServices } from '../../services/brand.services';
import { SupplierServices } from '../../services/supplier.services';
import { CategoryServices } from '../../services/category.services';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
    providers: [BrandServices, SupplierServices, CategoryServices]
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

    constructor(private http: Http, private brandServices: BrandServices, private supplierServices: SupplierServices, private categoryServices: CategoryServices) {
        this.suplierCtrl = new FormControl();
        this.brandCtrl = new FormControl();
        this.categoryCtrl = new FormControl();
    }

    async ngOnInit() {
        this.suppliers = await this.supplierServices.getSupplier();
        this.filteredSupliers = this.suplierCtrl.valueChanges
            .startWith(null)
            .map(suplier => suplier ? this.filterSupliers(suplier) : this.suppliers.slice());
        
        
        this.brands = await this.brandServices.getBrands();
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brands.slice());

        this.categories = await this.categoryServices.getCategory();
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categories.slice());
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
