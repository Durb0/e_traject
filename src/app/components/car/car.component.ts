import {Component, Input, OnInit} from '@angular/core';
import {Car} from "../../model/car";

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  @Input() car!: Car;

  constructor() { }

  ngOnInit(): void {
  }

}
