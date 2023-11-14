import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  authUrl = environment.authUrl+'registros';

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
  public getByUuid(uuid: string): Observable<any>{
    let api = `${this.authUrl}/byUuid/${uuid}`
    return this.httpClient.get(api);
  }
  public update(id : string, registro: any): Observable<any>{
    return this.httpClient.put<any>(`${this.authUrl}/${id}`, registro);
  }
  public updateSeen(uuid : string, seen: boolean, registro: any): Observable<any>{
    return this.httpClient.put<any>(`${this.authUrl}/updateSeenStatus/${uuid}/${seen}`, registro);
  }
  public create(registro: any): Observable<any>{
    return this.httpClient.post<any>(this.authUrl,registro);
  }
}
