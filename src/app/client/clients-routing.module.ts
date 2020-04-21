import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';
import { ClientChartComponent } from './client-chart/client-chart.component';

const clientsRoutes: Routes = [
  { path: 'clients', redirectTo: '/clients' },
  { path: 'client/:id', redirectTo: '/client/:id' },
  { path: 'chart/:id', redirectTo: '/chart/:id' },
  { path: 'clients',  component: ClientListComponent, data:{animation: 'About'} },
  { path: 'client/:id', component: ClientDetailComponent, data:{animation: 'Contact'} },
  { path: 'chart/:id', component: ClientChartComponent, data:{animation: 'Contact'} }
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
