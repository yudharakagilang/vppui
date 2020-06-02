import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ClientService } from "../client.service";
import { Client, User } from "../client";
import { Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.css"],
})
export class ClientDetailComponent implements OnInit {
  client$: Client;
  public url: string;
  ids: any[]
  usernames: any[]
  Users : User[]
  nrSelect = 0
  isAdmin= false;

  constructor(
    private router: Router,
    private service: ClientService,
    private titleService: Title,
    private toastr: ToastrService,
    private user : TokenStorageService
  ) {}

  ngOnInit() {
    
  
    var parts = this.router.url.split("/");
    var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.getAllUser()
    this.getClient(lastSegment);
    
  }

  onChange(UpdatedUrl: string): void {
    this.url = UpdatedUrl;
  }

  getClient(id: any) {
    this.service.getClient(id).subscribe(
      (client) => {
        this.client$ = client[0];
        console.log(this.client$)
        this.titleService.setTitle(this.client$.name);
        this.nrSelect = this.client$.userid
        console.log(this.client$.userid)
        this.url = this.client$.url;
      },
      (error) => this.router.navigateByUrl("/login")
    );
  }

  getAllUser() {
    
    this.service.getAllUser()
      .subscribe(
        users => {
          this.Users = users;
          this.ids = this.Users.map(x => x.id)
          this.usernames = this.Users.map(x => x.username)
          console.log(this.usernames)
        },
        error => {})
  }

  save(client: Client, nrSelect) {
    client.userid = nrSelect
    this.service.updateClient(client).subscribe(
      (client) => {
        this.client$ = client;
        this.titleService.setTitle(client.name);
        this.showSuccess("Client data updated Succesfully");
      },

      (error) => {
        this.showError();
      }
    );
  }

  deleteClient ( client: Client): void {
    console.log(client.id)
    this.service.removeClient(client.id)
      .subscribe(client => {
        this.showSuccess(("Client data deleted Succesfully"))
        this.router.navigateByUrl("/clients")
      },
      error =>{
        this.showError()
      }
       
      );
  }

  showSuccess(message: string) {
    this.toastr.success(message, "Success Info");

  }

  showError() {
    this.toastr.error("Error!!", "Error Info");
  }
}
