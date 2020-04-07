import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';

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

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'tailor.cloudmqtt.com',
  port : 12030,
  username : 'xjfsxsff',
  password : "K9phhM6agNJP",
  path: 'mqtt/python/test'

}
  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClientsRoutingModule,
    ReteModule,
  ],
  declarations: [
    ClientListComponent,
    ClientDetailComponent,
    ReteComponent,
    NumberComponent,
    MyNodeComponent
  ],
  entryComponents: [NumberComponent, MyNodeComponent]
})
export class ClientsModule {}
