import { Component, OnInit, OnDestroy } from "@angular/core";
import { Chart } from "chart.js";
import { Subscription } from "rxjs/internal/Subscription";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Client, RootObject} from "../client";
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
subscription pv{
	allPvs(first: 10, orderBy:INPUT_TIME_DESC){
    nodes{
      voltage
      current
      power
      energy
      inputTime
    }
  }
}
`;
const dconQuery = gql`
subscription dcon{
	allDcons(first: 10, orderBy:INPUT_TIME_DESC){
    nodes{
      voltage
      current
      power
      energy
      inputTime
    }
  }
}
`;
const inverterQuery = gql`
subscription inverter{
	allInverters(first: 10, orderBy:INPUT_TIME_DESC){
    nodes{
      voltage
      current
      power
      energy
      inputTime
    }
  }
}
`;
const stateQuery = gql`
subscription state {
  allStates(first: 10, orderBy:INPUT_TIME_DESC){
    nodes{
      cbPv
      cbPln
      cbFc
      cbDcLoad
      cbAcLoad
      inputTime
    }
  }
  }
`;
const pyranometerQuery = gql`
subscription pyranometer {
  allPyranometers(first: 10, orderBy:INPUT_TIME_DESC){
    nodes{
      pyranometer
      inputTime
    }
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

  respond : RootObject;
  // PV
  titlePV;
  dataPV;
  chartPVPower;
  chartPVEnergy;
  chartPVVoltage;
  chartPVCurrent;

  // DCON
  titleDcon;
  dataDcon;
  chartDconPower;
  chartDconEnergy;
  chartDconVoltage;
  chartDconCurrent;

  //Inverter
  titleInverter;
  dataInverter;
  chartInverterPower;
  chartInverterEnergy;
  chartInverterVoltage;
  chartInverterCurrent;

  //STATE
  titleState;
  dataState;

  //Pyranommeter
  titlePyranometer;
  dataPyranometer;
  chartPyranometer;
  

  lastsegment;
  _uri = "http://35.173.73.235:8080/v1alpha1/graphql";
  _uriWs = "ws://35.173.73.235:8080/v1alpha1/graphql";
  client$: Client;
  client;
  voltage;
  current;
  energy;
  power;
  inputTime;
  chartPyranometerPower: any;
  


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
  ngAfterViewInit(){
    //chart PV
    this.chartPVCurrent = new Chart('chartPVCurrent', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Current'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartPVVoltage = new Chart('chartPVVoltage', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartPVEnergy= new Chart('chartPVEnergy', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartPVPower= new Chart('chartPVPower', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    //chart Dcon
    this.chartDconCurrent = new Chart('chartDconCurrent', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Current'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartDconVoltage = new Chart('chartDconVoltage', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartDconEnergy= new Chart('chartDconEnergy', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartDconPower= new Chart('chartDconPower', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    //chart Inverter
    this.chartInverterCurrent = new Chart('chartInverterCurrent', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Current'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartInverterVoltage = new Chart('chartInverterVoltage', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartInverterEnergy= new Chart('chartInverterEnergy', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    this.chartInverterPower= new Chart('chartInverterPower', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });

    //chart Pyranometer
    this.chartPyranometer= new Chart('chartPyranometer', {
      type: 'line',
      data: {
        datasets: [
          {   
            name :"sell Price", 
            borderColor: "#3cba9f",
            fill: true
          },
          { 
            name :"buy Price", 
            borderColor: "#3cba",
            fill: true
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
        }
      }
    });
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
        .subscribe((data : RootObject) => {   
          this.dataPV =data.data.allPvs.nodes
          this.power = this.dataPV.map(node => node.power)
          this.current = this.dataPV.map(node => node.current)
          this.energy = this.dataPV.map(node => node.energy)
          this.voltage = this.dataPV.map(node => node.voltage)
          this.inputTime = this.dataPV.map(node => node.inputTime)
          this.titlePV = Object.keys(this.dataPV[0]);
          this.titlePV.pop("__typename");
          this.titlePV= this.captilize(this.titlePV)

          this.power = this.dataPV.map(node => node.power)
          this.current = this.dataPV.map(node => node.current)
          this.energy = this.dataPV.map(node => node.energy)
          this.voltage = this.dataPV.map(node => node.voltage)
          this.inputTime = this.dataPV.map(node => node.inputTime)
          this.updateChartData(this.chartPVCurrent,this.current, this.inputTime)
          this.updateChartData(this.chartPVVoltage,this.voltage, this.inputTime)
          this.updateChartData(this.chartPVEnergy,this.energy, this.inputTime)
          this.updateChartData(this.chartPVPower,this.power, this.inputTime)
          
          });
        //DCON
        this.apollo
        .subscribe({
          query: dconQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataDcon =data.data.allDcons.nodes
          this.titleDcon = Object.keys(this.dataDcon[0]);
          this.titleDcon.pop("__typename");
          this.titleDcon= this.captilize(this.titleDcon)
          this.power = this.dataDcon.map(node => node.power)
          this.current = this.dataDcon.map(node => node.current)
          this.energy = this.dataDcon.map(node => node.energy)
          this.voltage = this.dataDcon.map(node => node.voltage)
          this.inputTime = this.dataDcon.map(node => node.inputTime)
          this.updateChartData(this.chartDconCurrent,this.current, this.inputTime)
          this.updateChartData(this.chartDconVoltage,this.voltage, this.inputTime)
          this.updateChartData(this.chartDconEnergy,this.energy, this.inputTime)
          this.updateChartData(this.chartDconPower,this.power, this.inputTime)
          });

        //INVERTER
        this.apollo
        .subscribe({
          query: inverterQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataInverter =data.data.allInverters.nodes
          this.titleInverter = Object.keys(this.dataInverter[0]);
          this.titleInverter.pop("__typename");
          this.titleInverter= this.captilize(this.titleInverter)

          this.power = this.dataInverter.map(node => node.power)
          this.current = this.dataInverter.map(node => node.current)
          this.energy = this.dataInverter.map(node => node.energy)
          this.voltage = this.dataInverter.map(node => node.voltage)
          this.inputTime = this.dataInverter.map(node => node.inputTime)
          this.updateChartData(this.chartInverterCurrent,this.current, this.inputTime)
          this.updateChartData(this.chartInverterVoltage,this.voltage, this.inputTime)
          this.updateChartData(this.chartInverterEnergy,this.energy, this.inputTime)
          this.updateChartData(this.chartInverterPower,this.power, this.inputTime)
          });

        //State
        this.apollo
        .subscribe({
          query: stateQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataState =data.data.allStates.nodes
          this.titleState = Object.keys(this.dataState[0]);
          this.titleState.pop("__typename");
          this.titleState= this.captilize(this.titleState)
          });
        ///Pyranometer
        this.apollo
        .subscribe({
          query: pyranometerQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataPyranometer =data.data.allPyranometers.nodes
          this.titlePyranometer = Object.keys(this.dataPyranometer[0]);
          this.titlePyranometer.pop("__typename");
          this.titlePyranometer= this.captilize(this.titlePyranometer)
          this.irradiance = this.dataPyranometer.map(node => node.pyranometer)
          this.inputTime = this.dataPyranometer.map(node => node.inputTime)
          this.updateChartData(this.chartPyranometer,this.irradiance, this.inputTime)
          });
      },
      (error) => console.log("HAI")
    );
  
    }
  irradiance(chartPyranometer: any, irradiance: any, inputTime: any) {
    throw new Error("Method not implemented.");
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

    getFormattedDate(date : string){
      let current_datetime = new Date(date)
      let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() 
      return formatted_date
    }

     captilize(arr){
      let result=[]
      for(let i in arr){
      result.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1))
      }
      return result}

    updateChartData(chart, _data1,_label){  
      chart.data.labels = _label;
      chart.data.datasets[0].data = _data1;
      // chart.data.datasets[1].data = _data2;
      chart.update();
    }


}
