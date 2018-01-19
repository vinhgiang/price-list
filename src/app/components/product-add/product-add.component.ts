import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { ISupplier } from '../../model/Supplier';
import { IBrand } from '../../model/Brand';
import { ICategory } from '../../model/Category';
import { IProduct, Product } from '../../model/Product';

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

    filteredSuppliers: Observable<ISupplier[]>;

    brandCtrl: FormControl;
    filteredBrands: Observable<IBrand[]>;

    categoryCtrl: FormControl;
    filteredCategories: Observable<ICategory[]>;

    product: IProduct;
    detailId: string;

    suppliers: ISupplier[];
    brand: IBrand;
    category: ICategory;

    subscription: Subscription;

    isValid: Boolean = true;

    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

    constructor(private brandServices: BrandServices, private supplierServices: SupplierServices, private categoryServices: CategoryServices,
        private productServices: ProductServices, private commonServices: CommonServices, private activatedRoute: ActivatedRoute ) {

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
                    this.brandCtrl.setValue(null);
                }
            },
            err => this._subscribeToClosingActions(),
            () => this._subscribeToClosingActions());
    }

    async ngOnInit() {
        const newProduct = new Product();
        this.product = newProduct.product;

        this.activatedRoute.params.subscribe((params: Params) => {
            this.detailId = params['id'];
        });

        if( this.detailId ) {
            const productDetailResponse = await this.productServices.getProduct(this.detailId);
            this.product = productDetailResponse.result[0];

            if( this.product ) {
                this.brand = this.product.brand;
                this.category = this.product.category;
            } else {
                this.isValid = false;
                this.commonServices.toastMessage('Product not found.', 4000);
            }
        }

        if( this.isValid ) {
            const suppliersResponse = await this.supplierServices.getSupplier();
            this.supplierList = suppliersResponse.result;
            
            if ( this.detailId ) {
                this.supplierList.map(s => {
                    this.product.suppliers.forEach(i => {
                        if( s._id === i._id ) {{
                            s.checked = true;
                            return false;
                        }}
                    })
                })
            }

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

        if ( this.detailId && this.isValid ) {
            // update product
            formValue._id = this.product._id;
            this.updateProduct(formValue);
        } else {
            // create new product
            this.createProduct(formValue);
        }
    }

    createProduct(product: IProduct) {
        this.productServices.createProduct(product)
            .then(response => {
                if( response.status == 200 ) {
                    this.commonServices.toastMessage(this.product.name + ' has been added');
                    this.resetForm();
                } else {
                    this.commonServices.toastMessage(response.msg, 3000);
                }
            })
            .catch(error => {
                this.commonServices.toastMessage(error.json().msg, 2000);
            });
    }

    updateProduct(product: IProduct) {
        this.productServices.updateProduct(product)
            .then(response => {
                if( response.status == 200 ) {
                    this.commonServices.toastMessage(this.product.name + ' has been updated');
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
        const newProduct = new Product();
        this.product = newProduct.product;
        this.supplierList.map(s => {
            s.checked = false;
        })
    }
}