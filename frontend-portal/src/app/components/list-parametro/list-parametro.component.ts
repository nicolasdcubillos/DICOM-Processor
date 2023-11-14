import { Component, OnInit } from '@angular/core';
import { ParametroService } from 'src/app/services/parametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-parametro',
  templateUrl: './list-parametro.component.html',
  styleUrls: ['./list-parametro.component.css']
})
export class ListParametroComponent implements OnInit {

  constructor(private parametroService:ParametroService) { }

  parametros:any[] = [];

  isLoading:boolean=false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getTipoRegistros();
  }

  getTipoRegistros(){
    this.parametroService.lista().subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.parametros=res;
        console.log(this.parametros);
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

  confirmarEliminar(parametro:any){
    Swal.fire({
      title: 'Desea eliminar el parametro ?',
      icon: 'question',
      showCloseButton:true,
      confirmButtonText:"Aceptar",
      confirmButtonColor: "#DD6B55",
    })
    .then((result)=>{
      if(result.value){
        this.borrar(parametro);
      }
    });
  }


  borrar(parametro:any){
    this.isLoading = true;
    this.parametroService.delete(parametro.id).subscribe({
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
