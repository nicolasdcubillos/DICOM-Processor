import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {

  authUrl = environment.authUrl+'tipoUsuarios';

  constructor(private httpClient:HttpClient) { }

  public lista(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.authUrl);
  }
  public delete(id : string): Observable<any>{
    return this.httpClient.delete<any>(this.authUrl + `/${id}`);
  }
  public getById(id: string): Observable<any>{
    let api = `${this.authUrl}/${id}`
    return this.httpClient.get(api);
  }
  public update(tipoUsuario: any,id:string): Observable<any>{
    return this.httpClient.put<any>(`${this.authUrl}/${id}`, tipoUsuario);
  }
  public create(tipoUsuario: any): Observable<any>{
    return this.httpClient.post<any>(this.authUrl,tipoUsuario);
  }
}
