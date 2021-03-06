import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { IBrand } from '../model/Brand';

@Injectable()

export class BrandServices {
    modelUrl: string;
    headers: Headers;

    constructor(private http: Http) {
        this.modelUrl = environment.domain + '/brand';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'Application/JSON');
    }

    getBrands() {
        const url = this.modelUrl + '/list';
        return this.http.get(url).toPromise()
            .then(response => response.json());
    }

    createBrand(brand: IBrand) {
        const url = this.modelUrl + '/add';
        return this.http.post(url, brand, { headers: this.headers } ).toPromise()
            .then(response => response.json());
    }

    updateBrand(brand: IBrand) {
        const url = this.modelUrl + '/edit';
        return this.http.post(url, brand, { headers: this.headers } ).toPromise()
            .then(response => response.json())
    }
}