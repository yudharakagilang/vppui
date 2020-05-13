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
import { __await } from 'tslib';




// Subscription
const pvSubscription = gql`
subscription pv{
	pv(limit: 1,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const dconSubscription = gql`
subscription dcon{
	dcon(limit: 1,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const inverterSubscription = gql`
subscription inverter{
	inverter(limit: 1,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const stateSubscription = gql`
subscription state{
	state(limit: 1,order_by:{input_time:desc}){
      cb_pv
      cb_pln
      cb_fc
      cb_dc_load
      cb_ac_load
      input_time
  }
}
`;
const pyranometerSubscription = gql`
subscription pyranometer{
	pyranometer(limit: 1,order_by:{input_time:desc}){
      pyranometer
      input_time
  }
}
`;

// Query

const pvQuery = gql`
query pv{
	pv(limit: 10,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const dconQuery = gql`
query dcon{
	dcon(limit: 10,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const inverterQuery = gql`
query inverter{
	inverter(limit: 10,order_by:{input_time:desc}){
      voltage
      current
      power
      energy
    	input_time
  }
}
`;
const stateQuery = gql`
subscription state{
	state(limit: 10,order_by:{input_time:desc}){
      cb_pv
      cb_pln
      cb_fc
      cb_dc_load
      cb_ac_load
      input_time
  }
}
`;
const pyranometerQuery = gql`
query pyranometer{
	pyranometer(limit: 10,order_by:{input_time:desc}){
      pyranometer
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
  client$: Client;
  client;
  voltage;
  current;
  energy;
  power;
  input_time;
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            
            scaleLabel: {
              display: true,
              labelString: 'Current'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Current'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Current'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Voltage'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power'
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
          
            borderColor: "#3cba9f",
            fill: true
          },
          { 
          
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
            type: 'time',
            scaleLabel: {
           
              display: true,
              labelString: 'Irradiance'
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
          uri: "http://"+this.client$.streamData,
        });

        const subscriptionLink = new WebSocketLink({
          uri:"ws://"+this.client$.streamData,

          options: {
            reconnect: false,
          },
        });

        const auth = setContext((operation, context) => ({
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
        this.todoSubscription = this.apollo.watchQuery<any>({
          query:pvQuery
        }).valueChanges.subscribe((data : RootObject) => {
          this.dataPV =data.data.pv
          let power = this.dataPV.map(node => node.power)
          let current = this.dataPV.map(node => node.current)
          let energy = this.dataPV.map(node => node.energy)
          let voltage = this.dataPV.map(node => node.voltage)
          let input_time = this.dataPV.map(node => node.input_time)
          this.titlePV = Object.keys(this.dataPV[0]);
          this.titlePV.pop("__typename");
          this.titlePV= this.captilize(this.titlePV)

          this.updateChartData(this.chartPVCurrent,current, input_time)
          this.updateChartData(this.chartPVVoltage,voltage, input_time)
          this.updateChartData(this.chartPVEnergy,energy, input_time)
          this.updateChartData(this.chartPVPower,power, input_time)
            this.dataPV.shift()
            power.shift()
            current.shift()
            energy.shift()
            voltage.shift()
            input_time.shift()
        this.apollo
        .subscribe({
          query: pvSubscription
        })
        .subscribe((data : RootObject) => {   
          let temp =data.data.pv
          console.log(temp[0].power)
          console.log(power)
          console.log("========================================")
          this.dataPV.pop()
          power.pop()
          current.pop()
          energy.pop()
          voltage.pop()
          input_time.pop()
          console.log
          this.dataPV.unshift(temp[0])
          power.unshift(temp[0].power)
          current.unshift(temp[0].current)
          energy.unshift(temp[0].energy)
          voltage.unshift(temp[0].voltage)
          input_time.unshift(temp[0].input_time)
          console.log(power)
          this.updateChartData(this.chartPVCurrent,current, input_time)
          this.updateChartData(this.chartPVVoltage,voltage, input_time)
          this.updateChartData(this.chartPVEnergy,energy,input_time)
          this.updateChartData(this.chartPVPower,power, input_time)
          
          });


        });
        
        //DCON
        this.apollo
        .subscribe({
          query: dconQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataDcon =data.data.dcon
          let power = this.dataDcon.map(node => node.power)
          let current = this.dataDcon.map(node => node.current)
          let energy = this.dataDcon.map(node => node.energy)
          let voltage = this.dataDcon.map(node => node.voltage)
          let input_time = this.dataDcon.map(node => node.input_time)
          this.titleDcon = Object.keys(this.dataDcon[0]);
          this.titleDcon.pop("__typename");
          this.titleDcon= this.captilize(this.titleDcon)

          this.updateChartData(this.chartDconCurrent,current, this.input_time)
          this.updateChartData(this.chartDconVoltage,voltage, this.input_time)
          this.updateChartData(this.chartDconEnergy,energy, this.input_time)
          this.updateChartData(this.chartDconPower,power, this.input_time)

          
          this.apollo
          .subscribe({
            query: dconSubscription
          })
          .subscribe((data : RootObject) => {   
            let temp =data.data.dcon
            this.dataDcon.shift()
            power.shift()
            current.shift()
            energy.shift()
            voltage.shift()
            input_time.shift()
            this.dataDcon.unshift(temp[0])
            power.unshift(temp[0].power)
            current.unshift(temp[0].current)
            energy.unshift(temp[0].energy)
            voltage.unshift(temp[0].voltage)
            input_time.unshift(temp[0].input_time)
            this.updateChartData(this.chartDconCurrent,current, input_time)
            this.updateChartData(this.chartDconVoltage,voltage, input_time)
            this.updateChartData(this.chartDconEnergy,energy,input_time)
            this.updateChartData(this.chartDconPower,power, input_time)
            
            });
          });

        //INVERTER
        this.apollo
        .subscribe({
          query: inverterQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataInverter =data.data.inverter
          let power = this.dataInverter.map(node => node.power)
          let current = this.dataInverter.map(node => node.current)
          let energy = this.dataInverter.map(node => node.energy)
          let voltage = this.dataInverter.map(node => node.voltage)
          let input_time = this.dataInverter.map(node => node.input_time)
          this.titleInverter = Object.keys(this.dataInverter[0]);
          this.titleInverter.pop("__typename");
          this.titleInverter= this.captilize(this.titleInverter)

          this.updateChartData(this.chartInverterCurrent,current, this.input_time)
          this.updateChartData(this.chartInverterVoltage,voltage, this.input_time)
          this.updateChartData(this.chartInverterEnergy,energy, this.input_time)
          this.updateChartData(this.chartInverterPower,power, this.input_time)


          this.apollo
          .subscribe({
            query:inverterSubscription
          })
          .subscribe((data : RootObject) => {   
            let temp =data.data.inverter
            this.dataInverter.shift()
            power.shift()
            current.shift()
            energy.shift()
            voltage.shift()
            input_time.shift()
            this.dataInverter.unshift(temp[0])
            power.unshift(temp[0].power)
            current.unshift(temp[0].current)
            energy.unshift(temp[0].energy)
            voltage.unshift(temp[0].voltage)
            input_time.unshift(temp[0].input_time)
            
            this.updateChartData(this.chartInverterCurrent,current, input_time)
            this.updateChartData(this.chartInverterVoltage,voltage, input_time)
            this.updateChartData(this.chartInverterEnergy,energy,input_time)
            this.updateChartData(this.chartInverterPower,power, input_time)
            
            });
          });

        //State
        this.apollo
        .subscribe({
          query: stateQuery
        })
        .subscribe((data : RootObject) => {   
          this.dataState =data.data.state
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
          this.dataPyranometer =data.data.pyranometer
          let pyranometer = this.dataPyranometer.map(node => node.pyranometer)
          let input_time = this.dataPyranometer.map(node => node.input_time)
          this.titlePyranometer = Object.keys(this.dataPyranometer[0]);
          this.titlePyranometer.pop("__typename");
          this.titlePyranometer= this.captilize(this.titlePyranometer)

          this.updateChartData(this.chartPyranometer,pyranometer, this.input_time)

          this.apollo
          .subscribe({
            query:pyranometerSubscription
          })
          .subscribe((data : RootObject) => {   
            let temp =data.data.pyranometer
            this.dataPyranometer.shift()
            pyranometer.shift()
            input_time.shift()
        
            this.dataPyranometer.unshift(temp[0])
            pyranometer.unshift(temp[0].power)
            input_time.unshift(temp[0].input_time)

            this.updateChartData(this.chartPyranometer,pyranometer, input_time)
            });
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
      chart.data.datasets[0].data = _data1
      // chart.data.datasets[1].data = _data2;
      chart.update();
    }


}
