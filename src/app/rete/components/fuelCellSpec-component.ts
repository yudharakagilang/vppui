import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class FuelCellComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('FuelCell Specification');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  builder(node) {
    //const out1 = new Output('power', 'String output socket',numSocket);

    return node
          .addControl(new NumControl(this.editor, 'power','Power'))
  }

  worker(node, inputs, outputs) {
    
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
