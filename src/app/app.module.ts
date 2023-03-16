import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HttpHeaders} from "@angular/common/http";
//material
import { MatButtonModule} from "@angular/material/button";

import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from "@angular/material/select";
import {MapModule} from "./modules/map/map.module";
import {CarModule} from "./modules/car/car.module";
import {CoreModule} from "./modules/core/core.module";

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
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
    MatSelectModule,
    FormsModule,
    MapModule,
    CarModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
