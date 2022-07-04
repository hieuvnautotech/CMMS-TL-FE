import React, { Component } from 'react'  
import Chart from 'chart.js/auto';

import ChartDataLabels from 'chartjs-plugin-datalabels';


class BarChart_Dashboard extends Component {  
    constructor(props) {  
            super(props);  
            this.state = {  };  
            this.chartRef = React.createRef();

             
    }  
   
    componentDidUpdate(prevProps) {
   
    
        const{statechart,dataset, x_title}=this.props;
        if ( statechart !== prevProps.statechart  )  {

            if (this.barChart) this.barChart.destroy();
          //  const ctx = this.chartRef.current.getContext("2d");
          // console.log(dataset)
        


           var arrLabels=[];
           var arrDataOk=[];
           var arrDataNg=[];
           var arrDataFixed=[];
           for (const [key, value] of Object.entries(dataset)) {
            arrLabels.push(key);
            arrDataOk.push(value.countOk)
            arrDataNg.push(value.countNg)
            arrDataFixed.push(value.countFixed)
          }
          
      

           this.barChart = new Chart("barChart", {
            type: 'bar',
            data: {
              labels: arrLabels,
              datasets: [
                {
                    label: "OK",
                    backgroundColor: "lightgreen",
                   
                    barThickness: 30,
                   
                    data: arrDataOk
                },
                {
                    label: "NG",
                   
                    barThickness: 30,
                    
                    backgroundColor: "#FF7377",
                    data:arrDataNg
                },
                {
                    label: "FIXED",
                   
                    barThickness: 30,
                    
                    backgroundColor: "blue",
                    data:arrDataFixed
                }
              
                ]
            },
            options: {
              
                borderWidth: 1,
                borderColor: 'blue',
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                          font: {
                            size: 14
                          }
                        },
                        title: {
                          display: true,
                          text: 'Date range: ' + x_title,
                          font: {
                            size: 16
                          }
                        }
                      },

                      y: {
                        ticks: {
                          font: {
                            size: 14
                          }
                        },
                        title: {
                          display: true,
                          text: 'quantity',
                          font: {
                            size: 14
                          }
                        }
                      }
                  }
            },
            plugins: [ChartDataLabels],
          });
        }
    }

    componentDidMount() {  

    }  
    render() {  
            return (  
                <div style={{height:'400px'}}>
                <canvas
                    id="barChart"
                    ref={this.chartRef}
                />
                </div>    
            )  
    }  
}  

export default BarChart_Dashboard