import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {

  apiUrl = "https://nominatim.openstreetmap.org/search.php";

  constructor(
    private http: HttpClient
  ) { }

  getProposal(address: string): any {
    return this.http.get(this.apiUrl, {
      params: {
        q: address,
        format: "jsonv2",
        limit: 1
      }
    });
  }
}
