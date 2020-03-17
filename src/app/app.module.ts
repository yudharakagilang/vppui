import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReteComponent } from './rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';
import { NumberComponent } from './rete/controls/number-control';
import { MyNodeComponent } from './rete/components/node/node.component';
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
import { HttpClientModule } from '@angular/common/http';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'tailor.cloudmqtt.com',
  port : 12030,
  username : 'xjfsxsff',
  password : "K9phhM6agNJP",
  path: 'mqtt/python/test'

}
  
@NgModule({
  declarations: [
    AppComponent,
    ReteComponent,
    NumberComponent,
    MyNodeComponent,
    

    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReteModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NumberComponent, MyNodeComponent]
})
export class AppModule {}

