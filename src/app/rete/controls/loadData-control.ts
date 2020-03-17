import { Component, Input, Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';

@Component({
  template: `<label>Load json data :</label><input type="file" [value]="value" [readonly]="readonly" (change)="change($event.target.value)">`,
  styles: [`
    input {
     
    }  
  `]
})
export class StringComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class loadDataControl extends Control implements AngularControl {
  component: Type<StringComponent>
  props: {[key: string]: unknown}
  
  constructor(public emitter, public key, public label ,readonly = false) {
    super(key);
    
    this.component = StringComponent;
    this.props = {
      readonly,
      change: v => this.onChange(v),
      value: 0,
      mounted: () => {
        this.setValue(this.getData(key) as any || "Default Value")
      },label:this.label+" : "
    };
  }

  onChange(val: string) {
    this.setValue(val);
    this.emitter.trigger('process');
  }

  setValue(val: string) {
    this.props.value = val;
    this.putData(this.key, this.props.value)
  }
}
