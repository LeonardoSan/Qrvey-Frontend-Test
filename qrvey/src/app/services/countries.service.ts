import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private urlApi = environment.url;
  private httpOptions;

  constructor(private http: HttpClient) { }

  setHeaders(){
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  GetAllCountries(){
    //this.setHeaders();
    return this.http.get(this.urlApi + 'all', this.httpOptions).pipe() as any;
  }

  GetCountriesByRegion(region: string){
    return this.http.get(this.urlApi + 'region/' + region, this.httpOptions).pipe() as any;
  }

  GetCountryByCode(code: string){
    return this.http.get(this.urlApi + 'alpha/' + code, this.httpOptions).pipe() as any;
  }
}
