import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.css']
})
export class ListUsuarioComponent implements OnInit {

  constructor(private usuarioService:UsuarioService) { }

  users:any[] = [];

  isLoading:boolean=false;

  ngOnInit(): void {
    this.isLoading = true;
    this.getUsers();
  }

  getUsers(){
    this.usuarioService.lista().subscribe({
      next:(res:any)=>{
        if(res){
          this.isLoading = false;
          this.users=res;
          console.log(this.users);
        }
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

  confirmarEliminar(user:any){
    Swal.fire({
      title: 'Desea eliminar el usuario ?',
      icon: 'question',
      showCloseButton:true,
      confirmButtonText:"Aceptar",
      confirmButtonColor: "#DD6B55",
    })
    .then((result)=>{
      if(result.value){
        this.borrar(user);
      }
    });
  }


  borrar(user:any){
    this.isLoading = true;
    this.usuarioService.delete(user.id).subscribe({
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
        console.log(err);
      }
    })
  }

}
