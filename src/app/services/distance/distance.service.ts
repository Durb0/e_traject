import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { distanceSubject} from "../../app.store";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl = "https://rest-express.vercel.app/distance"

  calculateDistance(start_lng:number,start_lat:number,finish_lng:number,finish_lat:number){
    return this.http.get(this.apiUrl, {
      params: {
        start_lng: start_lng.toString(),
        start_lat: start_lat.toString(),
        finish_lng: finish_lng.toString(),
        finish_lat: finish_lat.toString()
      }
    }).pipe(
      map((response: any) => {
        //convert string to number
        response = Number(response);
        //convert m to km
        response = response / 1000;
        //round to 2 decimals
        response = Math.round(response * 100) / 100;
        return response;
      })
    )
  }

  setDistance(distance: number) {
    distanceSubject.next(distance);
  }

  getDistance() {
    return distanceSubject.asObservable();
  }
}
