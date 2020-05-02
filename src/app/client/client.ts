import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Client {
  _id: string;
  name: string;
  location:string;
  url:string;
  urlHasura:string;
  data : string;
}

export interface Pv {

  pv : [Data]
}


export interface Data{

  voltage : string
  current : string
  power : string
  energy : string
  input_time : string
}

export interface state {
  cb_pv : string
  cb_pln: string
  cb_fc : string
  cb_dc_load : string
  cb_ac_load: string
  input_time: string
}

export interface Data2{
  temperature: string;
  location: string;
  recorded_at: string;
}


