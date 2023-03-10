import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {DistanceService} from "../distance/distance.service";
import {MapService} from "../map/map.service";


@Injectable({
  providedIn: 'root'
})
export class TrajectService {

  constructor(
    private http:HttpClient,
    private distanceService: DistanceService,
    private mapService: MapService
  ) { }

  url = "http://localhost:8000"


    calculateTraject(start_lng: number, start_lat: number, finish_lng: number, finish_lat: number, range: number){
    const body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.hello.soap">
    <soapenv:Header/>
        <soapenv:Body>
             <spy:calculate_traject>
                <!--Optional:-->
                <spy:start_lng>${start_lng}</spy:start_lng>
                <!--Optional:-->
                <spy:start_lat>${start_lat}</spy:start_lat>
                <!--Optional:-->
                <spy:finish_lng>${finish_lng}</spy:finish_lng>
                <!--Optional:-->
                <spy:finish_lat>${finish_lat}</spy:finish_lat>
                <!--Optional:-->
                <spy:range>${range}</spy:range>
            </spy:calculate_traject>
        </soapenv:Body>
    </soapenv:Envelope>`
    //soap request to localhost:8000
      this.http.post<any>(this.url, body, {responseType: "text" as "json"}).pipe(
        map(
          (value) => {
            //on a une lists de liste de float, il faut convertire ça en liste de tubple de float
            console.log(value)
            let parser = new DOMParser();
            //get tns:calculate_trajectResult
            let xml = parser.parseFromString(value, "text/xml");
            let result = xml.getElementsByTagName("tns:calculate_trajectResult")[0];
            //convert to js object
            let arrays = result.getElementsByTagName("tns:floatArray");
            let res = [];
            for (let i = 0; i < arrays.length; i++) {
              let array = arrays[i].getElementsByTagName("tns:float");
              let array_res = [];
              for (let j = 0; j < array.length; j++) {
                array_res.push(parseFloat(array[j].innerHTML));
              }
              res.push(array_res);
            }
            //convert to list
            return res;
          }
        )
      ).subscribe(
        (data) => {
          this.distanceService.calculateDistance(data[0][0], data[0][1], data[data.length - 1][0], data[data.length - 1][1]);
          this.mapService.setRouting(data);
        }
      );
  }
}
