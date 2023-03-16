import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "../map.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  private map!: L.Map;

  constructor(
    private mapService: MapService
  ) {}


  ngOnInit(): void {
    this.mapService.initMap("map", [45.1842884, 5.6805206], 13);
  }


}
