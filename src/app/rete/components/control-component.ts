import { Component, Output } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';

export class ControlComponent extends Component {

  constructor() {
    super('Control');
  }

  builder(node) {
    const out1 = new Output('hostPub', 'String output socket',stringSocket);
    const out2 = new Output('passwordPub', 'String output socket',stringSocket);
    const out3 = new Output('usernamePub', 'String output socket',stringSocket);
    const out4 = new Output('portPub', 'Number output socket',numSocket);
 

    return node
          .addControl(new StringControl(this.editor, 'hostPub','Host'))
          .addControl(new NumControl(this.editor,'portPub','Port'))
          .addControl(new StringControl(this.editor,'usernamePub','Username'))
          .addControl(new StringControl(this.editor,'passwordPub','Password'))

          //.addOutput(out1)
  }

  worker(node, inputs, outputs) {
    outputs['topic'] = node.data.topic;
  }
}
