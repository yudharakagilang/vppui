import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ClientService } from '../client/client.service';
import { User } from '../client/client';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  Users : User[]
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
    private service: ClientService,
    private toastr: ToastrService,) { 
    
  }

  ngOnInit() {
    this.getAllUser()
  }

  onSubmit() {
    console.log(this.form)
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.getAllUser()
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  getAllUser() {
    this.service.getAllUser()
      .subscribe(
        users => {
          this.Users = users;
          for(let i in users){
            if(users[i].role == 'user'){
              users[i].role = 'client'
            }
          }

        },
        error => {})
  }

  removeUser(id: string) {
    this.service.removeUser(id)
      .subscribe(
        users => {
          this.showSuccess("Success")
          this.getAllUser()
        },
        error => { this.showError(error)})
  }

  showSuccess(message: string) {
    this.toastr.success(message, "Success Info");
  }

  showError(error) {
    this.toastr.error(error);
  }
}
