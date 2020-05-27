import { Component, OnInit, OnDestroy } from "@angular/core";
import { Chart } from "chart.js";
import { Subscription } from "rxjs/internal/Subscription";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Client, RootObject } from "../client";
import { Router } from "@angular/router";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-angular-link-http";
import { HttpClient } from "@angular/common/http";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { Title } from "@angular/platform-browser";
import { ClientService } from "../client.service";
import * as mqttt from "mqtt";


// Subscription
const pvSubscription = gql`
  subscription pv {
    pv(limit: 100, order_by: { input_time: desc }) {
      voltage
      current
      power
      energy
      input_time
    }
  }
`;
const dconSubscription = gql`
  subscription dcon {
    dcon(limit: 100, order_by: { input_time: desc }) {
      voltage
      current
      power
      energy
      input_time
    }
  }
`;
const inverterSubscription = gql`
  subscription inverter {
    inverter(limit: 100, order_by: { input_time: desc }) {
      voltage
      current
      power
      energy
      input_time
    }
  }
`;
const stateSubscription = gql`
  subscription state {
    state(limit: 100, order_by: { input_time: desc }) {
      cb_pv
      cb_pln
      cb_fc
      cb_dc_load
      cb_ac_load
      input_time
    }
  }
`;
const fuelcellSubscription = gql`
  subscription fuelcell {
    fc(limit: 100, order_by: { input_time: desc }) {
      power
      input_time
    }
  }
`;
const batteryGenerationSubscription = gql`
  subscription batteryGeneration {
    export(limit: 100, order_by: { input_time: desc }) {
      power
      input_time
    }
  }
`;
const batteryPercentageSubscription = gql`
  subscription batteryPercentage {
    percentage(limit: 1, order_by: { input_time: desc }) {
      percentage
      input_time
    }
  }
`;
const generationSubscription = gql`
  subscription generation {
    kwh_generator(limit: 100, order_by: { input_time: desc }) {
      kwhperdate
      input_time
    }
  }
`;

const loadSubscription = gql`
  subscription load {
    kwh_load(limit: 100, order_by: { input_time: desc }) {
      kwhperdate
      input_time
    }
  }
`;

const pvEnergyQuery = gql`
  query pvEnergyQuery($time_1: timestamp!, $time_2: timestamp!) {
    pv: fifteen_minute_pv_energy(
      where: {
        _and: [{ bucket: { _gte: $time_1 } }, { bucket: { _lte: $time_2 } }]
      }
    ) {
      power
      time: bucket
    }
  }
`;
const dconEnergyQuery = gql`
  query dconEnergyQuery($time_1: timestamp!, $time_2: timestamp!) {
    dcon: fifteen_minute_dcon_energy(
      where: {
        _and: [{ bucket: { _gte: $time_1 } }, { bucket: { _lte: $time_2 } }]
      }
    ) {
      power
      time: bucket
    }
  }
`;

const inverterEnergyQuery = gql`
  query inverterEnergyQuery($time_1: timestamp!, $time_2: timestamp!) {
    inverter: fifteen_minute_inverter_energy(
      where: {
        _and: [{ bucket: { _gte: $time_1 } }, { bucket: { _lte: $time_2 } }]
      }
    ) {
      power
      time: bucket
    }
  }
`;

const fuelCellEnergyQuery = gql`
  query fuelCellEnergyQuery($time_1: timestamp!, $time_2: timestamp!) {
    fc: fifteen_minute_fc_energy(
      where: {
        _and: [{ bucket: { _gte: $time_1 } }, { bucket: { _lte: $time_2 } }]
      }
    ) {
      power
      time: bucket
    }
  }
`;

const batteryGenerationQuery = gql`
  query batteryGenerationQuery($time_1: timestamp!, $time_2: timestamp!) {
    batteryExport: fifteen_minute_battery_power(
      where: {
        _and: [{ bucket: { _gte: $time_1 } }, { bucket: { _lte: $time_2 } }]
      }
    ) {
      power
      time: bucket
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

  respond: RootObject;
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

  //Load
  titleLoad;
  dataLoad;

   //Fuelcell
   titleFuelcell;
   dataFuelcell;
   chartFuelcellPower;

   //Battery Generation
   titleBatteryGeneration
   dataBatteryGeneration
   chartBatteryPower

   //Battery Percentage
   titleBatteryPercentage
   dataBatteryPercentage

  //Generator
  titleGeneration;
  dataGeneration;

  lastsegment;
  client$: Client;
  client;
  voltage;
  current;
  energy;
  power;
  input_time;
  chartPyranometerPower: any;
  result;
  firsttime: boolean = true;

  activeTab: string = "nav-pv-tab";
  onSelect(data): void {
    this.activeTab = data;
  }

  constructor(
    private apollo: Apollo,
    private router: Router,
    private httpClient: HttpClient,
    private service: ClientService,
  ) {}
  //   // private _mqttService: MqttService
  // ) { _mqttService.connect({username: 'xjfsxsff', password: 'K9phhM6agNJP'});}

  ngOnInit() {
    
    this.apollo.removeClient()
    var parts = this.router.url.split("/");
    this.lastsegment = parts.pop() || parts.pop(); // handle potential trailing slash
    this.getClient(this.lastsegment);
    this.mqttConnect();
  
  }
  ngAfterViewInit() {
 
    //chart PV
    // this.chartPVCurrent = new Chart('chartPVCurrent', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{

    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Current'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartPVVoltage = new Chart('chartPVVoltage', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Voltage'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartPVEnergy= new Chart('chartPVEnergy', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Energy'
    //         }
    //       }],
    //     }
    //   }
    // });

    this.chartPVPower = new Chart("chartPVPower", {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: "#3cba9f",
            fill: true,
          },
          {
            borderColor: "#3cba",
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Power (Watt)",
              },
            },
          ],
        },
      },
    });

    //chart Dcon
    // this.chartDconCurrent = new Chart('chartDconCurrent', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Current'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartDconVoltage = new Chart('chartDconVoltage', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Voltage'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartDconEnergy= new Chart('chartDconEnergy', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Energy'
    //         }
    //       }],
    //     }
    //   }
    // });

    this.chartDconPower = new Chart("chartDconPower", {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: "#3cba9f",
            fill: true,
          },
          {
            borderColor: "#3cba",
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Power (Watt)",
              },
            },
          ],
        },
      },
    });

    //chart Inverter
    // this.chartInverterCurrent = new Chart('chartInverterCurrent', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Current'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartInverterVoltage = new Chart('chartInverterVoltage', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Voltage'
    //         }
    //       }],
    //     }
    //   }
    // });

    // this.chartInverterEnergy= new Chart('chartInverterEnergy', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Energy'
    //         }
    //       }],
    //     }
    //   }
    // });

    this.chartInverterPower = new Chart("chartInverterPower", {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: "#3cba9f",
            fill: true,
          },
          {
            borderColor: "#3cba",
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Power (Watt)",
              },
            },
          ],
        },
      },
    });

    // //chart Pyranometer
    // this.chartPyranometer= new Chart('chartPyranometer', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {

    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       {

    //         borderColor: "#3cba",
    //         fill: true
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         type: 'time',
    //         scaleLabel: {

    //           display: true,
    //           labelString: 'Irradiance'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Time'
    //         }
    //       }],
    //     }
    //   }
    // });

    this.chartFuelcellPower = new Chart("chartFuelcellPower", {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: "#3cba9f",
            fill: true,
          },
          {
            borderColor: "#3cba",
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Power (Watt)",
              },
            },
          ],
        },
      },
    });

    this.chartBatteryPower = new Chart("chartBatteryPower", {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: "#3cba9f",
            fill: true,
          },
          {
            borderColor: "#3cba",
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: true,
                labelString: "Time",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Power (Watt)",
              },
            },
          ],
        },
      },
    });

  }

  

  ngOnDestroy() {
    this.apollo.removeClient();
  }


  
  getQueryResult(_query, _dataToPlace, _title) {
    this.apollo
      .watchQuery({
        query: _query,
        errorPolicy:'ignore'
      })
      .valueChanges.subscribe(({ data }) => {
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
          uri: "http://" + this.client$.streamData,
        });

        const subscriptionLink = new WebSocketLink({
          uri: "ws://" + this.client$.streamData,

          options: {
            reconnect: true,
            connectionParams: {
              // headers: {
              //   "x-hasura-admin-secret": "mylongsecretkey",
              // },
            },
          },
        });

        const auth = setContext(() => ({
          // headers: {
          //   "x-hasura-admin-secret": "mylongsecretkey",
          // },
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
            query: pvSubscription
            
          })
          .subscribe((data: RootObject) => {
            this.dataPV = data.data.pv;
            this.power = this.dataPV.map((node) => node.power);
            this.current = this.dataPV.map((node) => node.current);
            this.energy = this.dataPV.map((node) => node.energy);
            this.voltage = this.dataPV.map((node) => node.voltage);
            this.input_time = this.dataPV.map((node) => node.input_time);
            this.titlePV = Object.keys(this.dataPV[0]);
            this.titlePV.pop("__typename");
            this.titlePV = this.captilize(this.titlePV);
            this.titlePV = this.giveUnit(this.titlePV)

            // this.updateChartData(this.chartPVCurrent,this.current, this.input_time)
            // this.updateChartData(this.chartPVVoltage,this.voltage, this.input_time)
            // this.updateChartData(this.chartPVEnergy,this.energy, this.input_time)
            // this.updateChartData(this.chartPVPower,this.power, this.input_time)
          }
          );
        //DCON
        this.apollo
          .subscribe({
            query: dconSubscription,
          })
          .subscribe((data: RootObject) => {
            this.dataDcon = data.data.dcon;
            this.titleDcon = Object.keys(this.dataDcon[0]);
            this.titleDcon.pop("__typename");
            this.titleDcon = this.captilize(this.titleDcon);
            this.titleDcon = this.giveUnit(this.titleDcon)
            this.power = this.dataDcon.map((node) => node.power);
            this.current = this.dataDcon.map((node) => node.current);
            this.energy = this.dataDcon.map((node) => node.energy);
            this.voltage = this.dataDcon.map((node) => node.voltage);
            this.input_time = this.dataDcon.map((node) => node.input_time);
            // this.updateChartData(this.chartDconCurrent,this.current, this.input_time)
            // this.updateChartData(this.chartDconVoltage,this.voltage, this.input_time)
            // this.updateChartData(this.chartDconEnergy,this.energy, this.input_time)
            // this.updateChartData(this.chartDconPower,this.power, this.input_time)
          });

        //INVERTER
        this.apollo
          .subscribe({
            query: inverterSubscription,
          })
          .subscribe((data: RootObject) => {
            this.dataInverter = data.data.inverter;
            this.titleInverter = Object.keys(this.dataInverter[0]);
            this.titleInverter.pop("__typename");
            this.titleInverter = this.captilize(this.titleInverter);
            this.titleInverter = this.giveUnit(this.titleInverter)

            this.power = this.dataInverter.map((node) => node.power);
            this.current = this.dataInverter.map((node) => node.current);
            this.energy = this.dataInverter.map((node) => node.energy);
            this.voltage = this.dataInverter.map((node) => node.voltage);
            this.input_time = this.dataInverter.map((node) => node.input_time);
            // this.updateChartData(this.chartInverterCurrent,this.current, this.input_time)
            // this.updateChartData(this.chartInverterVoltage,this.voltage, this.input_time)
            // this.updateChartData(this.chartInverterEnergy,this.energy, this.input_time)
            // this.updateChartData(this.chartInverterPower,this.power, this.input_time)
          });

        //State
        this.apollo
          .subscribe({
            query: stateSubscription,
          })
          .subscribe((data: RootObject) => {
            this.dataState = data.data.state;
            this.titleState = Object.keys(this.dataState[0]);
            this.titleState.pop("__typename");
            this.titleState = this.captilize(this.titleState);
           
          });
        // ///Pyranometer
        // this.apollo
        // .subscribe({
        //   query: pyranometerSubscription
        // })
        // .subscribe((data : RootObject) => {
        //   this.dataPyranometer =data.data.pyranometer
        //   this.titlePyranometer = Object.keys(this.dataPyranometer[0]);
        //   this.titlePyranometer.pop("__typename");
        //   this.titlePyranometer= this.captilize(this.titlePyranometer)
        //   this.irradiance = this.dataPyranometer.map(node => node.pyranometer)
        //   this.input_time = this.dataPyranometer.map(node => node.input_time)
        // this.updateChartData(this.chartPyranometer,this.irradiance, this.input_time)
        // });
        //     ///Queru bucket
        //   this.apollo
        //   .subscribe({
        //     query: pyranometerSubscription
        //   })
        //   .subscribe((data : RootObject) => {
        //     // this.dataPyranometer =data.data.pyranometer
        //     // this.titlePyranometer = Object.keys(this.dataPyranometer[0]);
        //     // this.titlePyranometer.pop("__typename");
        //     // this.titlePyranometer= this.captilize(this.titlePyranometer)
        //     // this.irradiance = this.dataPyranometer.map(node => node.pyranometer)
        //     // this.input_time = this.dataPyranometer.map(node => node.input_time)
        //     // this.updateChartData(this.chartPyranometer,this.irradiance, this.input_time)
        //     });
        // },

        //Load
        this.apollo
          .subscribe({
            query: loadSubscription,
          })
          .subscribe((data: RootObject) => {
            this.dataLoad = data.data.kwh_load;
            this.titleLoad = Object.keys(this.dataLoad[0]);
            this.titleLoad.pop("__typename");
            this.titleLoad = this.captilize(this.titleLoad);
            this.titleLoad = this.giveUnit(this.titleLoad)
          });

        //Generartion
        this.apollo
          .subscribe({
            query: generationSubscription,
          })
          .subscribe((data: RootObject) => {
            this.dataGeneration = data.data.kwh_generator;
            this.titleGeneration = Object.keys(this.dataGeneration[0]);
            this.titleGeneration.pop("__typename");
            this.titleGeneration = this.captilize(this.titleGeneration);
            this.titleGeneration = this.giveUnit(this.titleGeneration)
          });

        //Fuel cell Generartion
        this.apollo
        .subscribe({
          query: fuelcellSubscription,
        })
        .subscribe((data: RootObject) => {
          this.dataFuelcell = data.data.fc;
          this.titleFuelcell = Object.keys(this.dataFuelcell[0]);
          this.titleFuelcell.pop("__typename");
          this.titleFuelcell = this.captilize(this.titleFuelcell);
          this.titleFuelcell = this.giveUnit(this.titleFuelcell)
        });

         //Battery Generation
         this.apollo
         .subscribe({
           query: batteryGenerationSubscription,
         })
         .subscribe((data: RootObject) => {
           this.dataBatteryGeneration = data.data.export;
           this.titleBatteryGeneration = Object.keys(this.dataBatteryGeneration[0]);
           this.titleBatteryGeneration.pop("__typename");
           this.titleBatteryGeneration = this.captilize(this.titleBatteryGeneration);
           this.titleBatteryGeneration = this.giveUnit(this.titleBatteryGeneration)
         });

           //Battery percentage
           this.apollo
           .subscribe({
             query: batteryPercentageSubscription,
           })
           .subscribe((data: RootObject) => {
             this.dataBatteryPercentage = data.data.percentage;
             this.titleBatteryPercentage = Object.keys(this.dataBatteryPercentage[0]);
             this.titleBatteryPercentage.pop("__typename");
             this.titleBatteryPercentage = this.captilize(this.titleBatteryPercentage);
             this.titleBatteryPercentage = this.giveUnit(this.titleBatteryPercentage)
           });

        this.getDateFromOption("");
      },
      () => console.log("HAI")
    );
  }
 
  sendmsg() {
    // this.client.on('connect', function () {
    this.client.publish(
      "/gilang123/presence123",
      "Hello mqtt",
      { qos: 2 },
      function (err) {
        if (!err) {
          
        }
      }
    );
  }

  mqttConnect() {
    this.client = mqttt.connect({
      host: "tailor.cloudmqtt.com",
      port: "32030",
      username: "xjfsxsff",
      password: "K9phhM6agNJP",
      protocol: "wss",
    });
  }

  getFormattedDate(date: string) {
    let current_datetime = new Date(date);
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    return formatted_date;
  }

  captilize(arr) {
    let result = [];
    for (let i in arr) {
      result.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1));
    }
    return result;
  }

  updateChartData(chart, _data1) {
    // chart.data.labels = _label.reverse();
    chart.data.datasets[0].data = _data1;
    // chart.data.datasets[1].data = _data2;
    chart.update();
  }

  setQueryGraph(_time_1: string, _time_2: string) {
    if (this.activeTab == "nav-pv-tab" || this.firsttime) {
      this.apollo
        .subscribe({
          query: pvEnergyQuery,
          variables: { time_1: _time_2, time_2: _time_1 },
        })
        .subscribe((data: RootObject) => {
          this.result = data.data.pv;
          this.result = this.renameKey(this.result);
          //  this.power = this.result.map(x => x.power)
          //  this.inputTime = this.result.map(x =>x.time)
          // console.log(this.result)
          this.updateChartData(this.chartPVPower, this.result);
        });
    }

    if (this.activeTab == "nav-dcon-tab" || this.firsttime) {
      this.apollo
        .subscribe({
          query: dconEnergyQuery,
          variables: { time_1: _time_2, time_2: _time_1 },
        })
        .subscribe((data: RootObject) => {
          this.result = data.data.dcon;
          this.result = this.renameKey(this.result);
          //  this.power = this.result.map(x => x.power)
          //  this.inputTime = this.result.map(x =>x.time)
          this.updateChartData(this.chartDconPower, this.result);
        });
    }

    if (this.activeTab == "nav-inverter-tab" || this.firsttime) {
      this.apollo
        .subscribe({
          query: inverterEnergyQuery,
          variables: { time_1: _time_2, time_2: _time_1 },
        })
        .subscribe((data: RootObject) => {
          this.result = data.data.inverter;
          this.result = this.renameKey(this.result);
          //  this.power = this.result.map(x => x.power)
          //  this.inputTime = this.result.map(x =>x.time)
          this.updateChartData(this.chartInverterPower, this.result);
        });}

        if (this.activeTab == "nav-fuelcell-tab" || this.firsttime) {
          this.apollo
            .subscribe({
              query: fuelCellEnergyQuery,
              variables: { time_1: _time_2, time_2: _time_1 },
            })
            .subscribe((data: RootObject) => {
              this.result = data.data.fc;
              this.result = this.renameKey(this.result);
              //  this.power = this.result.map(x => x.power)
              //  this.inputTime = this.result.map(x =>x.time)
              this.updateChartData(this.chartFuelcellPower, this.result);
            });
          }
          if (this.activeTab == "nav-batteryGeneration-tab" || this.firsttime) {
            this.apollo
              .subscribe({
                query: batteryGenerationQuery,
                variables: { time_1: _time_2, time_2: _time_1 },
              })
              .subscribe((data: RootObject) => {
                this.result = data.data.batteryExport;
                this.result = this.renameKey(this.result);
                //  this.power = this.result.map(x => x.power)
                //  this.inputTime = this.result.map(x =>x.time)
                this.updateChartData(this.chartBatteryPower, this.result);
              });
            }
    
      

      this.firsttime = false;
    
  }

  getDateForGraph(_date) {
    var date = _date;
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = date.getFullYear();
    var dayminone = String(date.getDate() - 1).padStart(2, "0");
    return [mm + "-" + dd + "-" + yyyy, mm + "-" + dayminone + "-" + yyyy];
  }

  getDateFromOption(value: string) {
    var date = new Date();
    let result;
    switch (value) {
      case "1":
        date.setDate(date.getDate() + 1);
        result = this.getDateForGraph(date);
        this.setQueryGraph(result[0], result[1]);
        break;
      case "2":
        date.setDate(date.getDate());
        result = this.getDateForGraph(date);
        this.setQueryGraph(result[0], result[1]);
        break;
      case "3":
        date.setDate(date.getDate() - 1);
        result = this.getDateForGraph(date);
        this.setQueryGraph(result[0], result[1]);
        break;
      case "4":
        date.setDate(date.getDate() - 2);
        result = this.getDateForGraph(date);
        this.setQueryGraph(result[0], result[1]);
        break;
      default:
        date.setDate(date.getDate() + 1);
        result = this.getDateForGraph(date);
        this.setQueryGraph(result[0], result[1]);
        break;
    }
  }

  renameKey(json) {
    for (let i in json) {
      json[i]["y"] = json[i]["power"];
      json[i]["x"] = json[i]["time"];
    }
    return json;
  }

  renameKey2(json) {
    for (let i in json) {
      json[i]["y"] = json[i]["load"];
      json[i]["x"] = json[i]["time"];
    }
    return json;
  }


  giveUnit(arr){
  for(let i in arr){
    if(arr[i]==('Power')){
      arr[i]= arr[i]+' (W)'
    }
    else if(arr[i]==('Current')){
      arr[i]= arr[i]+' (A)'
    }
    else if(arr[i]==('Voltage')){
      arr[i]= arr[i]+' (V)'
    }
    else if(arr[i]==('Energy')){
      arr[i]= arr[i]+' (kWh)'
    }
    else if(arr[i]==('Kwhperdate')){
      arr[i]= 'Power per day (kWh)'
    }
    else if(arr[i]==('Percentage')){
      arr[i]= arr[i]+' (%)'
    }

  }
   
    return arr
  }


}
