import { Component, Input, Output, Node } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class MqttAddComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('MQTT Add');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('topic1', 'Topic1', stringSocket);
    const inp2 = new Input('topic2', 'Topic2', stringSocket);
    //const inp3 = new Input('topic3', 'Topic3', stringSocket);
    const out1 = new Output('division', 'Number output socket', numSocket);
    const out3 = new Output('mixedTopic', 'String output socket',stringSocket);
    const out2 = new Output('topicOut', 'Topic Out', stringSocket);

    //topic1.addControl(new StringControl(this.editor, 'topic1'));
    //topic2.addControl(new StringControl(this.editor, 'topic2'));
    //topic3.addControl(new StringControl(this.editor, 'topic3'));

    return node
      .addControl(new StringControl(this.editor, 'mixedTopic','Topic', true))
      .addControl(new NumControl(this.editor, 'division','Divider'))
      .addInput(inp1)
      .addInput(inp2)
      //.addInput(inp3)
      .addOutput(out2);
  }

  worker(node, inputs, outputs) {
    const a1 = inputs['topic1'].length ? inputs['topic1'][0] : node.data.topic1;
    const a2 = inputs['topic2'].length ? inputs['topic2'][0] : node.data.topic2;
    //const a3 = inputs['topic3'].length ? inputs['topic3'][0] : node.data.topic3;
    //const sumTopic = a1.concat("+", a2.toString());
    const sumTopic = (!`${a1}+${a2}`.match(/undefined/i)? `${a1}+${a2}`: (a1 != 'undefined'? a1: a2));

    const ctrl = <StringControl> this.editor.nodes.find(n => n.id === node.id).controls.get('mixedTopic');
    ctrl.setValue(sumTopic);
    outputs['topicOut'] = sumTopic;
    
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
