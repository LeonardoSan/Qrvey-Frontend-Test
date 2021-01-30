import { Component, OnInit, TemplateRef } from '@angular/core';
import { CountriesService } from '../services/countries.service';
import {ViewChild, ElementRef} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  world: any[] = [];
  regions: any[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  
  countryName: string = '';
  regionName: string = '';
  population: string = '';
  capital: string = '';
  currency: string = '';
  language: string = '';
  borderCountries: string = '';
  flag: string = '';

  modalRef: BsModalRef;

  constructor(private countriesService: CountriesService, private modalService: BsModalService) { }

  ngOnInit(): void {
    console.log('Hola again');

    //this.getAllCountries();

    this.regions.forEach(region => {
      this.countriesService.GetCountriesByRegion(region).subscribe(
        result => {
          console.log('countries of '+ region +': ', result);
          this.world.push({
            region: region,
            countries: result
          });
        },
        error => {
          console.error(error);
        }
      );
    });

    console.log('world', this.world);
  }

  getAllCountries(){
    this.countriesService.GetAllCountries().subscribe(
      result => {
        console.log('all countries: ', result);
        this.world = result;
      },
      error => {
        console.error(error);
      }
    );
  }

  openModal(template: TemplateRef<any>, country: object){
    console.log('Country selected: ', country);
    this.modalRef = this.modalService.show(template);
    this.countryName = country['name'];
    this.regionName = country['region'];
    this.population = country['population'];
    this.capital = country['capital'];

    this.currency = '';
    if(country['currencies'].length > 0){
      if(country['currencies'].length > 1){
        country['currencies'].forEach(currency => {
          if(this.currency == ''){
            this.currency += currency.name;
          }
          else{
            this.currency += ', ' + currency.name;
          }
        });
      }
      else{
        	this.currency = country['currencies'][0].name;
      }
    }

    this.language = '';
    if(country['languages'].length > 0){
      if(country['languages'].length > 1){
        country['languages'].forEach(language => {
          if(this.language == ''){
            this.language += language.name;
          }
          else{
            this.language += ', ' + language.name;
          }
        });
      }
      else{
        this.language = country['languages'][0].name;
      }
    }

    this.borderCountries = '';
    if(country['borders'].length > 0){
      if(country['borders'].length > 1){
        country['borders'].forEach(border => {

          this.countriesService.GetCountryByCode(border).subscribe(
            result=> {
              console.log('country by code [' + border + ']: '+ result.name);
              if(this.borderCountries == ''){
                this.borderCountries += result.name;
              }
              else{
                this.borderCountries += ', ' + result.name;
              }
            },
            error=> {
              console.error(error);
            }
          );
        });
      }
      else{
        this.borderCountries = country['borders'][0];
      }
    }

    this.flag = country['flag'];
    
  }

  

}
