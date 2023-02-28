import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TrajectService {

  constructor(
    private http:HttpClient
  ) { }

  url = "http://localhost:8000"



  calculateTraject():Promise<number> {
    const body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.hello.soap">
    <soapenv:Header/>
        <soapenv:Body>
             <spy:calculate_traject>
                <!--Optional:-->
                <spy:start_x>5</spy:start_x>
                <!--Optional:-->
                <spy:start_y>5</spy:start_y>
                <!--Optional:-->
                <spy:finish_x>5</spy:finish_x>
                <!--Optional:-->
                <spy:finish_y>5</spy:finish_y>
            </spy:calculate_traject>
        </soapenv:Body>
    </soapenv:Envelope>`
    //soap request to localhost:8000
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url, body, {responseType: "text" as "json"}).pipe(
        map(
          (value) => {
            const data = value.split("calculate_trajectResult");
            let res = data[1];
            res = res.replace(">", "");
            res = res.replace("</tns:", "");
            console.log(res);
            return res;
          }
        )
      ).subscribe(
        (data) => {
          resolve(data);
        }
      );
    });
  }
}
