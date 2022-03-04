import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    .mapa-container{
      height:100%;
      width:100%;
    }
    .row{
      background-color: white;
      bottom: 10px;
      left: 10px;
      border-radius:5px;
      padding:10px;
      width: 70%;
      max-width: 500px;

      position: fixed;
      z-index: 999;
    }
  `]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  nivelZoom = 16;
  centroMapa: [number, number] = [ -103.28433503703546, 20.560732654883903 ];
  
  constructor() { }


   ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centroMapa,
      zoom: 16
    });

    this.mapa.on('zoom', ()=>this.nivelZoom = this.mapa.getZoom())

    this.mapa.on('zoomend', ()=>{
      if (this.mapa.getZoom() >18 ){
        this.mapa.zoomTo(18);
      }
    })
    //Movimiento del mapa
    this.mapa.on('move', (event) => {
      const target = event?.target;
      const { lng, lat } =target.getCenter();
      this.centroMapa = [lng,lat];
    })
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom',()=>{});
    this.mapa.off('zoomend',()=>{});
    this.mapa.off('move',()=>{});
  }




  zoomIn(){
    this.mapa.zoomIn();
  }
  zoomOut(){
    this.mapa.zoomOut()
  }

  zoomCambio(valor: string){
    this.mapa.zoomTo(Number(valor));
  }

}
