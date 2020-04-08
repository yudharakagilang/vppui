import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Client } from './client';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../_services/url.service';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private baseUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) {}

  getClients() {
    return this.http.get<Client[]>(this.baseUrl+'get', httpOptions)
  }

  getClient(id : String) {
    return this.http.get(this.baseUrl+'get/'+id, httpOptions)
  }

  updateClient(data :Client){
    return this.http.put<Client>(this.baseUrl+'update/'+data._id,data,httpOptions)
  }
  updateClientData(data :any, id : String){
    return this.http.put(this.baseUrl+'updateData/'+id,data,httpOptions)
  }
  addClient(data :Client){
    return this.http.post<Client>(this.baseUrl+'create',data,httpOptions).pipe(
      tap((client: Client) => console.log(`added hero w/ id=${JSON.stringify(client)}`)));
  }

  removeClient(id : String){
    return this.http.delete(this.baseUrl+'remove/'+id,httpOptions)
}
}
