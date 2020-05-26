import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';
import { ClientChartComponent } from './client-chart/client-chart.component';
import { ClientAllChartComponent } from './client-all-chart/client-all-chart.component';
import { ClientDetailTabComponent } from './client-detail-tab/client-detail-tab.component';

const clientsRoutes: Routes = [
  { path: 'clients', redirectTo: '/clients' },
  // { path: 'client/:id', redirectTo: '/client/:id' },
  // { path: 'chart/:id', redirectTo: '/chart/:id' },
  { path: 'allchart', redirectTo: '/allchart' },
  { path: 'client/data/:id', redirectTo: '/client/data/:id'},
  { path: 'client/data/:id', redirectTo: '/client/data/:id'},
  // { path: 'tab/:id', redirectTo: '/tab/:id' },
  { path: 'clients',  component: ClientListComponent, data:{animation: 'Home'} },
  // { path: 'client/:id', component: ClientDetailComponent, data:{animation: 'About'} },
  // { path: 'chart/:id', component: ClientChartComponent, data:{animation: 'Contact'} },
  { path: 'allchart', component: ClientAllChartComponent, data:{animation: 'Contact'} },
  { path: 'client', component: ClientDetailTabComponent, data:{animation: 'Contact'} ,children: [
    { path: 'data/:id', component: ClientChartComponent },
    { path: 'edit/:id', component: ClientDetailComponent },
 
]},

];

@NgModule({
  imports: [
    RouterModule.forChild(clientsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClientsRoutingModule { }
