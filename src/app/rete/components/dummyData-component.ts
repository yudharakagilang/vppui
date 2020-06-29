import { Component, Output } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { loadDataControl } from '../controls/loadData-control';

export class DummyDataComponent extends Component {

  constructor() {
    super('DummyData');
  }

  builder(node) {
    //const out1 = new Output('Out', 'Number output socket',numSocket);
  

    return node
          .addControl(new loadDataControl(this.editor, 'name','Nama'))
       
  }

  worker(node, inputs, outputs) {
    outputs['name'] = node.data.name;
  }
}
