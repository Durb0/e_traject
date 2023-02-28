import { Injectable } from '@angular/core';
import * as L from "leaflet";
import {mapSubject} from "../../store/map.store";
import {Marker} from "leaflet";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map!: L.Map;

  icons = [
    {
      "name": "start",
      "icon": L.icon({
        iconUrl: 'assets/marker.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      }),
    },
    {
      "name": "end",
      "icon": L.icon({
        iconUrl: 'assets/navigation.png',
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      }),
    }
  ]


  constructor() {
    mapSubject.subscribe(
      (map) => {
        this.map = map;
        console.log("map",this.map);
      }
    );
  }

  getMapObservable() {
    return mapSubject.asObservable();
  }

  setMap(map: L.Map) {
    mapSubject.next(map);
  }

  searchIcon(iconName:string): L.Icon {
    let icon = this.icons.find((icon) => icon.name === iconName);
    if (icon) {
      return icon.icon;
    } else {
      return this.icons[0].icon;
    }
  }

  addMarker(latlng: L.LatLngExpression, iconName:string) {
    let icon:L.Icon = this.searchIcon(iconName);
    let marker:L.Marker = L.marker(latlng,{draggable:true,icon:icon});

    marker.on('dragend', function(e) {
      console.log(e.target.getLatLng());
      console.log(marker)
    });


    this.map.addLayer(marker);
    //on met à jour le sujet
  }
}
