import { Component, Output, Input } from 'rete';
import { numSocket, stringSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { StringControl } from '../controls/string-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent } from './node/node.component';

export class GeneratorAccumulatorComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Generator Accumulator');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent;
  }

  builder(node) {
    const out1 = new Output('hostDB', 'String output socket',stringSocket);
    const out2 = new Output('portDB', 'Number output socket',numSocket);
    const out3 = new Output('databaseDB', 'String output socket',stringSocket);
    const out4 = new Output('tableDB1', 'String output socket',stringSocket);
    const out5 = new Output('passwordDB', 'String output socket',stringSocket);
    const out6 = new Output('usernameDB', 'String output socket',stringSocket);
    const out7 = new Output('columnDB1', 'String output socket',stringSocket);
    const out8 = new Output('tableDB2', 'String output socket',stringSocket);
    const out9 = new Output('columnDB2', 'String output socket',stringSocket);
    const out10 = new Output('tableDB3', 'String output socket',stringSocket);
    const out11 = new Output('columnDB3', 'String output socket',stringSocket);

    return node
          .addControl(new StringControl(this.editor, 'hostDB','Host'))
          .addControl(new NumControl(this.editor,'portDB','Port'))
          .addControl(new StringControl(this.editor,'databaseDB','Database')) 
          .addControl(new StringControl(this.editor,'usernameDB','Username'))
          .addControl(new StringControl(this.editor,'passwordDB','Password'))
          .addControl(new StringControl(this.editor,'tableDB1','Table1'))
          .addControl(new StringControl(this.editor,'columnDB1','Column1'))
          .addControl(new StringControl(this.editor,'tableDB2','Table2'))
          .addControl(new StringControl(this.editor,'columnDB2','Column2'))       
          .addControl(new StringControl(this.editor,'tableDB3','Table3'))
          .addControl(new StringControl(this.editor,'columnDB3','Column3'))
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
