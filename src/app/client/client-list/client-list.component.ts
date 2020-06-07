import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ClientService }  from '../client.service';
import { Client, RootObject, Nodes, User } from '../client';
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
import { TokenStorageService } from 'src/app/_services/token-storage.service';

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
    power,time
    },
}
`;

const graphgen = gql`

query a ($time_1: timestamp!, $time_2: timestamp!){
  genpoweraggregate: one_hour(where: 
   {_and: [
     {bucket: {_gte: $time_1}}
     {bucket: {_lte: $time_2}}
  ]
    
  }) {
    power
    time: bucket
  },
  loadpoweraggregate: one_hour2(where: 
    {_and: [
      {bucket: {_gte: $time_1}}
      {bucket: {_lte: $time_2}}
   ]
     
   }) {
     load
     time: bucket
   }
 }

`

;
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients : Client[]
  Users : User[]
  selectedId : any
  newClient : Client[]
  chart: any
  ids: any[]
  usernames: any[]
  loadpoweraggregate
  genpoweraggregate
  exchangeData

  result
  result2
  power
  inputTime

  isAdmin = false
  time: any;
 
 


  constructor(
    private service: ClientService,
    private toastr: ToastrService,
    private router: Router,
    private apollo: Apollo,
    private httpClient: HttpClient,
    private user : TokenStorageService
  ) {}

  ngOnInit() {

    if(this.user.getUser() != null){
      if(this.user.getUser().roles == "admin" )
        this.isAdmin = true
    }
    this.apollo.removeClient()
    this.getClients();
    this.getAllUser();
    this.getExchangeData()
    this.getDateFromOption("")

    // chart 1
      this.chart = new Chart('line', {
      type: 'line',
      data: {
        datasets: [
          {   
            label: 'Power',
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true,
            pointRadius: 1,
            borderWidth : 1
          },
          { 
            label: 'Load',
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            borderColor: 'rgba(255, 0, 0, 1)',
            fill: true,
            pointRadius: 1,
            borderWidth : 0.1
          }
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time in Hour'
            },
            type: 'time',
            time: {
                displayFormats: {
                    hout: 'hA'
                }
            }
          },
        
        ],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Power (Watt)'
            }
          }]
        }}
    });

    


  }


  getClients() {
    
    this.service.getClients()
      .subscribe(
        client => {
          this.clients = client;
        },
        error => this.router.navigateByUrl('/login'));
  }

  getAllUser() {
    
    this.service.getAvailUser()
      .subscribe(
        users => {
          this.Users = users;
          this.ids = this.Users.map(x => x.id)
          this.usernames = this.Users.map(x => x.username)
          console.log(this.usernames)

        },
        error => {})
  }

  addClient(name: string, location :string, url:string, streamData:string , userid:number): void {
   
    console.log("user id :"+userid)
    name = name.trim();
    location = location.trim();
    url = url.trim();
    streamData = streamData.trim();
    var data='{"id":"demo@0.2.0","nodes":{}}'
    
    if (!name || !location || !url || !data || !streamData || !userid ) { return; }
    this.service.addClient({name,location,url,streamData, data, userid} as Client)
    .subscribe(client => {
      this.clients.push(client);
      this.showSuccess("Client data added Succesfully")
    },

    error =>{
      this.showError()
    }
     
    );
  }

  // deleteClient ( client: Client): void {
  //   this.clients = this.clients.filter(h => h !== client);
  //   this.service.removeClient(client.id)
  //     .subscribe(client => {
  //       this.showSuccess(("Client data deleted Succesfully"))
  //     },
  
  //     error =>{
  //       this.showError()
  //     }
       
  //     );
  // }

  showSuccess(message : string){
    this.toastr.success(message, 'Success Info');
  }

  showError(){
    this.toastr.error('Error!!', 'Error Info')
  }

  updateChartData(chart, _data1, _data2){  
    // chart.data.labels = _label;
    chart.data.datasets[0].data= _data1
    chart.data.datasets[1].data= _data2
    //chart.data.datasets[1].data = _data2;
    chart.update();
  }

  getExchangeData(){
    // const for HTTP
    const httpLink = new HttpLink(this.httpClient).create({
      uri: "https://"+'hasuramainserver.herokuapp.com/v1/graphql',
    });

    // const for WebSocket
    const subscriptionLink = new WebSocketLink({
      uri: "wss://"+'hasuramainserver.herokuapp.com/v1/graphql',
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
    let time = data.data.genpoweraggregate[0].time;
    this.genpoweraggregate = parseFloat(result).toFixed(2);
    this.time  = time.replace(/z|t/gi,' ').slice(0, -7);;
    console.log(data.data.genpoweraggregate[0])
  })

  // load  subscribe
  this.apollo
  .subscribe({
    query: loadpoweraggregate
  })
  .subscribe((data : RootObject) => {   
    let result = data.data.loadpoweraggregate[0].load;
    this.loadpoweraggregate = parseFloat(result).toFixed(2);
  })

   // load  subscribe
   this.apollo
   .subscribe({
     query: totalexchange
   })
   .subscribe((data : RootObject) => {   
     let result = data.data.totalexchange[0].power;
     this.exchangeData = parseFloat(result).toFixed(2);
   })


}

setQueryGraph(_time_1 : string, _time_2:string){

  this.apollo
  .subscribe({
    query: graphgen,
    variables:{time_1:_time_2, time_2:_time_1} 
  })
  .subscribe((data: RootObject) => { 
   this.result = data.data.genpoweraggregate
   this.result2 = data.data.loadpoweraggregate
   this.result = this.renameKey(this.result)
   this.result2 = this.renameKey2(this.result2)
  //  this.power = this.result.map(x => x.power)
  //  this.inputTime = this.result.map(x =>x.time)
   console.log(this.result)
   console.log(this.result2)
   this.updateChartData(this.chart,this.result,this.result2)
  })
 
}

getDateForGraph(_date){
var date = _date
var dd = String(date.getDate()).padStart(2, '0');
var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = date.getFullYear();
var dayminone = String(date.getDate()-1).padStart(2, '0');
return([(mm + '-' + dd + '-' + yyyy),(mm + '-' + dayminone + '-' + yyyy)]);
}

getDateFromOption(value : string){
  console.log("hi")
  var date = new Date()
  let result
  switch(value) {
    case "1":
        date.setDate(date.getDate()+1)
       result = this.getDateForGraph(date)
       this.setQueryGraph(result[0],result[1])
       console.log(result)
       break;
    case "2":
       date.setDate(date.getDate())
       result = this.getDateForGraph(date)
       this.setQueryGraph(result[0],result[1])
       console.log(result)
       break;
    case "3":
      date.setDate(date.getDate()-1)
      result = this.getDateForGraph(date)
      this.setQueryGraph(result[0],result[1])
      break;
    case "4":
      date.setDate(date.getDate()-2)
      result = this.getDateForGraph(date)
      this.setQueryGraph(result[0],result[1])
      break;
    default:
        date.setDate(date.getDate()+1)
        result = this.getDateForGraph(date)
        this.setQueryGraph(result[0],result[1])
        console.log(result)
        break;
  }


}

 renameKey(json){

  for (let i in json){
    json[i]["y"] = json[i]["power"]
    json[i]["x"] = json[i]["time"]
     }
     return json
 }

 renameKey2(json){

  for (let i in json){
    json[i]["y"] = json[i]["load"]
    json[i]["x"] = json[i]["time"]
     }
     return json
 }


}
