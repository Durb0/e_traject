import { Component, OnInit } from '@angular/core';
import {map, Observable, Subscription} from "rxjs";
import {CarService} from "../../services/car/car.service";
import {Car} from "../../model/car";

@Component({
  selector: 'app-select-car',
  templateUrl: './select-car.component.html',
  styleUrls: ['./select-car.component.scss']
})
export class SelectCarComponent implements OnInit {

  searchTerm: string = '';
  cars: Car[] = [];

  //subscribtions
  carsSub!: Subscription;

  constructor(
    private car_: CarService
  ) { }

  ngOnInit(): void {
    this.carsSub = this.car_.getCars().subscribe((data: Car[]) => {
      console.log(data);
      this.cars = data;
    });
  }

  search(){
    this.carsSub = this.car_.getCars(this.searchTerm).subscribe((data: Car[]) => {
      console.log(data);
      this.cars = data;
    });
  }

  ngOnDestroy(): void {
    this.carsSub.unsubscribe();
  }

}
