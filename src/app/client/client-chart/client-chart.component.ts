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
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

const subscription = gql`
  subscription pv {
    pyranometer(limit: 1, order_by: { input_time: desc }) {
      message
      input_time
    }
  }
`;

const pvQuery = gql`
  query pv {
    pv(limit: 10) {
      topic
      message
      input_time
    }
  }
`;
const dconQuery = gql`
  query dcon {
    dcon(limit: 10) {
      topic
      message
      input_time
    }
  }
`;
const inverterQuery = gql`
  query inverter {
    inverter(limit: 10) {
      topic
      message
      input_time
    }
  }
`;
const stateQuery = gql`
  query state {
    state(limit: 10) {
      topic
      message
      input_time
    }
  }
`;
const pyranometerQuery = gql`
  query pyranometer {
    pyranometer(limit: 10) {
      topic
      message
      input_time
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

  constructor(
    private apollo: Apollo,
    private router: Router,
    private httpClient: HttpClient,
    private service: ClientService,
    private titleService: Title
  ) {}

  ngOnInit() {
    var parts = this.router.url.split("/");
    this.lastsegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.getClient(this.lastsegment);

    {
    }
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
          uri: this._uriWs,

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
          .watchQuery({
            query: pvQuery,
          })
          .valueChanges.subscribe(({ data, loading,errors }) => {
            var key1 = Object.keys(data);
            this.titlePV = Object.keys(data[key1.toString()][0]);
            this.titlePV.pop("__typename");
            this.dataPV = data[key1.toString()];
            console.log(loading)
          });
        //DCON
        this.apollo
          .watchQuery({
            query: dconQuery,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            var key1 = Object.keys(data);
            this.titleDcon = Object.keys(data[key1.toString()][0]);
            this.titleDcon.pop("__typename");
            this.dataDcon = data[key1.toString()];
          });

        //INVERTER
        this.apollo
          .watchQuery({
            query: inverterQuery,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            var key1 = Object.keys(data);
            this.titleInverter = Object.keys(data[key1.toString()][0]);
            this.titleInverter.pop("__typename");
            this.dataInverter = data[key1.toString()];
          });

        //State
        this.apollo
          .watchQuery({
            query: stateQuery,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            var key1 = Object.keys(data);
            this.titleState = Object.keys(data[key1.toString()][0]);
            this.titleState.pop("__typename");
            this.dataState = data[key1.toString()];
          });
        ///Pyranometer
        this.apollo
          .watchQuery({
            query: pyranometerQuery,
          })
          .valueChanges.subscribe(({ data, loading }) => {
            var key1 = Object.keys(data);
            this.titlePyranometer = Object.keys(data[key1.toString()][0]);
            this.titlePyranometer.pop("__typename");
            this.dataPyranometer = data[key1.toString()];
          });
      },
      (error) => console.log("HAI")
    );
  }
}
