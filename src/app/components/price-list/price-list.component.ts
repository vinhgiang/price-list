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
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
    suppliers: Supplier[];
    brands: Brand[];
    categories: Category[];

    suplierCtrl: FormControl;
    filteredSupliers: Observable<Supplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<Brand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<Category[]>;

    columns = [
        { name: 'SKU' },
        { name: 'Name' },
        { name: 'Description' },
        { name: 'Category', prop: 'category.name' },
        { name: 'Brand', prop: 'brand.name' },
        { name: 'Price' },
        { name: 'Last Update', prop: 'last_update' },
    ];
    products: Product[];
    editing = {};

    constructor(private http: Http) {
        this.suppliers = [
            { _id: '1', name: 'Arkansas' },
            { _id: '2', name: 'California' },
            { _id: '3', name: 'Florida' },
            { _id: '4', name: 'Texas' }
        ];

        this.suplierCtrl = new FormControl();
        this.filteredSupliers = this.suplierCtrl.valueChanges
            .startWith(null)
            .map(suplier => suplier ? this.filterSupliers(suplier) : this.suppliers.slice());

        this.brands = [
            { _id: '1', name: 'Apple' },
            { _id: '2', name: 'Samsung' },
            { _id: '3', name: 'HTC' },
            { _id: '4', name: 'Sony' },
            { _id: '5', name: 'Xiaomi' },
            { _id: '6', name: 'Huawei' },
        ];

        this.brandCtrl = new FormControl();
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brands.slice());

        this.categories = [
            { _id: '1', name: 'Mobile', ebay_au: 'Mobile AU', ebay_uk: 'Mobile UK' },
            { _id: '2', name: 'Wearable', ebay_au: 'Wearable AU', ebay_uk: 'Wearable UK' },
            { _id: '3', name: 'Laptop', ebay_au: 'Laptop AU', ebay_uk: 'Laptop UK' },
            { _id: '4', name: 'Camera', ebay_au: 'Camera AU', ebay_uk: 'Camera UK' },
            { _id: '5', name: 'PC', ebay_au: 'PC AU', ebay_uk: 'PC UK' }
        ];

        this.categoryCtrl = new FormControl();
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categories.slice());

        this.products = [
            { _id: '1', sku: 'SKU-1', name: 'Product 1', description: 'This is product 1', category: this.categories[0], brand: this.brands[1], price: 168, last_update: new Date('2017/11/26') },
            { _id: '2', sku: 'SKU-2', name: 'Product 2', description: 'This is product 2', category: this.categories[1], brand: this.brands[5], price: 169, last_update: new Date('2017/11/26') },
            { _id: '3', sku: 'SKU-3', name: 'Product 3', description: 'This is product 3', category: this.categories[2], brand: this.brands[1], price: 160, last_update: new Date('2017/11/26') },
            { _id: '4', sku: 'SKU-4', name: 'Product 4', description: 'This is product 4', category: this.categories[3], brand: this.brands[5], price: 171, last_update: new Date('2017/11/26') },
            { _id: '5', sku: 'SKU-5', name: 'Product 5', description: 'This is product 5', category: this.categories[4], brand: this.brands[2], price: 172, last_update: new Date('2017/11/26') },
            { _id: '6', sku: 'SKU-6', name: 'Product 6', description: 'This is product 6', category: this.categories[3], brand: this.brands[3], price: 173, last_update: new Date('2017/11/26') },
            { _id: '7', sku: 'SKU-7', name: 'Product 7', description: 'This is product 7', category: this.categories[3], brand: this.brands[4], price: 174, last_update: new Date('2017/11/26') }
        ];
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

    updateValue(event, cell, rowIndex) {
        console.log('inline editing rowIndex', rowIndex)
        this.editing[rowIndex + '-' + cell] = false;
        let newValue = event.target.value;
        if(cell == 'category') {
            let selectedNewCategory = this.categories.filter(category => category._id == newValue)[0];
            newValue = selectedNewCategory;
        } else if (cell == 'brand') {
            let selectedNewBrand = this.brands.filter(brand => brand._id == newValue)[0];
            newValue = selectedNewBrand;
        }
        
        this.products[rowIndex][cell] = newValue;

        this.products = [...this.products];
        console.log('UPDATED!', this.products[rowIndex][cell]);
    }

    onSelect({ selected }) {
        console.log('Select Event', selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

}
