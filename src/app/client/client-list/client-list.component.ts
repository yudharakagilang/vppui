import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ClientService }  from '../client.service';
import { Client } from '../client';
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router';


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
  buyPrice =[
    840,
    840,
    700,
    700,
    560,
    560,
    700,
    1120,
    1540,
    1120,
    700,
    560,
    560,
    560,
    560,
    560,
    1120,
    1120,
    1680,
    2520,
    2800,
    2520,
    1400,
    840
]
  sellPrice=[
    672,
    672,
    560,
    560,
    448,
    448,
    560,
    896,
    1232,
    896,
    560,
    448,
    448,
    448,
    448,
    448,
    896,
    896,
    1344,
    2016,
    2240,
    2016,
    1120,
    672
    ]
  newTime = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
  


  constructor(
    private service: ClientService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getClients();

    // chart 1
      this.chart = new Chart('line', {
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
              labelString: 'Time in Hour'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Price'
            }
          }]
        }}
    });

    this.updateChartData(this.chart,this.sellPrice,this.buyPrice,this.newTime)


  }


  getClients() {
    
    this.service.getClients()
      .subscribe(
        client => {
          this.clients = client;
        },
        error => this.router.navigateByUrl('/login'));
  }

  addClient(name: string, location :string, url:string, urlHasura:string ): void {
   
    name = name.trim();
    location = location.trim();
    url = url.trim();
    urlHasura = urlHasura.trim();
    var data='{"id":"demo@0.2.0","nodes":{}}'
    
    if (!name || !location || !url || !data || !urlHasura) { return; }
    this.service.addClient({name,location,url,urlHasura, data} as Client)
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
  

}
