import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class MqttDatabaseComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('MQTT Database');
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
    //const inp1 = new Input('topic', 'Topic',stringSocket);
    const inp1 = new Input('topicMerge1', 'Topic1', stringSocket);
    const inp2 = new Input('topicMerge2', 'Topic2', stringSocket);
    const inp3 = new Input('topicMerge3', 'Topic3', stringSocket);
    const inp4 = new Input('topicMerge4', 'Topic4', stringSocket);
    const inp5 = new Input('topicMerge5', 'Topic5', stringSocket);
    
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
          .addInput(inp2)
          .addInput(inp3)
          .addInput(inp4)
          .addInput(inp5)        
  }

  worker(node, inputs, outputs) {
    const a1 = inputs['topicMerge1'].length ? inputs['topicMerge1'][0] : node.data.topicMerge1;
    const a2 = inputs['topicMerge2'].length ? inputs['topicMerge2'][0] : node.data.topicMerge2;
    const a3 = inputs['topicMerge3'].length ? inputs['topicMerge3'][0] : node.data.topicMerge3;
    const a4 = inputs['topicMerge4'].length ? inputs['topicMerge4'][0] : node.data.topicMerge4;
    const a5 = inputs['topicMerge5'].length ? inputs['topicMerge5'][0] : node.data.topicMerge5;
    
    //const mergeTopic = a1.concat("+", a2.toString());
    //const mergeTopic = (!`${a1},${a2},${a3},${a4},${a5}`.match(/undefined/i)? `${a1},${a2},${a3},${a4},${a5}`: (!`${a1},${a2},${a3},${a4}`.match(/undefined/i)? `${a1},${a2},${a3},${a4}`: (!`${a1},${a2},${a3}`.match(/undefined/i)? `${a1},${a2},${a3}`: (!`${a1},${a2}`.match(/undefined/i)? `${a1},${a2}`: (a1 != 'undefined'? a1: a2)))));
    
    const mergeTopic = ((a1 && a2 && a3 && a4 && a5) != '' ? `${a1},${a2},${a3},${a4},${a5}`: ((a1 && a2 && a3 && a4) != '' ? `${a1},${a2},${a3},${a4}`: ((a1 && a2 && a3) != '' ? `${a1},${a2},${a3}`: ((a1 && a2) != '' ? `${a1},${a2}`: (a1 != ''? a1: a2 || a3 || a4 || a5)))));
    
    //const str = inputs['topic'].length ? inputs['topic'][0] : node.data.topic;
    const ctrl = <StringControl> this.editor.nodes.find(n => n.id === node.id).controls.get('topicStr');
    ctrl.setValue(mergeTopic);
    outputs['topic'] = mergeTopic;
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
