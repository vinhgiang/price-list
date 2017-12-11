import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class BrandServices {
    constructor(private http: Http) {}

    getList() {
        const url = 'http://localhost:3000/brand/list';
        return this.http.get(url).toPromise()
            .then(Response => Response.json() )
            .catch(err => console.log(err.message));
    }
}