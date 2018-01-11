import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Product } from '../model/Product';

@Injectable()

export class ProductServices {
    modelUrl: string;
    headers: Headers;

    constructor(private http: Http){
        this.modelUrl = environment.domain + '/product';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'Application/JSON');
    }

    getProduct() {
        const url = this.modelUrl + '/list';
        return this.http.get(url).toPromise()
            .then(response => response.json());
    }

    createProduct(product: Product) {
        const url = this.modelUrl + '/add';
        return this.http.post(url, product, { headers: this.headers }).toPromise()
            .then(response => response.json());
    }

    updateProduct(product: Product) {
        const url = this.modelUrl + '/edit';
        return this.http.post(url, product, { headers: this.headers }).toPromise()
            .then(response => response.json());
    }
}