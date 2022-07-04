import React, { useState, useEffect,useRef,useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {  api_get,api_post,  AlertSuccess, eventBus } from '@utils';
import {useModal,SelectBox,ButtonAsync,DataTable} from '@basesShared';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import ShortUniqueId from 'short-unique-id';
import * as SignalR from '@microsoft/signalr'
import Linecharts from './Linecharts'
import BarChart from './BarChart'
import * as ConfigConstants from '@constants/ConfigConstants';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
export default function Report() {
   
    const columns = [
        { field: "id",headerClassName: 'super-app-theme--header', headerName: "ID", width: 35 },
        {
            headerClassName: 'super-app-theme--header',
            field: "Location",
            headerName: "Location",
            width: 150,
            renderCell: (params) => {
              return (
                 <Link href="#"  style={ params.row.addnewrow ? { fontWeight: 'bold', backgroundColor:'lightblue' } : { fontWeight: 'normal' } } onClick={e=> linkClicked(e,params.row.id)} >{params.row.Location}</Link>
                // <span>{params.row.Location}</span>
              );
            },
        },

        {
            headerClassName: 'super-app-theme--header',
          field: "Machine",
          headerName: "Machine",
          width: 150,
          renderCell: (params) => {
            return (
             
               <span style={ params.row.addnewrow ? { fontWeight: 'bold',backgroundColor:'lightblue'  } : { fontWeight: 'normal' } }>{params.row.Machine}</span>
            );
          },
        },
        {
            headerClassName: 'super-app-theme--header',
          field: "Staff",
          headerName: "Inspector",
          width: 150,
          renderCell: (params) => {
            return (
             
               <span style={ params.row.addnewrow ? { fontWeight: 'bold',backgroundColor:'lightblue'  } : { fontWeight: 'normal' } }>{params.row.Staff}</span>
            );
          },
        },
    
        {
            headerClassName: 'super-app-theme--header',
          field: "Left",
          headerName: "Left",
          width: 80,
          editable: false,
          renderCell: (params) => {
            return (
             
               <span style={ params.row.addnewrow ? { fontWeight: 'bold',backgroundColor:'lightblue'  } : { fontWeight: 'normal' } }>{params.row.Left}</span>
            );
          },
        }
        ,
        {
            headerClassName: 'super-app-theme--header',
          field: "Size",
          headerName: "Size",
          width: 80,
          editable: false,
          renderCell: (params) => {
            return (
             
               <span style={ params.row.addnewrow ? { fontWeight: 'bold',backgroundColor:'lightblue'  } : { fontWeight: 'normal' } }>{params.row.Size}</span>
            );
          },
        },
        {
            headerClassName: 'super-app-theme--header',
          field: "Status",
          headerName: "Status",
          width: 100,
          editable: false,
          renderCell: (params) => {
            if (params.row.Status=="NG")
            return (
             
                <span style={{color:'red'}}>{params.row.Status}</span>
            
            );
            else {
                return (
                    <span style={{color:'green'}}>{params.row.Status}</span>
                 
                 );
            }
          },
        },
        {
            headerClassName: 'super-app-theme--header',
          field: "DateCreated",
          headerName: "DateCreated",
          width: 450,
          editable: false,
          renderCell: (params) => {
            return (
             
               <span style={ params.row.addnewrow ? { fontWeight: 'bold',backgroundColor:'lightblue'  } : { fontWeight: 'normal' } }>{params.row.DateCreated}</span>
            );
          },
        },

      ];
    const [searchName, setSearchName] = useState("");
    const [searchstatus, setSearchstatus] = useState("");
    const [dataset, setDataset] = useState([]);
    const [datasetbar, setDatasetBar] = useState([]);
    const [statechart, setStatechart] = useState([]);
    const [statebarchart, setStatebarChart] = useState([]);



    const [startdate, setStartdate] = React.useState(null);
    const [enddate, setEnddate] = React.useState(null);
    const [inspector, setInspector] = React.useState('');

    const gridRef = useRef();
    const user = JSON.parse(localStorage.getItem(ConfigConstants.CURRENT_USER));

 
   // var newConnection;
   const uid = new ShortUniqueId();

    useLayoutEffect(() => {
        return () => {
             eventBus.remove("new_file_uploaded");
        }
    }, [])
     // When component loads, set up our signalR connection
        useEffect(() => {
            eventBus.on("new_file_uploaded", (item) =>
                {

                            var newrow={
                                Staff:item.staff, 
                                Location:item.location,
                                Machine:item.machine,
                                Left:item.left,
                                Size:item.size,
                                Status:item.status,
                                id:item.id,
                                DateCreated:item.dateCreated,
                                addnewrow:item.addrow
                            };

                            gridRef.current.addNewRow(newrow);
                            setTimeout(() => {
                                newrow.addnewrow=false;
                                gridRef.current.updateRow(newrow);
                            }, 8000);
                });

            
        }, [])

const linkClicked=(e,id)=>{
  e.preventDefault();
  var dataset=[]
  api_post("DashBoard1Api/get-detail",{id}).then(data=>{
        var linedata=data.linedata;
        //var bardata=data.bardata;

      for (const [key, value] of Object.entries(linedata)) {
        dataset.push(value);
      }
      setDataset(dataset);
    
     // setDatasetBar(bardata)

      setStatechart(uid());
  });
}
const search = () => {
  //reload table
  gridRef.current.search({ search_name: searchName,
     search_status:searchstatus ,start_date:startdate,end_date:enddate
     ,inspector
    })
};


const testnotify = () => {
    api_post("sysOnlineUserApi/lock-account",{Userid:1,Ip:'192.168.77.103', Message:{title:'Mr T send to you', content:'good morning'}}).then(data=>{
         
  
    });
  };

  const clickLineChartHandle=(data)=>{
    console.log(data)
    setDatasetBar(data)
    setStatebarChart(uid())


  }
    return (
      <Box sx={{ pb: 5, 
      height: 285,
       width: "100%",
        '& .super-app-theme--header': {
            backgroundColor: 'rgba(40, 67, 135,0.6)',
        },
        }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
        <Grid item>
        {/* <Button
              variant="contained"
              color="primary"
              sx={{ mx: 3, boxShadow: 1, mb: -4 }}
              onClick={testnotify}
            >
              test
            </Button> */}
        </Grid>
          <Grid item>
          <SelectBox
                    placeholder="status"
                    url="DashBoard1Api/get-all-status"
                    sx={{ borderRadius: 2, mb: 1, width:150, mr:3 }}
                    variantInput="standard"
                  //  defaultValue={{ title: data.type_name, value: data.type_id }}
                    onChange={(item) => {
                        setSearchstatus(item.value);
                    }}
            ></SelectBox>
            
          </Grid>
  
          <Grid item>
          <TextField
              label="Inspector"
              variant="standard"
              onChange={(e) => setInspector(e.target.value)}
              sx={{ borderRadius: 2, mb: 1,mx:2 }}
            />

            <TextField
              label="name"
              variant="standard"
              onChange={(e) => setSearchName(e.target.value)}
              sx={{ borderRadius: 2, mb: 1,mx:2 }}
            />
            <LocalizationProvider  dateAdapter={AdapterDateFns}>
            <DatePicker
                  
                    label="Start Date"

                    value={startdate}
                    mask="____-__-__"
                     
                    inputFormat="yyyy-MM-dd"
                    onChange={(newValue) => {
                       
                        if (newValue)
                        setStartdate(moment(newValue).format('YYYY-MM-DD'));
                        else
                        setStartdate(null)
                    }}
                    renderInput={(params) => <TextField  sx={{ width:150 ,mx:3}}   variant="standard" {...params} />}
                />
                 <DatePicker
                    inputFormat="yyyy-MM-dd"
                    mask="____-__-__"
                  label="End Date"
                  value={enddate}
                  onChange={(newValue) => {
                    if (newValue)
                  setEnddate(moment(newValue).format('YYYY-MM-DD'));
                  else
                  setEnddate(null)
                  }}
                  renderInput={(params) => <TextField  sx={{ width:150,mx:2 }}   variant="standard" {...params} />}
              />
            </LocalizationProvider>
            
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 3, boxShadow: 1, mb: -4 }}
              onClick={search}
            >
              Search
            </Button>

          </Grid>
        </Grid>
        
      <DataTable 
          ref={gridRef}
        
          url="DashBoard1Api/get-list-data"
          columns={columns}
          rowHeight={35}
          headerHeight={25}
          sx={{height:250}}
              
          IsPagingServer={true}
      />
  
        <Grid container spacing={1}>
            <Grid item xs={8}>
                    <Linecharts  dataset={dataset} statechart={statechart} onClick={clickLineChartHandle} />
                </Grid>
                <Grid item xs={4}>
                   <BarChart dataset={datasetbar}  statechart={statebarchart}  />
                </Grid>
                
            </Grid>
      </Box>

    );
  }