import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs/internal/Subscription';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

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
  selector: 'app-client-chart',
  templateUrl: './client-chart.component.html',
  styleUrls: ['./client-chart.component.css']
})
export class ClientChartComponent implements OnInit,OnDestroy {
  todoSubscription: Subscription;

  
  temperature = [];
  time =[]
  newTime =[]
  chart : any

  constructor(private apollo: Apollo) {}

  ngOnInit() {

  {

    // this.chart = new Chart('line', {
    //   type: 'line',
    //   data: {
    //     datasets: [
    //       { 
    //         borderColor: "#3cba9f",
    //         fill: false
    //       }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       display: false
    //     },
    //     scales: {
    //       xAxes: [{
    //         display: true,
    //         type: 'time',
    //         ticks: {
    //             autoSkip: true,
    //             maxTicksLimit: 10
    //         }
    //       }],
    //       yAxes: [{
    //         display: true
    //       }],
    //     }
    //   }
    // });
  
    // this.todoSubscription = this.apollo
    //   .subscribe({
    //     query: subscription
    //   })
    //   .subscribe(({ data }) => {   
    //     this.temperature = data['temperature'].map(data => data.temperature)
    //     this.time = data['temperature'].map(data => new Date(data.recorded_at))
    //     this.time.forEach((res) => {
    //       let jsdate = res
    //       this.newTime.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))
    //   })
    //     this.updateChartData(this.chart,this.temperature,this.newTime)
   
    //   });
  }

  


    }

  ngOnDestroy() {
    this.todoSubscription.unsubscribe();
  }

  updateChartData(chart, _data, _label){  
    chart.data.labels = _label;
    chart.data.datasets[0].data = _data;
    console.log(chart.data.labels)
    console.log(_label)
    console.log(_data)
    chart.update();
  }

}
