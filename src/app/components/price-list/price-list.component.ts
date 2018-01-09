import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Supplier } from '../../model/Supplier';
import { IBrand } from '../../model/Brand';
import { Category } from '../../model/Category';
import { Product } from '../../model/Product';

import { BrandServices } from '../../services/brand.services';
import { SupplierServices } from '../../services/supplier.services';
import { CategoryServices } from '../../services/category.services';
import { ProductServices } from '../../services/product.services';

import { MatSnackBar, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material'
import { ToastMsgComponent } from '../../shared/toast-msg/toast-msg.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss'],
    providers: [BrandServices, SupplierServices, CategoryServices, ProductServices]
})
export class PriceListComponent implements OnInit {
    suppliers: Supplier[];
    brands: IBrand[];
    categories: Category[];

    supplierCtrl: FormControl;
    filteredSuppliers: Observable<Supplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<IBrand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<Category[]>;

    products: Product[];
    rows = [];
    temp = [];
    editing = [];

    sku: string;
    name: string;
    description: string;
    supplier: string;
    brand: string;
    category: string;
    price: number;

    subscription: Subscription;

    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

    constructor(private brandServices: BrandServices, private supplierServices: SupplierServices, private categoryServices: CategoryServices,
        private productServices: ProductServices, private snackBar: MatSnackBar) {

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

                    this.supplier = '';
                    this.brand = '';
                    this.category = '';
                }
            },
            err => this._subscribeToClosingActions(),
            () => this._subscribeToClosingActions());
    }

    async ngOnInit() {
        this.suppliers = await this.supplierServices.getSupplier();
        this.filteredSuppliers = this.supplierCtrl.valueChanges
            .startWith(null)
            .map(supplier => supplier ? this.filterSuppliers(supplier) : this.suppliers.slice());


        this.brands = await this.brandServices.getBrands();
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brands.slice());

        this.categories = await this.categoryServices.getCategory();
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categories.slice());

        this.productServices.getProduct()
            .then(list => {
                this.products = list;
                this.temp = [...this.products];
                this.rows = this.products;
            })
    }

    filterSuppliers(supplier: Supplier | string) {
        const supplierName = typeof supplier === 'object' ? supplier.name : supplier;
        return this.suppliers.filter(supplier => supplier.name.toLowerCase().indexOf(supplierName.toLowerCase()) === 0);
    }

    filterBrands(brand: IBrand) {
        const brandName = typeof brand === 'object' ? brand.name : brand;
        return this.brands.filter(brand => brand.name.toLowerCase().indexOf(brandName.toLowerCase()) === 0);
    }

    filterCategories(category: Category) {
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

    toastMessage(msg: string, duration: number = 1000) {
        this.snackBar.openFromComponent(ToastMsgComponent, {
            duration: duration,
            data: msg
        });
    }

    searchProduct() {
        const searchBrand = this.brand;
        const searchCategory = this.category;
        const searchSupplier = this.supplier;
        const searchSku = this.sku;

        if ( searchBrand || searchCategory || searchSupplier || searchSku ) {
            const temp = this.temp.filter(function (p: Product) {

                let isCorrect = true;

                if ( searchSupplier ) {
                    isCorrect = isCorrect && p.supplier._id == searchSupplier;
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
            this.toastMessage('Please give me a condition to search.');
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
        let curValue = this.products[rowIndex][cell];
        let newValue = event.target.value;
        if(cell == 'category') {
            let selectedNewCategory = this.categories.filter(category => category._id == newValue)[0];
            newValue = selectedNewCategory;
        } else if (cell == 'brand') {
            let selectedNewBrand = this.brands.filter(brand => brand._id == newValue)[0];
            newValue = selectedNewBrand;
        }

        this.products[rowIndex][cell] = newValue;

        const updateStatus = await this.productServices.updateProduct(this.products[rowIndex]);
        if( updateStatus.status != 1 ) {
            
            this.products[rowIndex][cell] = curValue;
            this.toastMessage(updateStatus.error, 3000);
        }
    }

    onSelect({ selected }) {
        console.log('Select Event', selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }

}
