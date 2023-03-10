import { Component, OnInit } from '@angular/core';
import {map, Observable, Subscription} from "rxjs";
import {CarService} from "../../services/car/car.service";
import {Car} from "../../model/car";
import {selectedCar} from "../../utils/store";

@Component({
  selector: 'app-select-car',
  templateUrl: './select-car.component.html',
  styleUrls: ['./select-car.component.scss']
})
export class SelectCarComponent implements OnInit {

  searchTerm: string = '';
  cars: Car[] = [];

  selectedCar: Car | null = null;

  //subscribtions
  carsSub!: Subscription;
  selectedCarSub!: Subscription;

  constructor(
    private car_: CarService
  ) { }

  ngOnInit(): void {
    this.carsSub = this.car_.getCars().subscribe((data: Car[]) => {
      this.cars = data;
    });
    this.selectedCarSub = this.car_.observeSelectedCar().subscribe((data: Car) => {
      this.selectedCar = data;
    });
  }

  search(){
    this.carsSub = this.car_.getCars(this.searchTerm).subscribe((data: Car[]) => {
      this.cars = data;
    });
  }

  isCarSelected(car: Car): boolean {
    if(this.selectedCar){
      return car === this.selectedCar;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.carsSub.unsubscribe();
    this.selectedCarSub.unsubscribe();
  }

  selectCar(car: Car) {
    this.car_.selectCar(car);
    console.log(car);
  }
}
