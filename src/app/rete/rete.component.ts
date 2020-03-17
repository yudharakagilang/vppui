import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { NumComponent } from './components/number-component';
import { AddComponent } from './components/add-component';
import { GenerateNumComponent} from './components/generateNum-component'
import { MqttSubComponent} from './components/mqttSub-component'
import { MqttPubComponent} from './components/mqttPub-component'
import { DummyDataComponent} from './components/dummyData-component'
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
// import { writeFileSync, readFileSync } from 'fs';

@Component({
  selector: 'app-rete',
  template: '<div class="wrapper"><div><button (click)="clickEvent()">Deploy</button></div><br><div #nodeEditor class="node-editor"></div></div>',
  styleUrls: ['./rete.component.css'],
})

export class ReteComponent implements AfterViewInit {

  constructor(private http: HttpClient) { }

//POST DATA

  public postData(s : any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
  
    return this.http.post('http://localhost:3000/tasks',s,httpOptions);
}


//GET DATA

public getData(){
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  return this.http.get('http://localhost:3000/readAndSendJson');
}


  @ViewChild('nodeEditor', { static: true }) el: ElementRef;
  editor = null;

  clickEvent(){

    
  }

  async ngAfterViewInit() {
    const container = this.el.nativeElement;

    const components = [new NumComponent(), new AddComponent(), new GenerateNumComponent(),new MqttSubComponent(),new MqttPubComponent(), new DummyDataComponent];

    const editor = new NodeEditor('demo@0.2.0', container);



    editor.use(ConnectionPlugin);
    editor.use(AngularRenderPlugin);//, { component: MyNodeComponent });
    editor.use(ContextMenuPlugin);

    const engine = new Engine('demo@0.2.0');

    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    // // const n1 = await components[0].createNode({ num: 1 });
    // // const n2 = await components[0].createNode({ num: 2 });
    // // const n3 = await components[0].createNode({ num: 3 });
    // const mqtt = await components[3].createNode();
    // const add2 = await components[1].createNode();

    // // n1.position = [80, 200];
    // // n2.position = [80, 400];
    // mqtt.position = [500, 240];
    // add2.position = [850, 240];
   

    // // editor.addNode(n1);
    // // editor.addNode(n2);
    // // editor.addNode(n3);
    // editor.addNode(mqtt);
    // editor.addNode(add2);
    // // editor.addNode(add2);

   var data  = this.getData().subscribe((res)=>{
       var string1 = JSON.stringify(res);
       console.log(string1)
       editor.fromJSON(JSON.parse(string1))
       return string1;
      
})
   



    editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], (async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
      // var a = readFileSync('editorStatus.json','utf8');
      var data = editor.toJSON();
      var dataString = JSON.stringify(data);
      // console.log(dataString);
       this.postData(dataString).subscribe((res)=>{
        console.log(res);
   });
    
    }) as any);

    editor.view.resize();
    editor.trigger('process');
  }
}
