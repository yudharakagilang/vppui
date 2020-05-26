import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './client-detail-tab.component.html',
  styleUrls: ['./client-detail-tab.component.css']
})
export class ClientDetailTabComponent implements OnInit {

  lastsegment : string
  constructor(
    private router: Router
  ) {
    
   }

  ngOnInit() {
    var parts = this.router.url.split("/");
    this.lastsegment = parts.pop() || parts.pop(); // handle potential trailing slash
    
  }

}