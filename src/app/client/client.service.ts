import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Client,User } from './client';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../_services/url.service';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptionsSkip = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    // "Authorization": "my-auth-token",
    skip:"true"
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


  getAvailUser() {
    return this.http.get<User[]>(this.baseUrl+'useravail', httpOptions)
  }
  getAllUser() {
    return this.http.get<User[]>(this.baseUrl+'user', httpOptions)
  }
  removeUser(id :String) {
    return this.http.get<User[]>(this.baseUrl+'removeuser/'+id, httpOptions)
  }

  getClients() {
    return this.http.get<Client[]>(this.baseUrl+'get', httpOptions)
  }
  getClient(id : String) {
    return this.http.get(this.baseUrl+'get/'+id, httpOptions)
  }
  updateClient(data :Client){
    return this.http.put<Client>(this.baseUrl+'update/'+data.id,data,httpOptions)
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
  sendData(data :any, url:String){
    var apiUrl = "http://"+url
    console.log(apiUrl)
    return this.http.post(apiUrl,data,httpOptions);
  }
}
