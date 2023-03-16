import { Injectable } from '@angular/core';
import {DistanceService} from "../distance/distance.service";
import {map, Observable, of, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BorneService {

  apiUrl = "https://odre.opendatasoft.com/api/records/1.0/search/"

  constructor(
    private distanceService: DistanceService,
    private http: HttpClient
  ) { }

  getBornesBetween(start_lat: number, start_lng: number, finish_lng: number, finish_lat: number): Observable<any>{

    return this.distanceService.calculateDistance(start_lng, start_lat, finish_lng, finish_lat).pipe(
      switchMap(distance => {

        //get center between start and finish
        let center_lng = (start_lng + finish_lng) / 2;
        let center_lat = (start_lat + finish_lat) / 2;

        let params = {
          'dataset': 'bornes-irve',
          'rows': 10000,
          'geofilter.distance': `${center_lat},${center_lng},${(distance)*1000}`
        };

        return this.http.get(this.apiUrl, {
          params: params
        }).pipe(
          map((response: any) => {
            return response.records;
          }
        ))
      })
    );
  }
}
