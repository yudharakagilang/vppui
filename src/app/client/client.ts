import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Client {
  _id: string;
  name: string;
  location:string;
  url:string;
  streamData:string;
  data : string;
}
export interface Node {
  voltage: string;
  current: string;
  power: string;
  energy: string;
  pyranometer : string;
  input_time: Date;
}

export interface Nodes {
  nodes: Node[];
}

export interface Data {
  [key:string]: Node[];
}

export interface RootObject {
  data: Data;
}



