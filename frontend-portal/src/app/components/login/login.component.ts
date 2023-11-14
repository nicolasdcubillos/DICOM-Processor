import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  isLogged = false;
  isLoginFail = false;
  loginUsuario: any = {};
  nombreUsuario:string='';
  password:string='';
  roles:string[]|undefined = [];
  errMsj: string='';

  constructor(private tokenService:TokenService, private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged=true;
      this.isLoginFail=false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin():void{
    this.router.navigate(['usuario/listar']);
    // this.loginUsuario.name=this.nombreUsuario;
    // this.loginUsuario.pass=this.password;
    // this.authService.login(this.loginUsuario).subscribe({
    //   next:data => {
    //     this.isLogged = true;
    //     this.isLoginFail = false;

    //     this.tokenService.setToken(String(data.token));
    //     this.tokenService.setUserName(String(data.nombreUsuario));
    //     this.tokenService.setAuthorities(data.authorities);
    //     this.roles = data.authorities;
    //     this.router.navigate(['candidato/listar']);
    //   },
    //   error:(err) => {
    //     this.isLogged = false;
    //     this.isLoginFail = true;
    //     this.errMsj = err.message;
    //     console.log(this.errMsj);
    //   }
    // });
  }
}
