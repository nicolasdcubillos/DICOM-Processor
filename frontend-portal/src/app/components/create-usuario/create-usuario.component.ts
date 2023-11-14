import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class CreateUsuarioComponent implements OnInit {

  userForm: FormGroup;

  userId:string = '';
  edit:boolean = false;
  userEdit:any={};
  tipoUsaurioList:any=[];

  isLoading:boolean=false;

  constructor(private router:Router, public fb: FormBuilder, private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private tipoUsuarioServie:TipoUsuarioService) { 
    this.userForm = this.fb.group({
      nombre: ['',[Validators.required]],
      apellido: ['',[Validators.required]],
      username: ['',[Validators.required]],
      telefono: ['',[Validators.required]],
      pass: ['',[Validators.required]],
      email: ['',[Validators.required]],
      tipoUsuario: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const params = this.activatedRoute.snapshot.params;
    this.getTipoUsuarios();
    this.userId = params['id'];
    if(this.userId !== undefined){
      this.edit=true;
      this.getUserEdit()
    } 
  }

  getTipoUsuarios(){
    this.isLoading = false;
    this.tipoUsuarioServie.lista().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.tipoUsaurioList=res;
      },
      error:error=>{
        console.log(error);
      }
    })
  }

  getUserEdit(){
    this.isLoading = true;
    this.usuarioService.getById(this.userId).subscribe({
      next:res=>{
        this.isLoading = false;
        console.log(res);
        this.userEdit=res;
        this.fillForm();
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  fillForm(){
    this.userForm.get('nombre')!.setValue(this.userEdit.nombre);
    this.userForm.get('apellido')!.setValue(this.userEdit.apellido);
    this.userForm.get('email')!.setValue(this.userEdit.email);
    this.userForm.get('telefono')!.setValue(this.userEdit.telefono);
    this.userForm.get('pass')!.setValue(this.userEdit.pass);
    this.userForm.get('username')!.setValue(this.userEdit.username);
    this.userForm.get('tipoUsuario')!.setValue(this.userEdit.tipoUsuario);
  }


  onCreate(){
    this.isLoading = true;
    console.log(this.userForm.value);
      this.usuarioService.create(this.userForm.value).subscribe({
        next:res=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Creación Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['usuario/listar']);
          })
        },
        error:err=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
        },
      })
  }

  onEdit(){
    this.isLoading = true;
    this.usuarioService.update(this.userId,this.userForm.value).subscribe({
      next:res=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Edició Exitosa',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['usuario/listar']);
        })
      },
      error:err=>{
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      },
    })
  }

  irAtras(){
    window.history.back();
  }


}
