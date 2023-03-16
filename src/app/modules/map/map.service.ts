import {Injectable} from '@angular/core';
import * as L from "leaflet";
import {icon, Icon, LatLng, LatLngExpression, Map, Marker, TileLayer} from "leaflet";
import "leaflet-routing-machine";

@Injectable({
  providedIn: 'root'
})
export class MapService {


  openstreetmap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  mapBoxApiKey = "pk.eyJ1IjoiZHVyYm8iLCJhIjoiY2xlb3RrdWU2MDVxZzN1bzF6Mzk0eHVwYiJ9.9aWTw5C1NClRpJTuiv6htg"
  mapBox = `https://api.mapbox.com/styles/v1/durbo/cleoth9td002k01o72zqhdmk4/tiles/256/{z}/{x}/{y}@2x?access_token=${this.mapBoxApiKey}`
  private map!: Map;
  private markers: Marker[] = [];

  private route?:L.Routing.Control;

  createIcon(name: string): Icon {
    return icon({
      iconUrl: `assets/${name}.png`,
      iconSize: [40, 40], // size of the icon
      iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
  }

  tiles = new TileLayer(this.mapBox, {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });

  public async initMap(elementId: string, center: LatLngExpression, zoom: number) {
    this.map = new Map(elementId).setView(center, zoom);
    //hide leaflet-control-container

    this.tiles.addTo(this.map);
  }

  addMarker(latlng: LatLngExpression, iconName:string) {
    let icon:Icon = this.createIcon(iconName);
    let marker:Marker = new Marker(latlng,{draggable:true,icon:icon});

    //si le marker porte le nom start ou end, on le supprime avant de le rajouter
    this.markers.push(marker);


    marker.addTo(this.map);

    return marker;
  }

  createMarker(i:any,wp:any,n:any){
    var marker_icon = null;
    if (i == 0) {
      marker_icon = this.createIcon("start--select");
    }
    else if (i == n - 1) {
      marker_icon = this.createIcon("finish--select");
    }
    else {
      marker_icon = this.createIcon("borne--select");
    }
    return L.marker(wp.latLng, {
      draggable: false,
      icon: marker_icon
    });
  }

  getMarkerFromFormName(form:string){
    return this.markers.find((marker) => marker.options.icon?.options.iconUrl === `assets/${form}.png`);
  }

  focusOnMarker(marker:Marker){
    this.map.setView(marker.getLatLng(), 15);
  }

  setRouting(coords: number[][]){
    //remove previous routing
    if(this.route){
      this.route.remove();
    }

    let lineOptions = {
      styles: [{color: 'paleturquoise', opacity: 1, weight: 5}],
      extendToWaypoints: true,
      missingRouteTolerance: 10
    }

    let latlngs = coords.map((coord) => new LatLng(coord[0],coord[1]));

    let plan = new L.Routing.Plan(latlngs, {
      createMarker: this.createMarker.bind(this),
      routeWhileDragging: true,
    });



    this.route = L.Routing.control({
      waypoints: latlngs,
      //refuse to add waypoints
      addWaypoints: false,
      routeWhileDragging: false,
      lineOptions: lineOptions,
      plan: plan
    });

    this.route.addTo(this.map);
  }

  removeMarkers(form: string) {
    this.markers = this.markers.filter((marker) => marker.options.icon?.options.iconUrl !== `assets/${form}.png`);
    this.map.eachLayer((layer) => {
      if(layer instanceof Marker)
      if (layer.options.icon?.options.iconUrl === `assets/${form}.png`) {
        this.map.removeLayer(layer);
      }
    });
  }
}
