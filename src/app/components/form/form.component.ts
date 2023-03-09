import { Component, OnInit } from '@angular/core';
import {TrajectService} from "../../services/traject/traject.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MapService} from "../../services/map/map.service";
import * as L from "leaflet";
import {DistanceService} from "../../services/distance/distance.service";
import {LocalisationService} from "../../services/localisation/localisation.service";
import {CarService} from "../../services/car/car.service";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  result: number = 0;

  trajectForm: FormGroup = new FormGroup({});

  //subscriptions
  distanceSubscription!: Subscription;
  proposalSubscription!: Subscription;


  constructor(
    private traject_: TrajectService,
    private formBuilder: FormBuilder,
    private map_:MapService,
    private distance_:DistanceService,
    private localisation_:LocalisationService,
    private dialog_: MatDialog,
  ) { }

  ngOnInit(): void {
    this.distanceSubscription = this.distance_.getDistance().subscribe((data) => {
      this.result = data;
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
      this.traject_.calculateTraject(start_lng,start_lat,finish_lng,finish_lat);
    }
  }

  onFormChange(form: string) {
    let value = this.trajectForm.get(form)?.value;
    if(value.length > 3){
      //this.proposalSubscription?.unsubscribe();
      console.log("subscribe");
      this.proposalSubscription = this.localisation_.getProposal(value).subscribe(async (data: Array<any>) => {
        console.log(data);
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
  }
}
