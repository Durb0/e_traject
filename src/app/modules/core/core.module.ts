import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarComponent} from "./component/toolbar/toolbar.component";



@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ToolbarComponent
  ]
})
export class CoreModule { }
