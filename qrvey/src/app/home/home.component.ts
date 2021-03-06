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
  favorites: any[] = [];
  countriesFiltered: any[] = [];
  
  countryName: string = '';
  regionName: string = '';
  population: string = '';
  capital: string = '';
  currency: string = '';
  language: string = '';
  borderCountries: string = '';
  flag: string = '';
  searchText: string = '';
  search: boolean = false;
  listSearch: string = 'all';

  modalRef: BsModalRef;

  constructor(private countriesService: CountriesService, private modalService: BsModalService) { }

  ngOnInit(): void {
    console.log('Hola again');

    //this.getAllCountries();

    this.favorites = JSON.parse(localStorage.getItem('favorites'));
    if(this.favorites == null){
      this.favorites = [];
    }
    console.log('favorites', this.favorites);

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

  addFavorite(countryName: string){
    console.log('add favorite: ', countryName);
    this.favorites.push(countryName);
    console.log(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  removeFavorite(countryName: string){
    console.log('remove favorite: ', countryName);
    let index = this.favorites.indexOf(countryName);
    if(index > -1){
      this.favorites.splice(index, 1);
    }
    console.log(this.favorites);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  searchCountries(){
    if(this.searchText == ''){
      this.search = false;
    }
    else{
      this.countriesFiltered = [];
      console.log('search: ', this.searchText);
      this.search = true;
      let text = this.searchText.toLowerCase();
      this.world.forEach(region => {
        region.countries.forEach(countries => {
          let countryName = countries.name.toLowerCase();
          if(countryName.indexOf(text) != -1){
            this.countriesFiltered.push(countries);
          }
        });
      });
      console.log('paises filtrados: ', this.countriesFiltered);
    }
  }

  filterCountries(){
    console.log('option filter selected: ', this.listSearch);
    this.searchText = '';

    if(this.listSearch == '' || this.listSearch == 'all'){
      this.search = false;
    }
    else if(this.listSearch == 'favorites'){
      this.search = true;
      this.countriesFiltered = [];
      this.world.forEach(region => {
        region.countries.forEach(countries => {
          this.favorites.forEach(fav => {
            if(countries.name == fav){
              this.countriesFiltered.push(countries);
            }
          });
        });
      });
      console.log('paises filtrados: ', this.countriesFiltered);
    }
    else{
      this.search = true;
      this.countriesFiltered = [];
      this.world.forEach(region => {
        if(region.region == this.listSearch){
          this.countriesFiltered = region.countries;
        }
      });
    }
  }

}
