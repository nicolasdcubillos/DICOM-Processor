import { Injectable } from '@angular/core';

const TOKEN_KEY:string = 'AuthToken';
const USERNAME_KEY:string = 'AuthUserName';
const AUTHORITIES_KEY:string = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor() { }

  public setToken(token:string):void{
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
  }

  public getToken():string|null{
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUserName(userName:string):void{
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY,userName);
  }

  public getUserName():string|null{
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setAuthorities(authorities:any[]):void{
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    if(authorities.length>1)window.sessionStorage.setItem(AUTHORITIES_KEY,"ROLE_ADMIN");
    else window.sessionStorage.setItem(AUTHORITIES_KEY,"ROLE_USER");
  }
  
  public getAuthorities():any{
    if(sessionStorage.getItem(AUTHORITIES_KEY))return sessionStorage.getItem(AUTHORITIES_KEY);
  }

  public logOut():void{
    window.sessionStorage.clear();
  }

}

