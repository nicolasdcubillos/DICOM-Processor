import { Component, OnInit,ElementRef,NgZone } from '@angular/core';

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit {

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

}
