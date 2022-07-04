import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { ButtonAsync } from "@basesShared";
export default function Shipping() {
  const [tableData, setTableData] = useState([]);
  const [scanCode, setScan] = useState("");
  const [searchName, setSearchName] = useState("");
  const columns = [
    { field: "shipping_id", headerName: "ID", width: 90 },
    {
      field: "equipment_code",
      headerName: "Equipment Code",
      width: 150,
    },
    {
      field: "shipping_date_fomat",
      headerName: "Shipping Date",
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
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
            <Button
            variant="contained"
            color="error"
            size="small"
            // style={{ marginLeft: 16 }}
            onClick={() => deleterow(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    api_get("ShippingApi").then((data) => setTableData(data));
  }, []);

  const scan = () => {
    api_post("ShippingApi/scan", { equipment_code: scanCode }).then(() => {
      refreshTable();
    });
  };
  const deleterow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("ShippingApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const refreshTable = () => {
    //reload table
    api_get("ShippingApi").then((data) => {
      setTableData(data);
      AlertSuccess("save success");
    });
  };

  const search = () => {
    //reload table
    api_get("ShippingApi", { search_name: searchName }).then((data) =>
      setTableData(data)
    );
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
            label="Scan"
            variant="standard"
            onChange={(e) => setScan(e.target.value)}
            sx={{ borderRadius: 2, mb: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            onClick={scan}
          >
            Scan
          </Button>
        </Grid>
        <Grid item>
          <TextField
            label="Search name"
            variant="standard"
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ borderRadius: 2, mb: 1 }}
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
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(rows) => rows.shipping_id}
      />
    </Box>
  );
}
