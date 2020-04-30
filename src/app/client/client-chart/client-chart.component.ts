import { Component, OnInit, OnDestroy } from "@angular/core";
import { Chart } from "chart.js";
import { Subscription } from "rxjs/internal/Subscription";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Data, Client } from "../client";
import { Router } from "@angular/router";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-angular-link-http";
import { HttpClient } from "@angular/common/http";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";
import { split, Observable } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { Title } from "@angular/platform-browser";
import { ClientService } from "../client.service";
import * as mqttt from "mqtt";




// Query
const pvQuery = gql`
  subscription pv {
    pv(limit: 10,order_by:{input_time:desc}) {
      topic
      message
      input_time
    }
  }
`;
const dconQuery = gql`
subscription dcon {
    dcon(limit: 10,order_by:{input_time:desc}){
      topic
      message
      input_time
    }
  }
`;
const inverterQuery = gql`
subscription inverter {
    inverter(limit: 10,order_by:{input_time:desc}) {
      topic
      message
      input_time
    }
  }
`;
const stateQuery = gql`
subscription state {
    state(limit: 10,order_by:{input_time:desc}) {
      topic
      message
      input_time
    }
  }
`;
const pyranometerQuery = gql`
subscription pyranometer {
    pyranometer(limit: 10,order_by:{input_time:desc}) {
      topic
      message
      input_time
    }
  }
`;

// Subscription

  const subscription = gql`
  subscription tes {
    temperature (limit:20, order_by:{recorded_at:desc}){
      temperature
      location
      recorded_at
    }
  }
`;

@Component({
  selector: "app-client-chart",
  templateUrl: "./client-chart.component.html",
  styleUrls: ["./client-chart.component.css"],
})
export class ClientChartComponent implements OnInit, OnDestroy {
  todoSubscription: Subscription;

  titlePV;
  dataPV;
  titleDcon;
  dataDcon;
  titleInverter;
  dataInverter;
  titleState;
  dataState;
  titlePyranometer;
  dataPyranometer;
  lastsegment;
  _uri = "http://35.173.73.235:8080/v1alpha1/graphql";
  _uriWs = "ws://35.173.73.235:8080/v1alpha1/graphql";
  client$: Client;
  dataTemperature;
  titleTemperature;
  client


  constructor(
    private apollo: Apollo,
    private router: Router,
    private httpClient: HttpClient,
    private service: ClientService,
    private titleService: Title,){
       
   
    }
  //   // private _mqttService: MqttService
  // ) { _mqttService.connect({username: 'xjfsxsff', password: 'K9phhM6agNJP'});}

  ngOnInit() {
    var parts = this.router.url.split("/");
    this.lastsegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.getClient(this.lastsegment);   
    this.mqttConnect(); 
  }
  

  ngOnDestroy() {
    this.apollo.removeClient();
  }
  getQueryResult(_query, _dataToPlace, _title) {
    this.apollo
      .watchQuery({
        query: _query,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        _dataToPlace = data;
        var key1 = Object.keys(data);
        _title = Object.keys(data[key1.toString()][0]);
      });
  }

  getClient(id: any) {
    this.service.getClient(id).subscribe(
      (client) => {
        this.client$ = client[0];
        const httpLink = new HttpLink(this.httpClient).create({
          uri: this.client$.urlHasura,
        });

        const subscriptionLink = new WebSocketLink({
          uri: this.client$.urlHasura,

          options: {
            reconnect: true,
            connectionParams: {
              headers: {
                "x-hasura-admin-secret": "mylongsecretkey",
              },
            },
          },
        });

        const auth = setContext((operation, context) => ({
          headers: {
            "x-hasura-admin-secret": "mylongsecretkey",
          },
        }));

        const link = split(
          ({ query }) => {
            let definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          subscriptionLink,
          auth.concat(httpLink)
        );
        this.apollo.create({
          link,
          cache: new InMemoryCache(),
        });

        //PV
        this.apollo
        .subscribe({
          query: pvQuery
        })
        .subscribe(({ data }) => {   
            var key1 = Object.keys(data);
            this.titlePV = Object.keys(data[key1.toString()][0]);
            this.titlePV.pop("__typename");
            this.dataPV = data[key1.toString()];
          });
        //DCON
        this.apollo
        .subscribe({
          query: dconQuery
        })
        .subscribe(({ data }) => {  
            var key1 = Object.keys(data);
            this.titleDcon = Object.keys(data[key1.toString()][0]);
            this.titleDcon.pop("__typename");
            this.dataDcon = data[key1.toString()];
          });

        //INVERTER
        this.apollo
        .subscribe({
          query: inverterQuery
        })
        .subscribe(({ data }) => {  
            var key1 = Object.keys(data);
            this.titleInverter = Object.keys(data[key1.toString()][0]);
            this.titleInverter.pop("__typename");
            this.dataInverter = data[key1.toString()];
          });

        //State
        this.apollo
        .subscribe({
          query: stateQuery
        })
        .subscribe(({ data }) => {  
            var key1 = Object.keys(data);
            this.titleState = Object.keys(data[key1.toString()][0]);
            this.titleState.pop("__typename");
            this.dataState = data[key1.toString()];
          });
        ///Pyranometer
        this.apollo
        .subscribe({
          query: pyranometerQuery
        })
        .subscribe(({ data }) => {  
            var key1 = Object.keys(data);
            this.titlePyranometer = Object.keys(data[key1.toString()][0]);
            this.titlePyranometer.pop("__typename");
            this.dataPyranometer = data[key1.toString()];
          });

          this.apollo
          .subscribe({
            query: subscription
          })
          .subscribe(({ data }) => {   
            var key1 = Object.keys(data);
            this.titleTemperature = Object.keys(data[key1.toString()][0]);
            this.titleTemperature.pop("__typename");
            this.dataTemperature = data[key1.toString()];
          });
      },
      (error) => console.log("HAI")
    );
  
    }

    sendmsg(){
      // this.client.on('connect', function () {
        this.client.publish('/gilang123/presence123', 'Hello mqtt',{qos:2},function (err){
          if(!err){
            console.log("good")
          }
        })
    }

    mqttConnect(){
      this.client =  mqttt.connect({
        host: 'tailor.cloudmqtt.com',
        port: '32030' ,
        username: 'xjfsxsff',
        password: 'K9phhM6agNJP',
        protocol:'wss'
        
    })
    }
}
