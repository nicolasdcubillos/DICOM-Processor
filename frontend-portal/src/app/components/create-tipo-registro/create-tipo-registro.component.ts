import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoRegistroService } from 'src/app/services/tipo-registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-tipo-registro',
  templateUrl: './create-tipo-registro.component.html',
  styleUrls: ['./create-tipo-registro.component.css']
})
export class CreateTipoRegistroComponent implements OnInit {

  
  tipoRegistroForm: FormGroup;

  tipoRegistroId:string = '';
  edit:boolean = false;
  tipoRegistroEdit:any={};

  isLoading:boolean=false;

  constructor(private router:Router, public fb: FormBuilder, private activatedRoute: ActivatedRoute, private tipoRegistroService: TipoRegistroService) { 
    this.tipoRegistroForm = this.fb.group({
      tipoRegistro: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const params = this.activatedRoute.snapshot.params;
    this.tipoRegistroId = params['id'];
    if(this.tipoRegistroId !== undefined){
      this.edit=true;
      this.getTipoRegistroEdit()
    } else {
      this.isLoading = false;
    }
  }

  getTipoRegistroEdit(){
    this.tipoRegistroService.getById(this.tipoRegistroId).subscribe({
      next:res=>{
        this.isLoading = false;
        this.tipoRegistroEdit=res;
        this.fillForm();
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

  fillForm(){
    this.tipoRegistroForm.get('tipoRegistro')!.setValue(this.tipoRegistroEdit.tipoRegistro);
  }


  onCreate(){
    this.isLoading = true;
      this.tipoRegistroService.create(this.tipoRegistroForm.value).subscribe({
        next:res=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Creación Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['tipoRegistros/listar']);
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
      this.tipoRegistroService.update(this.tipoRegistroForm.value,this.tipoRegistroId).subscribe({
        next:res=>{
          this.isLoading = false;
          Swal.fire({
            title: 'Edición Exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['tipoRegistros/listar']);
          })
        },
        error:err=>{
          this.isLoading = false;
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
