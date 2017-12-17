import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Supplier } from '../model/Supplier'

@Injectable()

export class SupplierServices {
    constructor(private http: Http) {}

    getSupplier() {
        const url = environment.domain + '/supplier/list';
        return this.http.get(url).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }

    createSupplier(supplier: Supplier) {
        const url = environment.domain + '/supplier/add';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        return this.http.post(url, supplier, { headers }).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }

    updateSupplier(supplier: Supplier) {
        const url = environment.domain + '/supplier/edit';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        return this.http.post(url, supplier, { headers }).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }
}