import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  marker: any;
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  pos: any = {
    lat: -0.7893,
    lng: 113.9213
  };

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.showMap(this.pos);
  }

  showMap(pos: any) {
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 6,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    this.infoWindow = new google.maps.InfoWindow();
    this.infoWindow.open(this.map);

    this.map.addListener('click', (mapsMouseEvent) => {
      console.log(mapsMouseEvent.latLng);
      if (this.marker != null) { this.marker.setMap(null); }
      this.marker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: this.map
      });
    });
  }

  showCurrentLoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(this.pos);
        this.infoWindow.setPosition(this.pos);
        this.infoWindow.setContent('Your Current Location');
        this.infoWindow.open(this.map);
        this.map.setCenter(this.pos);
        this.map.setZoom(16);
      });
    }
  }
}
