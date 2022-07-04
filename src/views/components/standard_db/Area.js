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
import DialogTitle from "@mui/material/DialogTitle";
import Grid from '@mui/material/Grid';
import { useModal, ButtonAsync} from "@basesShared";

export default function Area() {
  const [tableData, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState('');
  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
      //headerAlign: 'center',
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
    { field: "area_id", headerName: "ID", width: 90 },
    {
      field: "area_name",
      headerName: "Area Name",
      width: 150,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },
  ];

  useEffect(() => {
    api_get("AreaApi").then((data) => setTableData(data));
  }, []);

  const addnew = () => {
    setMode("add");
    setRowData({});
    toggle();
  };

  const editrow = (params) => {
    var row_data = params.row;
    setMode("edit");
    setRowData(row_data);
    toggle();
  };
  const deleterow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("AreaApi/delete-area", params.row).then(() => {
        refreshTable();
    
      });
    }
  };
    const search =()=>{
    //reload table
    api_get("AreaApi",{search_name:searchName }).then((data) =>  setTableData(data))
};

  const refreshTable = () => {
    //reload table
    api_get("AreaApi").then((data) => {
      setTableData(data);
      AlertSuccess("save success");
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
        getRowId={rows => rows.area_id}
      />

      <Modal_Area
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>
  );
}

const Modal_Area = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });

  useEffect(() => {
    setInfo(data);
  }, [data]);
  const handleSave = () => {
    //post data len server xu ly save
    api_post("AreaApi/add-update-area", info).then((res) => {
      //reload table
      refreshTable();
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
                  id="area_name"
                  label="Area name"
                  onChange={(e) =>
                    setInfo({ ...info, area_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.area_name}
                />
                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  onChange={(e) => setInfo({ ...info, remark: e.target.value })}
                  fullWidth
                  defaultValue={info.remark}
                  // variant="standard"
                />
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
