import { Component, OnInit } from '@angular/core';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-tipo-usuario',
  templateUrl: './list-tipo-usuario.component.html',
  styleUrls: ['./list-tipo-usuario.component.css']
})
export class ListTipoUsuarioComponent implements OnInit {

  
  constructor(private tipoUsuarioService:TipoUsuarioService) { }

  tipoUsuarios:any[] = [];

  isLoading:boolean=false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getTipoUsuarios();
  }

  getTipoUsuarios(){
    this.tipoUsuarioService.lista().subscribe({
      next:(res:any)=>{
        this.isLoading = false;
        this.tipoUsuarios=res;
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

  confirmarEliminar(tipoUser:any){
    Swal.fire({
      title: 'Desea eliminar el tipo usuario ?',
      icon: 'question',
      showCloseButton:true,
      confirmButtonText:"Aceptar",
      confirmButtonColor: "#DD6B55",
    })
    .then((result)=>{
      if(result.value){
        this.borrar(tipoUser);
      }
    });
  }


  borrar(tipoUser:any){
    this.isLoading = true;
    this.tipoUsuarioService.delete(tipoUser.id).subscribe({
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
