import { Component, Output } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';

export class MqttPubComponent extends Component {

  constructor() {
    super('MQTT Client Publisher');
  }

  builder(node) {
    const out1 = new Output('host', 'String output socket',stringSocket);
    const out2 = new Output('password', 'String output socket',stringSocket);
    const out3 = new Output('username', 'String output socket',stringSocket);
    const out4 = new Output('port', 'Number output socket',numSocket);
    const out5 = new Output('topic', 'String output socket',stringSocket);
    const out6 = new Output('message', 'String output socket',stringSocket);

    return node
          .addControl(new StringControl(this.editor, 'host','Host'))
          .addControl(new StringControl(this.editor,'password','Password'))
          .addControl(new StringControl(this.editor,'username','Username'))
          .addControl(new NumControl(this.editor,'port','Port'))
          .addControl(new StringControl(this.editor,'topic','Topic'))
          .addControl(new StringControl(this.editor,'message','Message'))
          //.addOutput(out1)
  }

  worker(node, inputs, outputs) {
    outputs['topic'] = node.data.topic;
  }
}
