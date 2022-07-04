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

export default function Tool() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "tool_name", headerName: "Tool Name", width: 150 },
    { field: "spec", headerName: "Spec", width: 150 },
    { field: "type_id", headerName: "Type", width: 150 ,hide:true},
    { field: "type_name", headerName: "Type", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "manufacturer_id", headerName: "Manufacturer", width: 150, hide:true },
    { field: "manufacturer_name", headerName: "Manufacturer", width: 150 },
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
    api_get("ToolApi/Get-All-Tool").then((data) => {
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

      api_post("ToolApi/delete-tool", row_data).then((data) => {
        //reload grid 
        //reload table
        api_get("ToolApi/Get-All-Tool").then((data) => setTableData(data));
      });
    }
  };

  const refreshTable = () => {
    //reload table
    api_get("ToolApi/Get-All-Tool").then((data) => {
      setTableData(data);
      // AlertSuccess("save success");
    });
  };

  const search = () => {
    //reload table
    return api_get("ToolApi/Get-All-Tool", { search_name: searchName }).then((data) =>
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

      <Modal_Tool
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

const Modal_Tool = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({});


  useEffect(() => {
    let title=""
  if(data.use===false)  title="Dont use"
  else  title="Use"
  
  const newdata={...data,status_selected : {title: title, value:data.use}  }

  console.log(data)
  setInfo(newdata);
}, [data]);

  const handleSave = (e) => {
    console.log(info);
    debugger;
    info.use = '1';
    if (info.tool_name && info.spec && info.type_id && info.price && info.unit && info.manufacturer_id) {
      api_post("ToolApi/add-update-tool", info).then((res) => {

        AlertSuccess('Success !!');
        //reload table
        refreshTable();
        //close modal
        hide();
      });
    } else {
      ErrorAlert("All Fields Are Required");
    }
   


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
                id="tool_name"
                label="Tool Name"
                onChange={(e) =>
                  setInfo({ ...info, tool_name: e.target.value })
                }
                fullWidth
                defaultValue={data.tool_name}
              />
              <TextField
             
                required
                margin="dense"
                id="spec"
                label="Spec"
                onChange={(e) =>
                  setInfo({ ...info, spec: e.target.value })
                }
                fullWidth
                defaultValue={data.spec}
              />
              <FormControl margin="dense" fullWidth>
                
                <SelectBox  
                  id="type_id"
                  placeholder="Type"
                  url="ToolApi/get-all-type_id"
                 
                  onChange={(item) => {
                    setInfo({ ...info, type_id: item.value });
                }}
                  defaultValue={{ title: data.type_name, value: data.type_id }}
                >
                </SelectBox>
              </FormControl> 
              <TextField
                type="number"
             
                required
                margin="dense"
                id="price"
                label="Price"
                onChange={(e) =>
                  setInfo({ ...info, price: e.target.value })
                }
                fullWidth
                defaultValue={data.price}
              />
             

              <TextField
             
                required
                margin="dense"
                id="unit"
                label="Unit"
                onChange={(e) =>
                  setInfo({ ...info, unit: e.target.value })
                }
                fullWidth
                defaultValue={data.unit}
              />

           <FormControl margin="dense" fullWidth>
                <SelectBox
                  id="manufacturer_id"
                  placeholder="Manufacturer"
                  url="ToolApi/get-all-manufacturer_id"
                
                  onChange={(item) => {
                    setInfo({ ...info, manufacturer_id: item.value });
                }}
                  defaultValue={{ title: data.manufacturer_name, value: data.manufacturer_id }}
                >
                </SelectBox>
              </FormControl> 
             
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
