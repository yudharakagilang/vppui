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

  topic : string;
  message : string
  input_time : string
}


