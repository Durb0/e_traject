import { Component, OnInit } from '@angular/core';
import {TrajectService} from "../../services/traject/traject.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MapService} from "../../services/map/map.service";
import * as L from "leaflet";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  result: number | null = null;

  trajectForm: FormGroup = new FormGroup({});

  constructor(
    private traject_: TrajectService,
    private formBuilder: FormBuilder,
    private map_:MapService
  ) { }

  ngOnInit(): void {
    this.result = null;
    this.trajectForm = this.formBuilder.group({
      start: this.formBuilder.group({
        x: ["",[Validators.required]],
        y: ["",[Validators.required]]
      }),
      finish: this.formBuilder.group({
        x: ["",[Validators.required]],
        y: ["",[Validators.required]]
      })
    });
  }

  onTestButton() {
    this.traject_.calculateTraject().then(
      (data) => {
        this.result = data;
      });
  }

  test(){
    this.map_.addMarker(L.latLng(0,0),"start");
  }

}
