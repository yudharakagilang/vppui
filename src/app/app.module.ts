import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent }   from './client/page-not-found/page-not-found.component';
import { AppRoutingModule }        from './app-routing.module';
import { ClientsModule }            from './client/clients.module';
import { FormsModule }    from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { GraphQLConfigModule } from './_services/apollo.config';
import {MatTabsModule} from '@angular/material/tabs'
import { MqttService, MqttModule } from 'ngx-mqtt';




@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ClientsModule,
    AppRoutingModule,
    GraphQLConfigModule,
    MatTabsModule,
    MqttModule,
    ToastrModule.forRoot(),
  ],
  providers: [authInterceptorProviders,{provide : LocationStrategy , useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
  
})
export class AppModule {}

