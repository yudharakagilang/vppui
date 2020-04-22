import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs/internal/Subscription';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Data } from '../client';
import { Router } from '@angular/router';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

const subscription = gql`
subscription pv {
  pyranometer(limit:1, order_by:{input_time:desc}){
    message
    input_time
  }
}
`;

const pvQuery = gql `query pv {
  pv(limit: 10) {
    topic
    message
    input_time
  }
}`
const dconQuery = gql `query dcon {
  dcon(limit:10)
  {topic
  message
  input_time
  }
}`
const inverterQuery = gql `query inverter {
  inverter(limit:10)
  {topic
  message
  input_time
  }
}`
const stateQuery = gql `query state {
  state(limit:10)
  {topic
  message
  input_time
  }
}`
const pyranometerQuery = gql `query pyranometer {
  pyranometer(limit:10)
  {topic
  message
  input_time
  }
}
`

@Component({
  selector: 'app-client-chart',
  templateUrl: './client-chart.component.html',
  styleUrls: ['./client-chart.component.css']
})
export class ClientChartComponent implements OnInit,OnDestroy {



  todoSubscription: Subscription;
 

  titlePV 
  dataPV 
  titleDcon
  dataDcon
  titleInverter
  dataInverter
  titleState
  dataState
  titlePyranometer
  dataPyranometer 
  lastsegment


  constructor(private apollo: Apollo,
    private router: Router,
     ) {}

ngOnInit() {
  var parts = this.router.url.split('/');
  this.lastsegment= parts.pop() || parts.pop();  // handle potential trailing slash

     // handle potential trailing slash
  

//PV
    this.apollo.watchQuery({
      query: pvQuery
    }).valueChanges
    .subscribe(({ data, loading }) => {
      var key1 = Object.keys(data)
      this.titlePV = Object.keys(data[key1.toString()][0])
      this.titlePV.pop("__typename")
      this.dataPV = data[key1.toString()]
    })
//DCON
    this.apollo.watchQuery({
      query: dconQuery
    }).valueChanges
    .subscribe(({ data, loading }) => {
      var key1 = Object.keys(data)
      this.titleDcon= Object.keys(data[key1.toString()][0])
      this.titleDcon.pop("__typename")
      this.dataDcon = data[key1.toString()]
      
    })


//INVERTER
    this.apollo.watchQuery({
      query: inverterQuery
    }).valueChanges
    .subscribe(({ data, loading }) => {
      var key1 = Object.keys(data)
      this.titleInverter = Object.keys(data[key1.toString()][0])
      this.titleInverter.pop("__typename")
      this.dataInverter = data[key1.toString()]
    })

//State
    this.apollo.watchQuery({
      query: stateQuery
    }).valueChanges
    .subscribe(({ data, loading }) => {
      var key1 = Object.keys(data)
      this.titleState = Object.keys(data[key1.toString()][0])
      this.titleState.pop("__typename")
      this.dataState = data[key1.toString()]
    })


///Pyranometer
    this.apollo.watchQuery({
      query: pyranometerQuery
    }).valueChanges
    .subscribe(({ data, loading }) => {
      var key1 = Object.keys(data)
      this.titlePyranometer = Object.keys(data[key1.toString()][0])
      this.titlePyranometer.pop("__typename")
      this.dataPyranometer = data[key1.toString()]
    })

  }

  ngOnDestroy() {
    // this.todoSubscription.unsubscribe();
  }
  getQueryResult(_query,_dataToPlace,_title){
    this.apollo.watchQuery({
      query: _query
    }).valueChanges
    .subscribe(({ data, loading }) => {
    _dataToPlace = data
     var key1 = Object.keys(data)
    _title = Object.keys(data[key1.toString()][0])
    
   });
  }

}
