import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { PriceListComponent } from './components/price-list/price-list.component';
import { FourOFourComponent } from './components/four-o-four/four-o-four.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierAddComponent } from './components/supplier-add/supplier-add.component';
import { BrandListComponent } from './components/brand-list/brand-list.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';

import { MatButtonModule, MatIconModule, MatCheckboxModule, MatSelectModule, MatAutocompleteModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const config: Routes = [
    { path: '', redirectTo: 'product/list', pathMatch: 'full' },
    { path: 'product/list', component: PriceListComponent },
    { path: 'product/add', component: ProductAddComponent },
    { path: 'product/edit/:id', component: ProductAddComponent },
    { path: 'supplier/list', component: SupplierListComponent },
    { path: 'supplier/add', component: SupplierAddComponent },
    { path: 'brand/list', component: BrandListComponent },
    { path: 'brand/add', component: BrandAddComponent },
    { path: 'category/list', component: CategoryListComponent },
    { path: 'category/add', component: CategoryAddComponent },
    { path: '**', component: FourOFourComponent }
];

@NgModule({
    declarations: [
        FourOFourComponent,
        PriceListComponent,
        ProductAddComponent,
        SupplierListComponent,
        SupplierAddComponent,
        BrandListComponent,
        BrandAddComponent,
        CategoryListComponent,
        CategoryAddComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forRoot(config),
        MatButtonModule, 
        MatCheckboxModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDatatableModule
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {}