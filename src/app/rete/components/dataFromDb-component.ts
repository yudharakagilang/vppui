import { Component, Output } from 'rete';
import { numSocket, stringSocket, priceSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';

export class DataFromDb extends Component {

  constructor() {
    super('Last Data From Db');
  }

  builder(node) {
    const out1 = new Output('url', 'url',priceSocket);
  

    return node
          .addControl(new StringControl(this.editor, 'url','url'))
          .addOutput(out1)
  }

  worker(node, inputs, outputs) {
    outputs['url'] = node.data.url;
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
