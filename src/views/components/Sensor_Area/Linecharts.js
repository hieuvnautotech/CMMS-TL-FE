import React, { Component } from 'react'  
import Chart from 'chart.js/auto';
import Grid from '@mui/material/Grid';
import BarChart from './BarChart'

 class Linecharts extends Component {  
        constructor(props) {  
                super(props);  
                this.state = {  };  
                this.chartRef = React.createRef();

                 this.myChart;
        }  
        componentWillMount() {
           
        }

        componentDidUpdate(prevProps) {
       
        
            const{statechart,dataset}=this.props;

            if ( statechart !== prevProps.statechart  )  {
            
                if (this.myChart) this.myChart.destroy();
                const ctx = this.chartRef.current.getContext("2d");
               // console.log(dataset[0])
               var arrLabels=[]
                for (var i=0; i<dataset[0].length;i++) {
                    arrLabels.push(i.toString());
                }
               
                this.myChart = new Chart(ctx, {
                    type: 'line',
    
                    data: {
                        labels: arrLabels,
                        datasets: [{ 
                            data: dataset[0],
                            label: "Sensor 1",
                            borderColor: "#3e95cd",
                            backgroundColor: "#3e95cd",
                            fill: false,
                        }, { 
                            data: dataset[1],
                            label: "Sensor 2",
                            borderColor: "#3cba9f",
                            backgroundColor: "#3cba9f",
                            fill: false,
                        }, { 
                            data:dataset[2],
                            label: "Sensor 3",
                            borderColor: "#bdff34",
                            backgroundColor:"#bdff34",
                            fill: false,
                        }, { 
                            data: dataset[3],
                            label: "Sensor 4",
                            borderColor: "#fdc8ab",
                            backgroundColor:"#fdc8ab",
                            fill: false,
                        }

                        ,{ 
                            data: dataset[4],
                            label: "Sensor 5",
                            borderColor: "#c45850",
                            backgroundColor:"#c45850",
                            fill: false,
                        }
                        ,{ 
                            data: dataset[5],
                            label: "Sensor 6",
                            borderColor: "#290BAF",
                            backgroundColor:"#290BAF",
                            fill: false,
                        }
                        ,{ 
                            data: dataset[6],
                            label: "Sensor 7",
                            borderColor: "#4afb71",
                            backgroundColor:"#4afb71",
                            fill: false,
                        }
                        ,{ 
                            data: dataset[7],
                            label: "Sensor 8",
                            borderColor: "#a5aee3",
                            backgroundColor:"#a5aee3",
                            fill: false,
                        }
                       

                        ]
                    },
                    options: {
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        maintainAspectRatio: false,
                        onClick: (e,activeElements) => {
                            var datasets=this.myChart.data.datasets;

                            var arrData=[];
                            for (var i=0; i<8;i++) {
                                arrData.push(datasets[i].data[activeElements[i].index]);
                            }
                           // console.log(arrData)
                            this.props.onClick &&  this.props.onClick(arrData)
                         
                        }
    
                    },
                    plugins: [
                        {
                            afterDraw: chart => {
                                if (chart.tooltip?._active?.length) {
                                    let x = chart.tooltip._active[0].element.x;
                                    let yAxis = chart.scales.y;
                                    let ctx = chart.ctx;
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.moveTo(x, yAxis.top);
                                    ctx.lineTo(x, yAxis.bottom);
                                    ctx.lineWidth = 1;
                                    ctx.strokeStyle = '#ff0000';
                                    ctx.stroke();
                                    ctx.restore();
                                }
                            },
                        
                         },
    
                         {
                            id: 'custom_canvas_background_color',
                            beforeDraw: (chart) => {
                              const ctx = chart.canvas.getContext('2d');
                              ctx.save();
                              ctx.globalCompositeOperation = 'destination-over';
                              ctx.fillStyle = 'white';
                              ctx.fillRect(0, 0, chart.width, chart.height);
                              ctx.restore();
                        }
                    }
                    ]
                });
            }
        }

        componentDidMount() {  
            const ctx = this.chartRef.current.getContext("2d");
            this.myChart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: [ "1", "2", "3", "4", "5", "6", "7","8"],
                    datasets: [
                    ]
                },
                options: {
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    maintainAspectRatio: false

                }
               
            });

        }  
        render() {  
                return (  
                    // <Grid container spacing={1}>
                    // <Grid item xs={8}>
                    //         <div style={{height:'400px'}}>
                    //         <canvas
                    //             id="myChart"
                    //             ref={this.chartRef}
                    //         />
                    //         </div>  
                    // </Grid>
                    // <Grid item xs={4}>
                    //    <BarChart dataset={datasetbar} statechart={statechart} />
                    // </Grid>
                    
                    // </Grid>
                    <div style={{height:'400px'}}>
                    <canvas
                        id="myChart"
                        ref={this.chartRef}
                    />
                    </div>  
                   
                )  
        }  
}  
  
export default Linecharts  