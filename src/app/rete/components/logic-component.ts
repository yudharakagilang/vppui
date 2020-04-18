import { Component, Output } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';

export class LogicComponent extends Component {

  constructor() {
    super('Logic');
  }

  builder(node) {
   

    return node
      
  }

  worker(node, inputs, outputs) {

  }
}
