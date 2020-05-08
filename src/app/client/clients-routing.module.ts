import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';
import { ClientChartComponent } from './client-chart/client-chart.component';
import { ClientAllChartComponent } from './client-all-chart/client-all-chart.component';

const clientsRoutes: Routes = [
  { path: 'clients', redirectTo: '/clients' },
  { path: 'client/:id', redirectTo: '/client/:id' },
  { path: 'chart/:id', redirectTo: '/chart/:id' },
  { path: 'allchart', redirectTo: '/allchart' },
  { path: 'clients',  component: ClientListComponent, data:{animation: 'Home'} },
  { path: 'client/:id', component: ClientDetailComponent, data:{animation: 'About'} },
  { path: 'chart/:id', component: ClientChartComponent, data:{animation: 'Contact'} },
  { path: 'allchart', component: ClientAllChartComponent, data:{animation: 'Contact'} },

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
