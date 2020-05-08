import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';
import { ClientChartComponent }  from './client-chart/client-chart.component';
import { ClientAllChartComponent }  from './client-all-chart/client-all-chart.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ReteComponent } from '../rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';
import { NumberComponent } from '../rete/controls/number-control';
import { MyNodeComponent } from '../rete/components/node/node.component';
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs'
  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClientsRoutingModule,
    ReteModule,
    MatTabsModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    ClientListComponent,
    ClientDetailComponent,
    ClientChartComponent,
    ClientAllChartComponent,
    ReteComponent,
    NumberComponent,
    MyNodeComponent
  ],
  entryComponents: [NumberComponent, MyNodeComponent]
})
export class ClientsModule {}
