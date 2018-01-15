import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { ISupplier } from '../../model/Supplier';
import { IBrand } from '../../model/Brand';
import { ICategory } from '../../model/Category';
import { IProduct } from '../../model/Product';

import { BrandServices } from '../../services/brand.services';
import { SupplierServices } from '../../services/supplier.services';
import { CategoryServices } from '../../services/category.services';
import { ProductServices } from '../../services/product.services';

import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material'
import { Subscription } from 'rxjs/Subscription';

import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss'],
    providers: [BrandServices, SupplierServices, CategoryServices, ProductServices, CommonServices]
})
export class PriceListComponent implements OnInit {
    suppliers: ISupplier[];
    brands: IBrand[];
    categories: ICategory[];

    supplierCtrl: FormControl;
    filteredSuppliers: Observable<ISupplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<IBrand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<ICategory[]>;

    products: IProduct[];
    rows = [];
    temp = [];
    editing = [];

    sku: string;
    name: string;
    description: string;
    supplier: ISupplier;
    brand: string;
    category: string;
    price: number;

    subscription: Subscription;

    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

    constructor(private brandServices: BrandServices, private supplierServices: SupplierServices, private categoryServices: CategoryServices,
        private productServices: ProductServices, private commonServices: CommonServices) {

        this.supplierCtrl = new FormControl();
        this.brandCtrl = new FormControl();
        this.categoryCtrl = new FormControl();
    }

    ngAfterViewInit() {
        this._subscribeToClosingActions();
    }

    ngOnDestroy() {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    private _subscribeToClosingActions(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.trigger.panelClosingActions
            .subscribe(e => {
                if (!e || !e.source) {
                    this.supplierCtrl.setValue(null);
                    this.brandCtrl.setValue(null);
                    this.categoryCtrl.setValue(null);

                    this.supplier = null;
                    this.brand = '';
                    this.category = '';
                }
            },
            err => this._subscribeToClosingActions(),
            () => this._subscribeToClosingActions());
    }

    async ngOnInit() {
        const suppliersResponse = await this.supplierServices.getSupplier();
        this.suppliers = suppliersResponse.result;
        this.filteredSuppliers = this.supplierCtrl.valueChanges
            .startWith(null)
            .map(supplier => supplier ? this.filterSuppliers(supplier) : this.suppliers.slice());

        const brandRespone = await this.brandServices.getBrands();
        this.brands = brandRespone.result;
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brands.slice());

        const categoryResponse = await this.categoryServices.getCategory();
        this.categories = categoryResponse.result;
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categories.slice());

        this.productServices.getProduct()
            .then(res => {
                this.products = res.result;
                this.temp = [...this.products];
                this.rows = this.products;
            })
    }

    filterSuppliers(supplier: ISupplier | string) {
        const supplierName = typeof supplier === 'object' ? supplier.name : supplier;
        return this.suppliers.filter(supplier => supplier.name.toLowerCase().indexOf(supplierName.toLowerCase()) === 0);
    }

    filterBrands(brand: IBrand) {
        const brandName = typeof brand === 'object' ? brand.name : brand;
        return this.brands.filter(brand => brand.name.toLowerCase().indexOf(brandName.toLowerCase()) === 0);
    }

    filterCategories(category: ICategory) {
        const categoryName = typeof category === 'object' ? category.name : category;
        return this.categories.filter(category => category.name.toLowerCase().indexOf(categoryName.toLowerCase()) === 0);
    }

    onSubmit(formValue) {
        
    }

    displayValue(obj: any): string {
        return obj ? obj.name : '';
    }

    onSelectedSupplier(event: MatAutocompleteSelectedEvent): void {
        this.supplier = event.option.value._id;
        this.supplierCtrl.setValue(event.option.value);
    }

    onSelectedBrand(event: MatAutocompleteSelectedEvent): void {
        this.brand = event.option.value._id;
        this.brandCtrl.setValue(event.option.value);
    }

    onSelectedCategory(event: MatAutocompleteSelectedEvent): void {
        this.category = event.option.value._id;
        this.categoryCtrl.setValue(event.option.value);
    }

    searchProduct() {
        const searchBrand = this.brand;
        const searchCategory = this.category;
        const searchSupplier = this.supplier;
        const searchSku = this.sku;

        if ( searchBrand || searchCategory || searchSupplier || searchSku ) {
            const temp = this.temp.filter(function (p: IProduct) {

                let isCorrect = true;

                if ( searchSupplier ) {
                    isCorrect = p.suppliers.some(e => e == searchSupplier);
                }
                if ( searchBrand ) {
                    isCorrect = isCorrect && p.brand._id == searchBrand;
                }
                if ( searchCategory ) {
                    isCorrect = isCorrect && p.category._id == searchCategory;
                }
                if ( searchSku ) {
                    isCorrect = isCorrect && p.sku == searchSku;
                }

                return isCorrect;                
            });

            // update the rows
            this.rows = temp;
        } else {
            this.commonServices.toastMessage('Please give me a condition to search.');
        }
    }

    reset() {
        this.rows = this.products;
        
        this.supplierCtrl.setValue(null);
        this.brandCtrl.setValue(null);
        this.categoryCtrl.setValue(null);
        this.sku = '';
    }

    async updateValue(event, cell, rowIndex) {
        this.editing[rowIndex + '-' + cell] = false;
        let oldValue = this.products[rowIndex][cell];
        let newValue = event.target.value;

        if(cell == 'category') {
            let selectedNewCategory = this.categories.filter(category => category._id == newValue)[0];
            newValue = selectedNewCategory;
        } else if (cell == 'brand') {
            let selectedNewBrand = this.brands.filter(brand => brand._id == newValue)[0];
            newValue = selectedNewBrand;
        }

        this.products[rowIndex][cell] = newValue;

        const updateStatus = await this.productServices.updateProduct(this.products[rowIndex])
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000)
                this.products[rowIndex][cell] = oldValue;
            });
    }

    onSelect({ selected }) {
        console.log('Select Event', selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

}
