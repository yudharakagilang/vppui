import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";

import { NodeEditor, Engine } from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { NumComponent } from "./components/number-component";
import { AddComponent } from "./components/add-component";
import { GenerateNumComponent } from "./components/generateNum-component";
import { MqttSubComponent } from "./components/mqttSub-component";
import { MqttPubComponent } from "./components/mqttPub-component";
import { MqttPostgresComponent } from "./components/mqttPostgres-component";
import { MqttAddComponent } from "./components/mqttAdd-component";
import { MqttMultiplyComponent } from "./components/mqttMultiply-component";
import { TopicMergeComponent } from "./components/topicMerge-component";
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
export class ReteComponent implements AfterViewInit {
  client$: Client;
  status: string = "not Saved";
  schema: any;

  constructor(private router: Router, private service: ClientService) {}

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
      new MqttAddComponent(),
      new MqttMultiplyComponent(),
      new TopicMergeComponent()
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

    this.service.getClient(lastSegment)
    .subscribe((client) => {
      this.client$ = client[0];
      var string1
      console.log(client[0])
      

      try {

        if (client[0].data == null){
        
        client[0].data={"id": "demo@0.2.0",
        "nodes":{}}  
      }
        string1 = JSON.stringify(client[0].data);
      console.log(string1)
          editor
            .fromJSON(JSON.parse(string1))
              .then(()=>{editor.on("error", err => {
                container.log(err);
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
                  engine.process(editor.toJSON());
                  this.schema = editor.toJSON();
                  console.log(this.schema);
                  this.status = "not Saved";
                }) as any
              );
        
              editor.view.resize();
              editor.trigger("process");
              
            
              
              });
        
      } catch (error) {
        console.log(error);
      }

     
    });
  }

  save() {
    var data = this.schema;
    console.log(data)
    var parts = this.router.url.split("/");
    var lastSegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.service.updateClientData(data, lastSegment).subscribe(
      (result) => {
        this.status = "Saved";
      },
      (error) => {
        this.status = "Not Saved";
      }
    );
  }
}
