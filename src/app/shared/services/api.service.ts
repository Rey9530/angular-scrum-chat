import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    private apiToken:string='';
    private httpOptions: any;

    setTokenApi(token:string) {
        this.apiToken= token;  
    }

    get getTokenApi() {
        return this.apiToken;
    }

    setContentType(encoded: boolean = false) {
        let data;  
        if(!encoded && (  this.apiToken!=undefined && this.apiToken.length>0)){
            data = { 'Content-Type': 'application/json','x-access-token': this.apiToken   }  
        }else if(encoded && (  this.apiToken!=undefined && this.apiToken.length>0)){
            data = { 'Content-Type': 'application/x-www-form-urlencoded','x-access-token': this.apiToken   } 
            console.log(65456)
        }else if(encoded  ){
            data = { 'Content-Type': 'application/x-www-form-urlencoded'    } 
        }else { 
            data = { 'Content-Type': 'application/json' }
        }  
        this.httpOptions = { headers : new HttpHeaders( data ) }
    }

    get(path: string): Observable<any> {
        this.setContentType(); 
        return this.http.get(path, this.httpOptions).pipe(catchError(this.formatErrors));
    }
    
    delete(path: string): Observable<any> {
        this.setContentType(); 
        return this.http.delete(path, this.httpOptions).pipe(catchError(this.formatErrors));
    }

    getBlob(path: string): Observable<any> {
        return this.http.get<any>(path, { observe: 'response', responseType: 'blob' as 'json' }).pipe(catchError(this.formatErrors));
    }

    post(path: string, params = JSON.stringify({})): Observable<any> {
        this.setContentType();
        return this.http.post(path, params, this.httpOptions).pipe(catchError(this.formatErrors));
    }

    put(path: string, params = JSON.stringify({})): Observable<any> {
        this.setContentType();
        return this.http.put(path, params, this.httpOptions).pipe(catchError(this.formatErrors));
    }

    postEncoded(path: string, params = new URLSearchParams()): Observable<any> {
        this.setContentType(true);
        return this.http.post(path, params.toString(), this.httpOptions).pipe(catchError(this.formatErrors));
    }
}
