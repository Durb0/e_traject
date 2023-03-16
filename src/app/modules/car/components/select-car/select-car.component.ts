import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {CarService} from "../../car.service";
import {CarModel} from "../../car.model";

@Component({
  selector: 'app-select-car',
  templateUrl: './select-car.component.html',
  styleUrls: ['./select-car.component.scss']
})
export class SelectCarComponent implements OnInit {

  searchTerm: string = '';
  cars: CarModel[] = [];

  selectedCar: CarModel | null = null;

  //subscribtions
  carsSub!: Subscription;
  selectedCarSub!: Subscription;

  constructor(
    private car_: CarService
  ) { }

  ngOnInit(): void {
    this.carsSub = this.car_.getCars().subscribe((data: CarModel[]) => {
      this.cars = data;
    });
    this.selectedCarSub = this.car_.observeSelectedCar().subscribe((data: CarModel) => {
      this.selectedCar = data;
    });
  }

  search(){
    this.carsSub = this.car_.getCars(this.searchTerm).subscribe((data: CarModel[]) => {
      this.cars = data;
    });
  }

  isCarSelected(car: CarModel): boolean {
    if(this.selectedCar){
      return car === this.selectedCar;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.carsSub.unsubscribe();
    this.selectedCarSub.unsubscribe();
  }

  selectCar(car: CarModel) {
    this.car_.selectCar(car);
  }
}
