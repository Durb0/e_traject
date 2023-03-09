import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql} from "apollo-angular";
import {map, Observable} from "rxjs";
import {Car} from "../../model/car";

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private apollo: ApolloBase;

  generateQuery(searchTerms: string = ""){
    return gql`
      {
        vehicleList(
          search: "${searchTerms}"
        )
        {
          id
          naming
          {
            make
            model
            version
          }
          media
          {
            image
            {
              url
              thumbnail_url
            }
          }
          range
          {
            chargetrip_range
            {
              best
            }
          }
          connectors
          {
            time
          }
        }
      }
    `
  }

  constructor(
    private apollo_: Apollo
  ) {
    this.apollo = this.apollo_.use('chargetrip');
  }

  getCars(searchTerms:string = ""): Observable<Car[]>{
    return this.apollo.query({
      query: this.generateQuery(searchTerms)
    }).pipe(
      map((data: any) => data.data.vehicleList),
      map((data: any) => data.map((car: any) => {
        return {
          id: car.id,
          naming: {
            make: car.naming.make,
            model: car.naming.model,
            version: car.naming.version
          },
          image_url: car.media.image.url,
          thumbnail_url: car.media.image.thumbnail_url,
          range: car.range.chargetrip_range.best,
          recharge_time: car.connectors[0].time
        }
      }))
    );
  }


}
