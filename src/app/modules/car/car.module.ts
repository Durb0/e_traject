import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarComponent} from "./components/car/car.component";
import {SelectCarComponent} from "./components/select-car/select-car.component";
import {CoreModule} from "../core/core.module";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {CarService} from "./car.service";
import {APOLLO_NAMED_OPTIONS, NamedOptions} from "apollo-angular";
import {HttpLink} from "apollo-angular/http";
import {InMemoryCache} from "@apollo/client/core";
import {HttpHeaders} from "@angular/common/http";
import {GraphQLModule} from "../../graphql.module";



@NgModule({
  declarations: [
    CarComponent,
    SelectCarComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    MatInputModule,
    FormsModule,
    GraphQLModule
  ],
  exports: [
    CarComponent,
    SelectCarComponent
  ],
  providers:[
    CarService,
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          chargetrip: {
            // <-- This settings will be saved by name: chargetrip
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'https://api.chargetrip.io/graphql',
              headers: new HttpHeaders({
                'x-client-id': '640736db5fdc57484bfc8d30',
                'x-app-id': '640736db5fdc57484bfc8d32'
              }),
              method: 'POST'
            }),
          },
        };
      },
      deps: [HttpLink],
    }
  ]
})
export class CarModule { }
