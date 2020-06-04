import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent }    from './client/page-not-found/page-not-found.component';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [

  { path: '',   redirectTo: '/subsystems', pathMatch: 'full',data: {animation: 'Home'}, },
  { path: 'login', component: LoginComponent,data:{animation: 'About'} },
  { path: 'register', component: RegisterComponent,data:{animation: 'Home'} },
  { path: '**', component: PageNotFoundComponent },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategyService,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
