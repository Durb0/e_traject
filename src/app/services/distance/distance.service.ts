import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { distanceSubject} from "../../store/distance.store";

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl = "http://localhost:3000/distance"

  calculateDistance(start_lng:number,start_lat:number,finish_lng:number,finish_lat:number){
    this.http.get(this.apiUrl, {
      params: {
        start_lng: start_lng.toString(),
        start_lat: start_lat.toString(),
        finish_lng: finish_lng.toString(),
        finish_lat: finish_lat.toString()
      }
    }).subscribe(
      (value) => {
        let res = value as number;
        res /= 1000;
        //on ne garde que 2 chiffres après la virgule
        res = Math.round(res * 100) / 100;
        console.log(res)
        distanceSubject.next(res);
      });
  }

  getDistance() {
    return distanceSubject.asObservable();
  }
}
