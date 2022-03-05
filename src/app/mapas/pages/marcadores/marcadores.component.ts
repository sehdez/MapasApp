import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado {
  color : string,
  marker?: mapboxgl.Marker,
  centro?: [number,number]
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
  .mapa-container{
    height:100%;
    width:100%;
  }
  ul{
    position:fixed;
    right: 10px;
    top: 10px;
    z-index: 999;
    cursor:pointer;
  }
`]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  nivelZoom = 14;
  centroMapa: [number, number] = [ -103.28433503703546, 20.560732654883903 ];
  marcadores: MarcadorPersonalizado[] = []

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centroMapa,
      zoom: 14
    });
    this.leerLocalStorage();
    
    // const marcadorHtml: HTMLElement = document.createElement('div');

    // marcadorHtml.innerHTML = 'Hola Mundo';

    // const marcador = new mapboxgl.Marker({
    //   // element: marcadorHtml
    //   color: '#ff0000'
    // })
    // .setLngLat (this.centroMapa)
    // .addTo(this.mapa);  
    
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat (this.centroMapa)
      .addTo(this.mapa);
    this.marcadores.push({
      color,
      marker:nuevoMarcador
    });
    this.guardarLocalStorage();


    nuevoMarcador.on('dragend', () =>{
      this.guardarLocalStorage();
    })

  }

  irMarcador( index: number ){
    this.mapa.flyTo({
      center: this.marcadores[index].marker?.getLngLat()
    })
  }

  borrarMarcador(index:number){
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index,1);
    this.guardarLocalStorage();
  }

  guardarLocalStorage(){
    const lngLatArr: MarcadorPersonalizado[] = [];
    this.marcadores.forEach( m =>{
     const { lng, lat } = m.marker!.getLngLat();
     const color = m.color;
     lngLatArr.push({
       color,
       centro: [lng,lat]
     });
    });
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerLocalStorage(){
    if (!localStorage.getItem('marcadores')){
      return;
    }
    const lngLatArr: MarcadorPersonalizado[]= JSON.parse(localStorage.getItem('marcadores')! );
   

    lngLatArr.forEach( m =>{
      const nuevoMarcador = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)
      this.marcadores.push({
        color : m.color,
        marker: nuevoMarcador
      });

      nuevoMarcador.on('dragend', () =>{
        this.guardarLocalStorage();
      })
    })

  }


}
