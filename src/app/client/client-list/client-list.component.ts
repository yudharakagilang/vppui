import { Component, OnInit } from '@angular/core';

import { ClientService }  from '../client.service';
import { Client } from '../client';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients : Client[]
  selectedId : any
  newClient : Client[]
  


  constructor(
    private service: ClientService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getClients();
  }


  getClients() {
    
    this.service.getClients()
      .subscribe(
        client => {
          this.clients = client;
        },
        error => this.router.navigateByUrl('/login'));
  }

  addClient(name: string, location :string, url:string ): void {
   
    name = name.trim();
    location = location.trim();
    url = url.trim();
    if (!name || !location || !url) { return; }
    this.service.addClient({name,location,url} as Client)
    .subscribe(client => {
      this.clients.push(client);
      this.showSuccess("Client data added Succesfully")
    },

    error =>{
      this.showError()
    }
     
    );
  }

  deleteClient ( client: Client): void {
    this.clients = this.clients.filter(h => h !== client);
    this.service.removeClient(client._id)
      .subscribe(client => {
        this.showSuccess(("Client data deleted Succesfully"))
      },
  
      error =>{
        this.showError()
      }
       
      );
  }

  showSuccess(message : string){
    this.toastr.success(message, 'Success Info');
  }

  showError(){
    this.toastr.error('Error!!', 'Error Info')
  }
  

}
