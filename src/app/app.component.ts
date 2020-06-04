import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { slideInAnimation } from './route-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[ slideInAnimation ]
})
export class AppComponent {
  isAdmin = false
  title = 'VPP';
  roles: string;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  role :string
  user

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if(this.tokenStorageService.getUser() != null){
      if(this.tokenStorageService.getUser().roles == "admin" )
        this.isAdmin = true
    }

  


    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
    
      this.roles = this.user.roles;
      if(this.user.roles == 'user'){
        this.roles = 'client'
      }
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');


      this.username = this.user.username;
      this.roles = this.roles.charAt(0).toUpperCase() + this.roles.slice(1);
    
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
}

}
