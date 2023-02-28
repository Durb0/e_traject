import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "../../services/map/map.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit{
  private map!: L.Map;

  constructor(
    private mapService: MapService
  ) {}

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);


    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.mapService.setMap(this.map);
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.initMap();
  }


}
