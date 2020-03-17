import { Component, Input, Output, Node } from 'rete';
import { numSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class AddComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Add');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('num1', 'Number', numSocket);
    const inp2 = new Input('num2', 'Number', numSocket);
    const inp3 = new Input('num3', 'Number', numSocket);
    const out = new Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1'));
    inp2.addControl(new NumControl(this.editor, 'num2'));
    inp3.addControl(new NumControl(this.editor, 'num3'));

    node.addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addControl(new NumControl(this.editor, 'preview', 'hasil',true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1;
    const n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
    const n3 = inputs['num3'].length ? inputs['num3'][0] : node.data.num3;
    const sum = n1 + n2 + n3;

    const ctrl = <NumControl> this.editor.nodes.find(n => n.id === node.id).controls.get('preview');
    ctrl.setValue(sum);
    outputs['num'] = sum;
    
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
