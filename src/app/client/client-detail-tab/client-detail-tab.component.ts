import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './client-detail-tab.component.html',
  styleUrls: ['./client-detail-tab.component.css']
})
export class ClientDetailTabComponent implements OnInit {

  lastsegment : string
  isAdmin = false;
  constructor(
    private router: Router,
    private user: TokenStorageService
  ) {
    
   }

  ngOnInit() {
    if(this.user.getUser() != null){
      if(this.user.getUser().roles == "admin" )
        this.isAdmin = true
    }
    var parts = this.router.url.split("/");
    this.lastsegment = parts.pop() || parts.pop(); // handle potential trailing slash
    
  }

}