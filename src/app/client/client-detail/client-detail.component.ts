import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ClientService } from "../client.service";
import { Client } from "../client";
import { Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.css"],
})
export class ClientDetailComponent implements OnInit {
  client$: Client;
  public url: string;

  constructor(
    private router: Router,
    private service: ClientService,
    private titleService: Title,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    var parts = this.router.url.split("/");
    var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.getClient(lastSegment);
  }

  onChange(UpdatedUrl: string): void {
    this.url = UpdatedUrl;
  }

  getClient(id: any) {
    this.service.getClient(id).subscribe(
      (client) => {
        this.client$ = client[0];
        console.log(this.client$.streamData);
        this.titleService.setTitle(this.client$.name);
        this.url = this.client$.url;
      },
      (error) => this.router.navigateByUrl("/login")
    );
  }

  save(client: Client) {
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
    console.log(client._id)
    this.service.removeClient(client._id)
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
