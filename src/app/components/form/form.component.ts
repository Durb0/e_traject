import { Component, OnInit } from '@angular/core';
import {TrajectService} from "../../services/traject/traject.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MapService} from "../../services/map/map.service";
import * as L from "leaflet";
import {DistanceService} from "../../services/distance/distance.service";
import {LocalisationService} from "../../services/localisation/localisation.service";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {CarService} from "../../services/car/car.service";
import {Car} from "../../model/car";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  result: number = 0;
  selectedCar!: Car;
  trajectForm: FormGroup = new FormGroup({});

  //subscriptions
  distanceSubscription!: Subscription;
  proposalSubscription!: Subscription;
  selectedCarSubscription!: Subscription;


  constructor(
    private traject_: TrajectService,
    private formBuilder: FormBuilder,
    private map_:MapService,
    private distance_:DistanceService,
    private localisation_:LocalisationService,
    private car_: CarService,
  ) { }

  ngOnInit(): void {
    this.distanceSubscription = this.distance_.getDistance().subscribe((data) => {
      this.result = data;
    });
    this.selectedCarSubscription = this.car_.observeSelectedCar().subscribe((data) => {
      this.selectedCar = data;
    });
    this.trajectForm = this.formBuilder.group({
        start: ["",[Validators.required]],
        finish: ["",[Validators.required]],
    });
  }

  setValues(form:string, latlng:L.LatLng){
    this.trajectForm.get(form)?.get("lat")?.setValue(latlng.lat);
    this.trajectForm.get(form)?.get("lng")?.setValue(latlng.lng);
  }

  onValid() {
    let startMarker = this.map_.getMarkerFromFormName("start");
    let finishMarker = this.map_.getMarkerFromFormName("finish");
    if(startMarker && finishMarker){
      let start_lng = startMarker.getLatLng().lng;
      let start_lat = startMarker.getLatLng().lat;
      let finish_lng = finishMarker.getLatLng().lng;
      let finish_lat = finishMarker.getLatLng().lat;
      this.traject_.calculateTraject(start_lng,start_lat,finish_lng,finish_lat,this.selectedCar.range);
    }
  }

  onFormChange(form: string) {
    let value = this.trajectForm.get(form)?.value;
    if(value.length > 3){
      //this.proposalSubscription?.unsubscribe();
      this.proposalSubscription = this.localisation_.getProposal(value).subscribe(async (data: Array<any>) => {
        if (data.length == 0) return;
        let result = data[0];
        //first remove all markers with the form name
        await this.map_.removeMarkers(form);
        //add markers
        //if result have attributes lat and lon
        if (result["lat"] && result["lon"]){
          let latlng = L.latLng(result["lat"],result["lon"]);
          this.map_.addMarker(latlng,form);
          this.setValues(form,latlng);
          return;
        }
      });
    }
  }

  focus(form: string) {
    let marker = this.map_.getMarkerFromFormName(form);
    if (marker)
    this.map_.focusOnMarker(marker);
  }


  ngOnDestroy(): void {
    this.map_.removeMarkers("start");
    this.map_.removeMarkers("finish");
    //unsubscribe from all subscriptions
    this.distanceSubscription.unsubscribe();
    this.proposalSubscription.unsubscribe();
    this.selectedCarSubscription.unsubscribe();
  }
}
