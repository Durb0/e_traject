import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HttpHeaders} from "@angular/common/http";
//material
import { MatButtonModule} from "@angular/material/button";

import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { MapComponent } from './components/map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from '@angular/material/dialog';
import {APOLLO_NAMED_OPTIONS, NamedOptions} from "apollo-angular";
import {HttpLink} from "apollo-angular/http";
import { InMemoryCache } from '@apollo/client/core';
import { GraphQLModule } from './graphql.module';
import {MatSelectModule} from "@angular/material/select";
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SelectCarComponent } from './components/select-car/select-car.component';
import { CarComponent } from './components/car/car.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    MapComponent,
    ToolbarComponent,
    SelectCarComponent,
    CarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    GraphQLModule,
    MatSelectModule,
    FormsModule
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
