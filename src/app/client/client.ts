import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Client {
  id: string;
  name: string;
  location:string;
  url:string;
  streamData:string;
  data : string;
  userid: number;
}

export interface User {
 username: string;
 id: number;
}
export interface Node {
  voltage: string;
  current: string;
  power: string;
  energy: string;
  irradiance: string;
  inputTime: Date;
}

export interface Nodes {
  nodes: Node[];
}

export interface Data {
  [key:string]: Nodes;
}

export interface RootObject {
  data: Data;
}



