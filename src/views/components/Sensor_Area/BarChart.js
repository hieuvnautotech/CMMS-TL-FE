import React, { Component } from 'react'  
import Chart from 'chart.js/auto';

import ChartDataLabels from 'chartjs-plugin-datalabels';


class BarChart extends Component {  
    constructor(props) {  
            super(props);  
            this.state = {  };  
            this.chartRef = React.createRef();

             
    }  
   
    componentDidUpdate(prevProps) {
   
    
        const{statechart,dataset}=this.props;
           
        if ( statechart !== prevProps.statechart && dataset.length )  {
        
            if (this.myChart) this.myChart.destroy();
            const ctx = this.chartRef.current.getContext("2d");
           
         //  console.log(dataset)
       //  setTimeout(() => {
            this.myChart = new Chart("barChart", {
                type: 'bar',
                data: {
                  labels: ["S1","S2","S3","S4","S5","S6","S7","S8"],
                  datasets: [
                    {
                        label: 'Pressure Data ',
                       // data: [dataset["sensor_0"][0],dataset["sensor_1"][0],dataset["sensor_2"][0],dataset["sensor_3"][0],dataset["sensor_3"][0],dataset["sensor_4"][0],dataset["sensor_5"][0],dataset["sensor_6"][0],dataset["sensor_7"][0]],
                        data: dataset
                    },
                ],
                },
                options: {
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',  // Bar 1
                        'rgba(54, 162, 235, 0.2)',  // Bar 2
                        'rgba(255, 206, 86, 0.2)',  // Bar 3
                        'rgba(75, 192, 192, 0.2)',  // Bar 4
                        'rgba(153, 102, 255, 0.2)', // Bar 5
                        'rgba(255, 159, 64, 0.2)'   // Bar 6
                    ],
                    borderWidth: 2,
                    borderColor: 'blue',
                    maintainAspectRatio: false
                },
                plugins: [ChartDataLabels,
                    {
                        id: 'custom_canvas_background_color2',
                        beforeDraw: (chart) => {
                          const ctx = chart.canvas.getContext('2d');
                          ctx.save();
                          ctx.globalCompositeOperation = 'destination-over';
                          ctx.fillStyle = 'white';
                          ctx.fillRect(0, 0, chart.width, chart.height);
                          ctx.restore();
                    }
                }
                ],
              });
        // }, 500);
            
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

export default BarChart