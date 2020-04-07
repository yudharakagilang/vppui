import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";

import { NodeEditor, Engine } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { NumComponent } from "./components/number-component";
import { AddComponent } from "./components/add-component";
import { GenerateNumComponent } from "./components/generateNum-component";
import { MqttSubComponent } from "./components/mqttSub-component";
import { MqttPubComponent } from "./components/mqttPub-component";
import { MqttPostgresComponent } from "./components/mqttPostgres-component";
import { DummyDataComponent } from "./components/dummyData-component";
import { AngularRenderPlugin } from "rete-angular-render-plugin";
import { Router } from "@angular/router";
import { ClientService } from "../client/client.service";
import { Client } from "../client/client";


// import { writeFileSync, readFileSync } from 'fs';

@Component({
  selector: "app-rete",
  templateUrl: "./rete.component.html",
  styleUrls: ["./rete.component.css"],
})
export class ReteComponent implements AfterViewInit{
  client$: Client
  status : string = "not Saved"
  schema : any

  

  constructor(
    private router: Router,
    private service: ClientService,
  ) {}


  @ViewChild("nodeEditor", { static: true }) el: ElementRef;
  editor = null;

  clickEvent() {}

  async ngAfterViewInit() {
    var parts = this.router.url.split("/");
    var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    
    const container = this.el.nativeElement;

    const components = [
      new NumComponent(),
      new AddComponent(),
      new GenerateNumComponent(),
      new MqttSubComponent(),
      new MqttPubComponent(),
      new DummyDataComponent(),
      new MqttPostgresComponent(),
    ];

    const editor = new NodeEditor("demo@0.2.0", container);

    editor.use(ConnectionPlugin);
    editor.use(AngularRenderPlugin); //, { component: MyNodeComponent });
    editor.use(ContextMenuPlugin);

    const engine = new Engine("demo@0.2.0");

    components.map((c) => {
      editor.register(c);
      engine.register(c);
    });

    // this.getClient(lastSegment,editor,engine);

      this.service.getClient(lastSegment).subscribe((client) => {
        this.client$ = client[0];
        var string1 = JSON.stringify(client[0].data);

        try {
          editor.fromJSON(JSON.parse(string1))
          
        } catch (error) {
          console.log(error)
        }
        
      });
    
    editor.on(
      [
        "process",
        "nodecreated",
        "noderemoved",
        "connectioncreated",
        "connectionremoved",
      ],
      (async () => {
       
      
        await engine.abort();
        await engine.process(editor.toJSON());
        this.schema= editor.toJSON();
        this.save()

      
      }) as any
    );

      
    editor.view.resize();
    editor.trigger("process");
    
  }

  save(){
    var data = this.schema
    var parts = this.router.url.split("/");
    var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    console.log(data)
    this.service.updateClientData(data,lastSegment)
    .subscribe(
      result => {
      this.status="Saved"
      },
      error => {
        this.status="Not Saved"
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );
    
  }
 
}
