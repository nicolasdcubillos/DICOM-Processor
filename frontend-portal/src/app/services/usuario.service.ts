import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  authUrl = environment.authUrl+'usuarios';

  constructor(private httpClient:HttpClient) { }

  public lista(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.authUrl);
  }
  public delete(userId : string): Observable<any>{
    return this.httpClient.delete<any>(this.authUrl + `/${userId}`);
  }
  public getById(userId: string): Observable<any>{
    let api = `${this.authUrl}/${userId}`
    return this.httpClient.get(api);
  }
  public update(userId : string, usuario: any): Observable<any>{
    return this.httpClient.put<any>(this.authUrl + `/${userId}`, usuario);
  }
  public create(nuevoUsuario: any): Observable<any>{
    return this.httpClient.post<any>(this.authUrl,nuevoUsuario);
  }
}
