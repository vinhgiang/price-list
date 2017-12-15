import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Category } from '../model/Category';

@Injectable()

export class CategoryServices {
    constructor(private http: Http) {}

    getCategory() {
        const url = environment.domain + '/category/list';
        return this.http.get(url).toPromise()
            .then(result => result.json())
            .catch(err => console.log(err));
    }

    createCategory(category: Category) {
        const url = environment.domain + '/category/add';
        const headers = new Headers();
        headers.append('Content-Type', 'Application/JSON');
        const body = category;
        return this.http.post(url, body, { headers } ).toPromise()
            .then(response => response.json())
            .catch(err => console.log(err.message));
    }
}