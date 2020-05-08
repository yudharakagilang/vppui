import { Component, Input, Output, Node } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class TopicMergeComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Merge');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('topicMerge1', 'Topic1/V', stringSocket);
    const inp2 = new Input('topicMerge2', 'Topic2/I', stringSocket);
    const inp3 = new Input('topicMerge3', 'Topic3/P', stringSocket);
    const inp4 = new Input('topicMerge4', 'Topic4/E', stringSocket);
    const inp5 = new Input('topicMerge5', 'Topic5', stringSocket);
    const out1 = new Output('topicMerge', 'String output socket',stringSocket);
    const out2 = new Output('topicMergeOut', 'Topic Merge Out', stringSocket);

    //topic1.addControl(new StringControl(this.editor, 'topic1'));
    //topic2.addControl(new StringControl(this.editor, 'topic2'));
    //topic3.addControl(new StringControl(this.editor, 'topic3'));

    return node
      .addControl(new StringControl(this.editor, 'topicMerge','Topic', true))
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addInput(inp4)
      .addInput(inp5)
      .addOutput(out2);
  }

  worker(node, inputs, outputs) {
    const a1 = inputs['topicMerge1'].length ? inputs['topicMerge1'][0] : node.data.topicMerge1;
    const a2 = inputs['topicMerge2'].length ? inputs['topicMerge2'][0] : node.data.topicMerge2;
    const a3 = inputs['topicMerge3'].length ? inputs['topicMerge3'][0] : node.data.topicMerge3;
    const a4 = inputs['topicMerge4'].length ? inputs['topicMerge4'][0] : node.data.topicMerge4;
    const a5 = inputs['topicMerge5'].length ? inputs['topicMerge5'][0] : node.data.topicMerge5;
    
    //const mergeTopic = a1.concat("+", a2.toString());
    const mergeTopic = (!`${a1},${a2},${a3},${a4},${a5}`.match(/undefined/i)? `${a1},${a2},${a3},${a4},${a5}`: (!`${a1},${a2},${a3},${a4}`.match(/undefined/i)? `${a1},${a2},${a3},${a4}`: (!`${a1},${a2},${a3}`.match(/undefined/i)? `${a1},${a2},${a3}`: (!`${a1},${a2}`.match(/undefined/i)? `${a1},${a2}`: (a1 != 'undefined'? a1: a2)))));
    
    const ctrl = <StringControl> this.editor.nodes.find(n => n.id === node.id).controls.get('topicMerge');
    ctrl.setValue(mergeTopic);
    outputs['topicMergeOut'] = mergeTopic;
    
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
