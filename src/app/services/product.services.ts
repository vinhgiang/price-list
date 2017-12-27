import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Product } from '../model/Product';

@Injectable()

export class ProductServices {
    constructor(private http: Http){}

    getProduct() {
        const url = environment.domain + '/product/list';
        return this.http.get(url).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }

    createProduct(product: Product) {
        const url = environment.domain + '/product/add';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        return this.http.post(url, product, { headers }).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }

    updateProduct(product: Product) {
        const url = environment.domain + '/product/edit';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        return this.http.post(url, product, { headers }).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }
}