import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuarioService } from 'src/app/services/tipo-usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-tipo-usuario',
  templateUrl: './create-tipo-usuario.component.html',
  styleUrls: ['./create-tipo-usuario.component.css']
})
export class CreateTipoUsuarioComponent implements OnInit {

  
  tipoUsuarioForm: FormGroup;

  tipoUsuarioId:string = '';
  edit:boolean = false;
  tipoUserEdit:any={};
  tipoUsaurioList:any=[];

  isLoading:boolean=false;

  constructor(private router:Router, public fb: FormBuilder, private activatedRoute: ActivatedRoute, private tipoUsuarioService: TipoUsuarioService) { 
    this.tipoUsuarioForm = this.fb.group({
      rol: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const params = this.activatedRoute.snapshot.params;
    this.tipoUsuarioId = params['id'];
    if(this.tipoUsuarioId !== undefined){
      this.edit=true;
      this.getTipoUsuarioEdit()
    }else{
      this.isLoading = false;
    }
  }

  getTipoUsuarioEdit(){
    this.tipoUsuarioService.getById(this.tipoUsuarioId).subscribe({
      next:res=>{
        this.isLoading = false;
        this.tipoUserEdit=res;
        this.fillForm();
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  fillForm(){
    this.tipoUsuarioForm.get('rol')!.setValue(this.tipoUserEdit.rol);
  }


  onCreate(){
    this.isLoading = true;
      this.tipoUsuarioService.create(this.tipoUsuarioForm.value).subscribe({
        next:res=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Creación Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['tipoUsuarios/listar']);
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
      this.tipoUsuarioService.update(this.tipoUsuarioForm.value,this.tipoUsuarioId).subscribe({
        next:res=>{
          Swal.fire({
            title: 'Edición Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['tipoUsuarios/listar']);
          })

        },
        error:err=>{

        },
      })
  }

  irAtras(){
    window.history.back();
  }

  

}
