import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket,priceSocket, fromDbSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class LogicComponent extends Component implements AngularComponent {
  data: AngularComponentData;
  constructor() {
    super('Logic A');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('sellPrice', 'Sell Price', priceSocket);
    const inp2 = new Input('buyPrice', 'Buy Price', priceSocket);
    const inp3 = new Input('pvState', 'PV State', fromDbSocket);
    return node
    .addInput(inp1)
    .addInput(inp2)
    .addInput(inp3)
  
  }

  worker(node, inputs, outputs) {

  }
}
