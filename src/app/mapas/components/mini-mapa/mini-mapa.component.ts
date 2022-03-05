import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { map } from 'rxjs';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [`
      div{
        width:100%;
        height: 100px;
        margin: 0;
      }
  `]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lngLat: [number,number] = [0,0];
  @ViewChild('mapa') divMapa! : ElementRef;




  ngAfterViewInit(): void {

    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: 15,
      interactive:false
    });
    new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .addTo(mapa);
      
  }

  constructor() { }
}
