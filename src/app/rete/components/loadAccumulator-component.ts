import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class LoadAccumulatorComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Load Accumulator');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  builder(node) {
    //const out1 = new Output('hostDB', 'String output socket',stringSocket);
    //const out2 = new Output('portDB', 'Number output socket',numSocket);
    //const out3 = new Output('databaseDB', 'String output socket',stringSocket);
    //const out4 = new Output('tableDB', 'String output socket',stringSocket);
    //const out5 = new Output('passwordDB', 'String output socket',stringSocket);
    //const out6 = new Output('usernameDB', 'String output socket',stringSocket);
    //const out7 = new Output('columnDB', 'String output socket',stringSocket);
    
    return node
          .addControl(new StringControl(this.editor, 'hostDB','Host'))
          .addControl(new NumControl(this.editor,'portDB','Port'))
          .addControl(new StringControl(this.editor,'databaseDB','Database'))
          .addControl(new StringControl(this.editor,'usernameDB','Username'))
          .addControl(new StringControl(this.editor,'passwordDB','Password'))
          .addControl(new StringControl(this.editor,'tableDB','Table'))
          .addControl(new StringControl(this.editor,'columnDB','Column'))        
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
