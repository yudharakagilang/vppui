import { Component, Input, Output, Node } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class MqttMultiplyComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('MQTT Multiply');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('topicMul1', 'Topic1', stringSocket);
    const inp2 = new Input('topicMul2', 'Topic2', stringSocket);
    //const inp3 = new Input('topicMul3', 'Topic3', stringSocket);
    //const out1 = new Output('division', 'Number output socket', numSocket);
    const out3 = new Output('mixedMulTopic', 'String output socket',stringSocket);
    const out2 = new Output('topicMulOut', 'Topic Out', stringSocket);

    //topic1.addControl(new StringControl(this.editor, 'topic1'));
    //topic2.addControl(new StringControl(this.editor, 'topic2'));
    //topic3.addControl(new StringControl(this.editor, 'topic3'));

    return node
      .addControl(new StringControl(this.editor, 'mixedMulTopic','Topic', true))
      //.addControl(new NumControl(this.editor, 'division','Divider'))
      .addInput(inp1)
      .addInput(inp2)
      //.addInput(inp3)
      .addOutput(out2);
  }

  worker(node, inputs, outputs) {
    const m1 = inputs['topicMul1'].length ? inputs['topicMul1'][0] : "";
    const m2 = inputs['topicMul2'].length ? inputs['topicMul2'][0] : "";
    //const m3 = inputs['topicMul3'].length ? inputs['topicMul3'][0] : node.data.topicMul3;
    //const mulTopic = m1.concat("+", m2.toString());
    //const mulTopic = (!`${m1}x${m2}`.match(/undefined/i)? `${m1}x${m2}`: (m1 != 'undefined'? m1: m2));
    const mulTopic = ((m1 && m2) != '' ? `${m1}x${m2}`: (m1 != '' ? m1: m2));

    const ctrl = <StringControl> this.editor.nodes.find(n => n.id === node.id).controls.get('mixedMulTopic');
    ctrl.setValue(mulTopic);
    outputs['topicMulOut'] = mulTopic;
    
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  } 
}
