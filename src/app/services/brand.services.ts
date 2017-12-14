import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
import { Brand } from '../model/Brand';

@Injectable()

export class BrandServices {
    constructor(private http: Http) {}

    getBrands() {
        const url = environment.domain + '/brand/list';
        return this.http.get(url).toPromise()
            .then(response => response.json() )
            .catch(err => console.log(err.message));
    }

    createBrand(brand: Brand) {
        const url = environment.domain + '/brand/add';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        const body = brand;
        return this.http.post(url, body, { headers } ).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message) );
    }

    updateBrand(brand: Brand) {
        const url = environment.domain + '/brand/edit';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        const body = brand;
        return this.http.post(url, body, { headers } ).toPromise()
            .then()
            .catch(err => console.log(err.message));
    }
}