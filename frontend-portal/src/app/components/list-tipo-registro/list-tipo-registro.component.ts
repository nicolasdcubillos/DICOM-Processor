import { Component, OnInit } from '@angular/core';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-tipo-registro',
  templateUrl: './list-tipo-registro.component.html',
  styleUrls: ['./list-tipo-registro.component.css']
})
export class ListTipoRegistroComponent implements OnInit {

  
  constructor(private tipoRegistroService:TipoRegistroService) { }

  tipoRegistro:any[] = [];

  isLoading:boolean=false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getTipoRegistros();
  }

  getTipoRegistros(){
    this.tipoRegistroService.lista().subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.tipoRegistro=res;
      },
      error:err=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    })
  }

  confirmarEliminar(tipoRegistro:any){
    Swal.fire({
      title: 'Desea eliminar el tipo registro ?',
      icon: 'question',
      showCloseButton:true,
      confirmButtonText:"Aceptar",
      confirmButtonColor: "#DD6B55",
    })
    .then((result)=>{
      if(result.value){
        this.borrar(tipoRegistro);
      }
    });
  }


  borrar(tipoRegistro:any){
    this.isLoading = true;
    this.tipoRegistroService.delete(tipoRegistro.id).subscribe({
      next:res=>{
        this.isLoading = false;
        this.ngOnInit();
      },
      error:err=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    })
  }

}
