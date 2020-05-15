import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ClientService }  from '../client.service';
import { Client, RootObject } from '../client';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-angular-link-http';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from "apollo-utilities";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const loadpoweraggregate = gql`
subscription loadpoweraggregate{
  loadpoweraggregate(limit:1,order_by:{time:desc})
    {
    load
    },
}
`;
const totalexchange = gql`
subscription totalexchange{
  totalexchange(limit:1,order_by:{time:desc})
    {
    power
    },
}
`;

const genpoweraggregate = gql`
subscription genpoweraggregate{
  genpoweraggregate(limit:1,order_by:{time:desc})
    {
    power
    },
}
`;
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients : Client[]
  selectedId : any
  newClient : Client[]
  chart: any
  loadpoweraggregate
  genpoweraggregate
  exchangeData
 
 


  constructor(
    private service: ClientService,
    private toastr: ToastrService,
    private router: Router,
    private apollo: Apollo,
    private httpClient: HttpClient,
  ) {}

  ngOnInit() {
    this.getClients();
    this.getExchangeData();

    // // chart 1
    //   this.chart = new Chart('line', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       {   
    //         name :"sell Price", 
    //         borderColor: "#3cba9f",
    //         fill: true
    //       },
    //       { 
    //         name :"buy Price", 
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
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Time in Hour'
    //         }
    //       }],
    //       yAxes: [{
    //         scaleLabel: {
    //           display: true,
    //           labelString: 'Price'
    //         }
    //       }]
    //     }}
    // });

    // this.updateChartData(this.chart,this.sellPrice,this.buyPrice,this.newTime)


  }


  getClients() {
    
    this.service.getClients()
      .subscribe(
        client => {
          this.clients = client;
        },
        error => this.router.navigateByUrl('/login'));
  }

  addClient(name: string, location :string, url:string, streamData:string ): void {
   
    name = name.trim();
    location = location.trim();
    url = url.trim();
    streamData = streamData.trim();
    var data='{"id":"demo@0.2.0","nodes":{}}'
    
    if (!name || !location || !url || !data || !streamData) { return; }
    this.service.addClient({name,location,url,streamData, data} as Client)
    .subscribe(client => {
      this.clients.push(client);
      this.showSuccess("Client data added Succesfully")
    },

    error =>{
      this.showError()
    }
     
    );
  }

  deleteClient ( client: Client): void {
    this.clients = this.clients.filter(h => h !== client);
    this.service.removeClient(client._id)
      .subscribe(client => {
        this.showSuccess(("Client data deleted Succesfully"))
      },
  
      error =>{
        this.showError()
      }
       
      );
  }

  showSuccess(message : string){
    this.toastr.success(message, 'Success Info');
  }

  showError(){
    this.toastr.error('Error!!', 'Error Info')
  }

  updateChartData(chart, _data1,_data2, _label){  
    chart.data.labels = _label;
    chart.data.datasets[0].data = _data1;
    chart.data.datasets[1].data = _data2;
    chart.update();
  }

  getExchangeData(){

    // const for HTTP
    const httpLink = new HttpLink(this.httpClient).create({
      uri: "http://"+'hasuramainserver.herokuapp.com/v1/graphql',
    });

    // const for WebSocket
    const subscriptionLink = new WebSocketLink({
      uri: "ws://"+'hasuramainserver.herokuapp.com/v1/graphql',
      options: {
        reconnect: true,
        connectionParams: {
        },
      },
    });

    //Auth
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

  // genpower subscribe
  this.apollo
  .subscribe({
    query: genpoweraggregate
  })
  .subscribe((data : RootObject) => {   
    let result = data.data.genpoweraggregate[0].power;
    this.genpoweraggregate = result
  })

  // load  subscribe
  this.apollo
  .subscribe({
    query: loadpoweraggregate
  })
  .subscribe((data : RootObject) => {   
    let result = data.data.loadpoweraggregate[0].load;
    this.loadpoweraggregate = result
  })

   // load  subscribe
   this.apollo
   .subscribe({
     query: totalexchange
   })
   .subscribe((data : RootObject) => {   
     let result = data.data.totalexchange[0].power;
     this.exchangeData = result
   })

}
}
