import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-registro',
  templateUrl: './list-registro.component.html',
  styleUrls: ['./list-registro.component.css']
})
export class ListRegistroComponent implements OnInit {

  
  
  constructor(private router: Router,
              private registroService: RegistroService) { }

  registros:any[] = [];

  isLoading:boolean=false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getTipoRegistros();
  }

  redirect(registro:any){
    this.isLoading = true;
    if(registro.seen==false){
      this.registroService.updateSeen(registro.uuid,true,registro).subscribe({
        next:res=>{
          this.isLoading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Resultado Visto',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
    this.router.navigate(['/registros/view', registro.uuid])
  }

  getTipoRegistros(){
    this.registroService.lista().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.registros = res;
        this.registros.forEach((registro) => {
          if (registro.fecha != null) {
            registro.fechaFormateada = formatDate(registro.fecha, 'MMMM d, y', 'es');
            
          }
          console.log(registro); 
        });
        this.isLoading = false;
      },
      error:err=>{
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        this.isLoading = false;
      }
    })
  }

  
  confirmarEliminar(registro:any){
    Swal.fire({
      title: 'Desea eliminar el resultado ?',
      icon: 'question',
      showCloseButton:true,
      confirmButtonText:"Aceptar",
      confirmButtonColor: "#DD6B55",
    })
    .then((result)=>{
      if(result.value){
        this.borrar(registro);
      }
    });
  }

  borrar(registro:any){
    this.isLoading = true;
    this.registroService.delete(registro.id).subscribe({
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
