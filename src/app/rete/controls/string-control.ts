import { Component, Input, Type } from '@angular/core';
import { Control } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';

@Component({
  template: `<label>{{label}}</label><input type="text" [value]="value" [readonly]="readonly" (change)="change($event.target.value)">`,
  styles: [`
    input {
      border-radius: 30px;
      background-color: white;
      padding: 2px 6px;
      border: 1px solid #999;
      font-size: 110%;
      width: 140px;
      box-sizing: border-box;
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

export class StringControl extends Control implements AngularControl {
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
        this.setValue(this.getData(key) as any || "")
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
