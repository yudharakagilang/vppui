import { Component, Output } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';

export class MqttComponent extends Component {

  constructor() {
    super('SuppyDemand');
  }

  builder(node) {
    const out1 = new Output('host', 'Number output socket',stringSocket);
    const out2 = new Output('password', 'Number output socket',stringSocket);
    const out3 = new Output('username', 'Number output socket',stringSocket);
    const out4 = new Output('port', 'Number output socket',numSocket);
    const out5 = new Output('topic', 'Number output socket',stringSocket);

    return node
          .addControl(new StringControl(this.editor, 'name','Nama'))
          .addControl(new StringControl(this.editor,'password','Password'))
          .addControl(new StringControl(this.editor,'username','Username'))
          .addControl(new NumControl(this.editor,'port','Port'))
          .addControl(new StringControl(this.editor,'topic','topic'))
  }

  worker(node, inputs, outputs) {
    outputs['name'] = node.data.name;
  }
}
