import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { DataTable, DateField, ButtonAsync } from "@basesShared";
export default function Stock() {
  const [searchType, setSearchType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);
  const [searchEquipment, setSearchEquipment] = useState("");
  const gridRef = useRef();
  const columns = [
    { field: "eq_receiving_id", headerName: "ID", width: 90 },
    {
      field: "equipment_code",
      headerName: "Equipment Code",
      width: 150,
    },
    {
      field: "receiving_date_fomat",
      headerName: "Receiving Date",
      width: 200,
      editable: false,
    },
    {
      field: "location_name",
      headerName: "Location Name",
      width: 150,
      editable: false,
    },
    {
      field: "equipment_name",
      headerName: "Equipment Name",
      width: 150,
      editable: false,
    },
    {
      field: "create_at_fomat",
      headerName: "Created Date",
      width: 200,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
  ];
  const search = () => {
    var date = JSON.stringify(searchStartDate);
    var dateEnd = JSON.stringify(searchEndDate);

    gridRef.current.search({
      equipment_code: searchEquipment,
      location_name: searchLocation,
      type_name: searchType,
      start_date_search: date != "null" ? date.slice(1, 11) : "",
      end_date_search: dateEnd != "null" ? dateEnd.slice(1, 11) : "",
    });
  };

  return (
    <Box sx={{ pb: 5, height: 350, width: "100%" }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <TextField
            label="Search Equipment"
            variant="standard"
            onChange={(e) => setSearchEquipment(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <TextField
            label="Search Type"
            variant="standard"
            onChange={(e) => setSearchType(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <TextField
            label="Search Location"
            variant="standard"
            onChange={(e) => setSearchLocation(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <DateField
            label="Start Date"
            value={searchStartDate}
            onChange={(newValue) => {
              setSearchStartDate(newValue);
            }}
            variant="standard"
            sx={{ borderRadius: 2, mr: 3 }}
          />
          <DateField
            label="End Date"
            value={searchEndDate}
            onChange={(newValue) => {
              setSearchEndDate(newValue);
            }}
            variant="standard"
            sx={{ borderRadius: 2, mr: 3 }}
          />
          <ButtonAsync
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            onClick={search}
            icon ="search"
            text = "Search"
          />
        </Grid>
      </Grid>

      <DataTable
        ref={gridRef}
        url="StockApi"
        columns={columns}
        pageSize={5}
        getRowId={(rows) => rows.eq_receiving_id}
      />
    </Box>
  );
}
