import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroService } from 'src/app/services/registro.service';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-registro',
  templateUrl: './create-registro.component.html',
  styleUrls: ['./create-registro.component.css']
})
export class CreateRegistroComponent implements OnInit {

  userForm: FormGroup;

  registroId:string = '';
  edit:boolean = false;
  registroEdit:any={};
  tipoRegistroList:any=[];
  usersList:any=[];
  imagenesTacList:any=[];

  constructor(private router:Router, 
    public fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private registroService:RegistroService,
    private usuarioService: UsuarioService, 
    private tipoRegistroService:TipoRegistroService,
    ) { 
    this.userForm = this.fb.group({
      fecha: ['',[Validators.required]],
      uuid: ['',[Validators.required]],
      tipoRegistro: ['',[Validators.required]],
      usuario: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.getUsuarios();
    this.getTiposRegistro();
    this.registroId = params['id'];
    if(this.registroId !== undefined){
      this.edit=true;
      this.getRegistroEdit()
    } 
  }

  getTiposRegistro(){
    this.tipoRegistroService.lista().subscribe({
      next:(res:any)=>{
        this.tipoRegistroList=res;
      },
      error:err=>{
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    })
  }

  getUsuarios(){
    this.usuarioService.lista().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.usersList=res;
      },
      error:err=>{
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    })
  }

  getRegistroEdit(){
    this.registroService.getById(this.registroId).subscribe({
      next:res=>{
        this.registroEdit=res;
        this.fillForm();
      },
      error:err=>{
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    })
  }

  fillForm(){
    this.userForm.get('fecha')!.setValue(this.registroEdit.fecha);
    this.userForm.get('imagenTacid')!.setValue(this.registroEdit.imagenTacid);
    this.userForm.get('tipoRegistro')!.setValue(this.registroEdit.tipoRegistro);
    this.userForm.get('usuario')!.setValue(this.registroEdit.usuario);
  }


  onCreate(){
    console.log(this.userForm.value);
      this.registroService.create(this.userForm.value).subscribe({
        next:res=>{
          Swal.fire({
            title: 'Creación Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['registros/listar']);
          })
        },
        error:err=>{
          Swal.fire({
            title: 'Error',
            text:err.error.exception,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        },
      })
  }

  onEdit(){
    this.registroService.update(this.registroId,this.userForm.value).subscribe({
      next:res=>{
        Swal.fire({
          title: 'Edició Exitosa',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['registros/listar']);
        })
      },
      error:err=>{
        Swal.fire({
          title: 'Error',
          text:err.error.exception,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    })
  }

  irAtras(){
    window.history.back();
  }

}
