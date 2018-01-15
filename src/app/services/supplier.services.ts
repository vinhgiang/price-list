import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { ISupplier } from '../model/Supplier'

@Injectable()

export class SupplierServices {
    modelUrl: string;
    headers: Headers;

    constructor(private http: Http) {
        this.modelUrl = environment.domain + '/supplier';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'Application/JSON');
    }

    getSupplier() {
        const url = this.modelUrl + '/list';
        return this.http.get(url).toPromise()
            .then(response => response.json());
    }

    createSupplier(supplier: ISupplier) {
        const url = this.modelUrl + '/add';
        return this.http.post(url, supplier, { headers: this.headers }).toPromise()
            .then(response => response.json());
    }

    updateSupplier(supplier: ISupplier) {
        const url = this.modelUrl + '/edit';
        return this.http.post(url, supplier, { headers: this.headers }).toPromise()
            .then(response => response.json());
    }
}