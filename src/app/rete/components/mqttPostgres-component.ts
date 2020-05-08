import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class MqttPostgresComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('MQTT DataBase');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  builder(node) {
    const out1 = new Output('server', 'String output socket',stringSocket);
    const out2 = new Output('portDB', 'Number output socket',numSocket);
    const out3 = new Output('database', 'String output socket',stringSocket);
    const out4 = new Output('table', 'String output socket',stringSocket);
    const out5 = new Output('passwordDB', 'String output socket',stringSocket);
    const out6 = new Output('usernameDB', 'String output socket',stringSocket);
    const out7 = new Output('topicStr', 'String output socket',stringSocket);
    const out8 = new Output('column', 'String output socket',stringSocket);
    const inp1 = new Input('topic', 'Topic',stringSocket);
    
    //inp1.addControl(new StringControl(this.editor, 'topicStr', 'Topic'));

    return node
          .addControl(new StringControl(this.editor, 'server','Server'))
          .addControl(new NumControl(this.editor,'portDB','Port'))
          .addControl(new StringControl(this.editor,'database','Database'))
          .addControl(new StringControl(this.editor,'table','Table'))
          .addControl(new StringControl(this.editor, 'column', 'Column')) 
          .addControl(new StringControl(this.editor,'usernameDB','Username'))
          .addControl(new StringControl(this.editor,'passwordDB','Password'))
          .addControl(new StringControl(this.editor, 'topicStr', 'Topic', true))
          .addInput(inp1)        
  }

  worker(node, inputs, outputs) {
    const str = inputs['topic'].length ? inputs['topic'][0] : node.data.topic;
    const ctrl = <StringControl> this.editor.nodes.find(n => n.id === node.id).controls.get('topicStr');
    ctrl.setValue(str);
    outputs['topic'] = node.data.topic;
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
