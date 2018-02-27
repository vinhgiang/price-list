import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpModule, Http, Headers } from '@angular/http';
import { IOption } from '../model/Option';

@Injectable()

export class OptionServices {
    modelUrl: String;
    headers: Headers;

    constructor(private http: Http) {
        this.modelUrl = environment.domain + '/option';
        this.headers = new Headers();
        this.headers.append( 'Content-Type', 'Application/JSON' );
    }

    getOption() {
        const url = this.modelUrl + '/list';
        return this.http.get( url ).toPromise()
        .then(response => response.json());
    }

    updateOption(option: IOption) {
        const url = this.modelUrl + '/edit';
        return this.http.post( url, option, { headers: this.headers } ).toPromise()
            .then( response => response.json() )
    }
}