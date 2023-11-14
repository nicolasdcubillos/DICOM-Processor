import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  authUrl = 'http://localhost:8082/auth/';

  constructor(private httpClient:HttpClient) { }

  public nuevo(nuevoUsuario: any): Observable<any>{
    return this.httpClient.post<any>(this.authUrl + 'nuevo',nuevoUsuario);
  }
  public lista(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.authUrl + 'listar');
  }
  public detail(userName: string): Observable<any>{
    return this.httpClient.get<any>(this.authUrl + `detail/${userName}`);
  }
  public update(userName : string, usuario: any): Observable<any>{
    return this.httpClient.put<any>(this.authUrl + `update/${userName}`, usuario);
  }
  public delete(userName : string, usuario: any): Observable<any>{
    return this.httpClient.put<any>(this.authUrl + `delete/${userName}`, usuario);
  }

  public login(loginUsuario: any): Observable<JwtDTO>{
    return this.httpClient.post<JwtDTO>(this.authUrl + 'login',loginUsuario);
  }
}
