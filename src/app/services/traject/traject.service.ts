import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, timeout} from "rxjs";
import {DistanceService} from "../distance/distance.service";
import {MapService} from "../../modules/map/map.service";
import {BorneService} from "../borne/borne.service";


@Injectable({
  providedIn: 'root'
})
export class TrajectService {

  constructor(
    private http:HttpClient,
    private distanceService: DistanceService,
    private mapService: MapService
  ) { }

  url = "https://ws-python.vercel.app/?wsdl";
  //url = "http://localhost:8000/?wsdl"


  calculateTraject(start_lat: number, start_lng: number, finish_lat: number, finish_lng: number, range: number, bornes: any[]){



    const headers = new HttpHeaders({
      'timeout': '100000',
    });

    const options = {
      responseType: "text" as "json",
      timeout: 100000,
    }

    const body = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="info.802.traject.soap">\
          <soapenv:Header/>
          <soapenv:Body>
               <spy:calculate_traject>
                  <!--Optional:-->
                  <spy:start_lat>${start_lat}</spy:start_lat>
                  <!--Optional:-->
                  <spy:start_lng>${start_lng}</spy:start_lng>
                  <!--Optional:-->
                  <spy:finish_lat>${finish_lat}</spy:finish_lat>
                  <!--Optional:-->
                  <spy:finish_lng>${finish_lng}</spy:finish_lng>
                  <!--Optional:-->
                  <spy:autonomy>${range}</spy:autonomy>
                  <!--Optional:-->
                  <spy:charging_stations>${JSON.stringify(bornes)}</spy:charging_stations>
              </spy:calculate_traject>
          </soapenv:Body>
      </soapenv:Envelope>`
    //soap request to localhost:8000
    this.http.post<any>(this.url, body, options).pipe(
      timeout(100000),
      map(
        (value) => {
          //on a une lists de liste de float, il faut convertire ça en liste de tubple de float
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
        this.distanceService.calculateDistance(data[0][0], data[0][1], data[data.length - 1][0], data[data.length - 1][1]).subscribe(
          (distance) => {
            this.distanceService.setDistance(distance);
          });
        this.mapService.setRouting(data);
      }
    );
  }
}
