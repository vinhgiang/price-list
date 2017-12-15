import { Component, OnInit } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http'
import { CategoryServices } from '../../services/category.services';
import { MatSnackBar } from '@angular/material'
import { ToastMsgComponent } from '../../shared/toast-msg/toast-msg.component';

@Component({
    selector: 'app-category-add',
    templateUrl: './category-add.component.html',
    styleUrls: ['./category-add.component.scss'],
    providers: [CategoryServices]
})
export class CategoryAddComponent implements OnInit {

    txtName: string;
    txtEbayAu: string;
    txtEbayUk: string

    constructor(private categoryServices: CategoryServices, private snackBar: MatSnackBar) { }

    ngOnInit() {}

    onSubmit(formValue) {
        this.categoryServices.createCategory(formValue)
            .then(response => console.log(response))
        this.toastMessage(this.txtName + ' has been added');
        this.txtName = '';
        this.txtEbayUk = '';
        this.txtEbayAu = '';
    }

    toastMessage(msg: string, duration: number = 1000) {
        this.snackBar.openFromComponent(ToastMsgComponent, {
            duration: duration,
            data: msg
        });
    }

}
