import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { ICategory } from '../model/Category';

@Injectable()

export class CategoryServices {
    modelUrl: string;
    headers: Headers;

    constructor(private http: Http) {
        this.modelUrl = environment.domain + '/category';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'Application/JSON');
    }

    getCategory() {
        const url = this.modelUrl + '/list';
        return this.http.get(url).toPromise()
            .then(result => result.json());
    }

    createCategory(category: ICategory) {
        const url = this.modelUrl + '/add';
        const body = category;
        return this.http.post(url, body, { headers: this.headers } ).toPromise()
            .then(response => response.json());
    }

    updateCategory(category: ICategory) {
        const url = this.modelUrl + '/edit';
        const body = category;
        return this.http.post(url, body, { headers: this.headers } ).toPromise()
            .then(response => response.json());
    }
}