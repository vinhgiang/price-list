import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { ISupplier } from '../../model/Supplier';
import { IBrand } from '../../model/Brand';
import { ICategory } from '../../model/Category';

import { BrandServices } from '../../services/brand.services';
import { SupplierServices } from '../../services/supplier.services';
import { CategoryServices } from '../../services/category.services';
import { ProductServices } from '../../services/product.services';

import { MatAutocompleteTrigger } from '@angular/material';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { CommonServices } from '../../services/common.services';

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss'],
    providers: [BrandServices, SupplierServices, CategoryServices, ProductServices, CommonServices]
})
export class ProductAddComponent implements OnInit {

    supplierList: ISupplier[];
    brandList: IBrand[];
    categorieList: ICategory[];

    supplierCtrl: FormControl;
    filteredSuppliers: Observable<ISupplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<IBrand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<ICategory[]>;

    sku: string;
    name: string;
    description: string;
    suppliers: ISupplier[];
    brand: string;
    category: string;
    price: number[];

    subscription: Subscription;

    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

    constructor(private brandServices: BrandServices, private supplierServices: SupplierServices, private categoryServices: CategoryServices,
        private productServices: ProductServices, private commonServices: CommonServices, private formBuilder: FormBuilder ) {

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
                }
            },
            err => this._subscribeToClosingActions(),
            () => this._subscribeToClosingActions());
    }

    async ngOnInit() {
        const suppliersResponse = await this.supplierServices.getSupplier();
        this.supplierList = suppliersResponse.result;
        // this.filteredSuppliers = this.supplierCtrl.valueChanges
        //     .startWith(null)
        //     .map(supplier => supplier ? this.filterSuppliers(supplier) : this.supplierList.slice());

        const brandRespone = await this.brandServices.getBrands();
        this.brandList = brandRespone.result;
        this.filteredBrands = this.brandCtrl.valueChanges
            .startWith(null)
            .map(brand => brand ? this.filterBrands(brand) : this.brandList.slice());

        const categoryResponse = await this.categoryServices.getCategory();
        this.categorieList = categoryResponse.result;
        this.filteredCategories = this.categoryCtrl.valueChanges
            .startWith(null)
            .map(category => category ? this.filterCategories(category) : this.categorieList.slice());
    }

    filterSuppliers(supplier: ISupplier | string) {
        const supplierName = typeof supplier === 'object' ? supplier.name : supplier;
        return this.supplierList.filter(supplier => supplier.name.toLowerCase().indexOf(supplierName.toLowerCase()) === 0);
    }

    filterBrands(brand: IBrand) {
        const brandName = typeof brand === 'object' ? brand.name : brand;
        return this.brandList.filter(brand => brand.name.toLowerCase().indexOf(brandName.toLowerCase()) === 0);
    }

    filterCategories(category: ICategory) {
        const categoryName = typeof category === 'object' ? category.name : category;
        return this.categorieList.filter(category => category.name.toLowerCase().indexOf(categoryName.toLowerCase()) === 0);
    }

    onSubmit(formValue) {
        formValue.brand = this.brand;
        formValue.category = this.category;

        let selectedSuppliers = this.supplierList.filter(e => e.checked == true);
        formValue.suppliers = selectedSuppliers;

        this.productServices.createProduct(formValue)
            .then(response => {
                if( response.status == 200 ) {
                    this.commonServices.toastMessage(this.name + ' has been added');
                    this.resetForm();
                } else {
                    this.commonServices.toastMessage(response.msg, 3000);
                }
            })
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000);
            });
    }

    displayValue(obj: any): string {
        return obj ? obj.name : '';
    }

    // onSelectedSupplier(event: MatAutocompleteSelectedEvent): void {
    //     this.supplier = event.option.value._id;
    //     this.supplierCtrl.setValue(event.option.value);
    // }

    onSelectedBrand(event: MatAutocompleteSelectedEvent): void {
        this.brand = event.option.value._id;
        this.brandCtrl.setValue(event.option.value);
    }

    onSelectedCategory(event: MatAutocompleteSelectedEvent): void {
        this.category = event.option.value._id;
        this.categoryCtrl.setValue(event.option.value);
    }

    resetForm() {
        this.sku = '';
        this.name = '';
        this.supplierList.map(e => e.checked = false);
        this.supplierCtrl.setValue('');
        this.brand = '';
        this.brandCtrl.setValue('');
        this.category = '';
        this.categoryCtrl.setValue('');
        this.description = '';
    }
}