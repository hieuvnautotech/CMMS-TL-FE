import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";

import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useModal, SelectBox } from "@basesShared";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Supplier() {
  // const Supplier = () =>
  // {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "supplier_name", headerName: "Supplier Name", width: 150 },
    { field: "created_at_format", headerName: "Create Date", width: 200 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => editrow(params)}
          >
            Edit
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleterow(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const [tableData, setTableData] = useState([]);
  const [mode, setMode] = useState(["add"]);
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    api_get("SupplierApi").then((data) => {
      console.log(data);
      setTableData(data);
    });
  }, []);

  const addnew = () => {
    setMode("add");
    setRowData({});
    toggle();
  };

  const editrow = (params) => {
    var row_data = params.row;
    console.log(row_data);
    setMode("edit");
    setRowData(row_data);
    toggle();
  };

  const deleterow = (params) => {
    if (window.confirm("Delete the item?")) {
      var row_data = params.row;
      console.log(row_data);

      api_post("SupplierApi/delete-supplier", row_data).then((data) => {
        //reload grid
        //reload table
        api_get("SupplierApi").then((data) => setTableData(data));
      });
    }
  };

  const refreshTable = () => {
    //reload table
    api_get("SupplierApi").then((data) => {
      setTableData(data);
      AlertSuccess("save success");
    });
  };

  const search = () => {
    //reload table
    return api_get("SupplierApi", { search_name: searchName }).then((data) =>
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
          <Button
            variant="contained"
            color="success"
            sx={{ boxShadow: 1, borderRadius: 2, mb: 1 }}
            onClick={addnew}
          >
            Add new
          </Button>
        </Grid>

        <Grid item>
          <TextField
            label="Search name"
            variant="standard"
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ borderRadius: 2, mb: 1 }}
          />
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

      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      <Modal_Location
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>

    // </>
  );
}

const Modal_Location = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const newdata = {
      ...data,
      item_select_type: !data.type_id
        ? null
        : { title: data.type_name, value: data.type_id },
    };
    setInfo(newdata);
  }, [data]);

  const handleSave = () => {
    //post data len server xu ly save
    api_post("SupplierApi/add-update-supplier", info).then((res) => {
      //reload table
      refreshTable();
      //close modal
      hide();
    });
  };
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div>
            <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
              <DialogTitle>{mode == "add" ? "ADD NEW" : "EDIT"}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="supplier_name"
                  label="Supplier Name"
                  onChange={(e) =>
                    setInfo({ ...info, supplier_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.supplier_name}
                />

                {/* <FormControl   margin="dense" fullWidth>
            <InputLabel id="select-type-label">Active</InputLabel>
              <Select
                labelId="select-type-label"
                id="select-type"
                value={info.use}
                label="Active"
                onChange={handleChangeSelect}
                sx={{width:200}}
              >
                <MenuItem value={true}>Use</MenuItem>
                <MenuItem value={false}>Don't Use</MenuItem>
               
              </Select>
            </FormControl>
            */}
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
