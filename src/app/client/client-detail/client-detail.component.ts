
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ClientService }  from '../client.service';
import { Client } from '../client';
import {Title} from "@angular/platform-browser";
import { ToastrService } from 'ngx-toastr'


@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  client$: Client
  public url : string;

  constructor(
    private router: Router,
    private service: ClientService,
    private titleService:Title,
    private toastr : ToastrService
  ) {}

  ngOnInit() {
    var parts = this.router.url.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    this.getClient(lastSegment)
  }

  onChange(UpdatedUrl : string) :void
  {
    this.url = UpdatedUrl;
  }

  getClient(id : any) {
    
    this.service.getClient(id)
      .subscribe(
        client => {
          this.client$ = client[0];
          this.titleService.setTitle(this.client$.name)
          this.url = this.client$.url;
        },
        error => this.router.navigateByUrl('/login')
        )
  }

  save(client : Client) {
    this.service.updateClient(client)
      .subscribe(
        client => {
        this.client$ = client;
        this.titleService.setTitle(client.name);
        this.showSuccess("Client data updated Succesfully")
        },
    
        error =>{
          this.showError()
        });

  }

  showSuccess(message : string){
    this.toastr.success(message, 'Success Info');
  }

  showError(){
    this.toastr.error('Error!!', 'Error Info')
  }

}
