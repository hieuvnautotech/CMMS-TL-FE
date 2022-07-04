import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { api_get, api_post, AlertSuccess, eventBus } from "@utils";
import { useModal, SelectBox, ButtonAsync, DataTable } from "@basesShared";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import ShortUniqueId from "short-unique-id";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import CountUp from 'react-countup';


import BarChart_Dashboard from "./BarChart_Dashboard";
export default function Dashboard_Inspector() {
  const [startdate, setStartdate] = React.useState(null);
  const [enddate, setEnddate] = React.useState(null);
  const [dataset, setDataset] = useState({});
  const [statechart, setStatechart] = useState("");
  const [totalOk, setTotalOk] = useState(0);
  const [totalNg, setTotalNg] = useState(0);
  const [totalFixed, setTotalFixed] = useState(0);
  const [tabActive, setTabActive] = useState(1);
  const [titleTab, setTitleTab] = useState("STATUS OF INSPECTOR");

  // var newConnection;
  const uid = new ShortUniqueId();

  useLayoutEffect(() => {
    return () => {
      //eventBus.remove("new_file_uploaded");
    };
  }, []);
  // When component loads, set up our signalR connection
  useEffect(() => {
    search();
  }, []);

  const search = () => {
    api_post(
      `DashBoard1Api/dashboard-inspector-search?datestart=${
        startdate ?? ""
      }&enddate=${enddate ?? ""}`
    ).then((data) => {
      setTotalOk(data.totalOk);
      setTotalNg(data.totalNg);
      setTotalFixed(data.totalFixed);
      setDataset(data.data);
      setStatechart(uid());
    });
  };

  const inspection = () => {
    // api_post("sysOnlineUserApi/lock-account",{Userid:1,Ip:'192.168.77.103', Message:{title:'Mr T send to you', content:'good morning'}}).then(data=>{

    // });
    setTitleTab("STATUS OF INSPECTOR");
    setTabActive(1);
  
    
  };

  const repair = () => {
    setTitleTab("STATUS OF REPAIR");
    setTabActive(2);
  };

  return (
    <Box
      sx={{
        pb: 5,
        height: 700,
        width: "100%",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(40, 67, 135,0.6)",
        },
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          {/* <Button
            variant="outlined"
            color="info"
            sx={{ mr: 1, boxShadow: 1 }}
            onClick={inspection}
          >
            Inspection
          </Button>
          <Button
            variant="outlined"
            color="info"
            sx={{ boxShadow: 1 }}
            onClick={repair}
          >
            Repair
          </Button> */}
        </Grid>

        <Grid item>
          {tabActive == 1 ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startdate}
                  mask="____-__-__"
                  inputFormat="yyyy-MM-dd"
                  onChange={(newValue) => {
                    if (newValue)
                      setStartdate(moment(newValue).format("YYYY-MM-DD"));
                    else setStartdate(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 150, mx: 3 }}
                      variant="standard"
                      {...params}
                    />
                  )}
                />
                <DatePicker
                  inputFormat="yyyy-MM-dd"
                  mask="____-__-__"
                  label="End Date"
                  value={enddate}
                  onChange={(newValue) => {
                    if (newValue)
                      setEnddate(moment(newValue).format("YYYY-MM-DD"));
                    else setEnddate(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 150, mx: 2 }}
                      variant="standard"
                      {...params}
                    />
                  )}
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
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>

      {tabActive == 1 ? (
        <>
          <Grid container spacing={5} sx={{ mt: 2, mb: 10 }}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>
                {titleTab}
              </span>
            </Grid>
            <Grid item xs={2}>

            </Grid>
            <Grid item xs={2}  >
            
              <Box
              
                sx={{
                  width: 200,
                  height: 65,
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "green",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "15px",
                  }}
                >
                  <span>Good</span>
                  <p style={{ fontSize: 28 }}><CountUp end={totalOk} /></p>
                </div>
              </Box>
            </Grid>


            <Grid item xs={2}>
              <Box
                sx={{
                  width: 200,
                  height: 65,
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "red",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "15px",
                  }}
                >
                  <span>NG</span>
                  <p style={{ fontSize: 28 }}><CountUp end={totalNg} /></p>
                </div>
              </Box>
            </Grid>

            <Grid item xs={2}>
              <Box
                sx={{
                  width: 200,
                  height: 65,
                  backgroundColor: "blue",
                  "&:hover": {
                    backgroundColor: "blue",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "15px",
                  }}
                >
                  <span>FIXED</span>
                  <p style={{ fontSize: 28 }}><CountUp end={totalFixed} /></p>
                </div>
              </Box>
            </Grid>


          </Grid>

         
        </>
      ) : (
        <>
          <Grid container spacing={1} sx={{ mt: 2, mb: 10 }}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
              <span style={{ fontSize: 20, fontWeight: "bold" }}>
                {titleTab}
              </span>
            </Grid>
          </Grid>
        </>
      )}

<div style={{display:tabActive==1?'block': 'none'}}>
<BarChart_Dashboard
            dataset={dataset}
            statechart={statechart}
            x_title={(startdate ?? "") + " - " + (enddate ?? "")}
          />

</div>

    </Box>

   
     
  
  );
}
