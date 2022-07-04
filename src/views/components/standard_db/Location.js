import React, { useState, useEffect,useRef } from "react";
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

import { useModal, SelectBox, ButtonAsync, BoxLoading ,DataTable} from "@basesShared";
import FormControl from "@mui/material/FormControl";

import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function Location() {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "location_code",
      headerName: "Location Code",
      width: 150,
    },
    {
      field: "location_name",
      headerName: "Location Name",
      width: 150,
    },
    {
      field: "type_name",
      headerName: "Type",
      width: 150,
    },

    {
      field: "remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },

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
  ];

  const [mode, setMode] = useState("add");
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");
  
 const gridRef = useRef();

  // useEffect(() => {
  //   api_get("LocationApi").then((data) => {
  //     setTableData(data);
  //     setshowLoading(false);
  //   });
  // }, []);

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

      //reload table
      //api_get("LocationApi").then((data) => setTableData(data));
    }
  };

  const refreshTable = () => {
 
   gridRef.current.refreshGrid().then(data=>  {
   
 toggle();
    AlertSuccess("save success")
   })
   
  };

  const search = () => {
    gridRef.current.search({ search_name: searchName })
 
  };

  return (
    <Box sx={{ pb: 4, height: 450, width: "100%" }}>
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
            onClick={search}
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            icon="search"
            text="Search"
          />
        </Grid>
      </Grid>

      <DataTable 
          ref={gridRef}
          url="LocationApi"
          columns={columns}
          pageSize={2}
          rowsPerPageOptions={[2,20, 50]}
          IsPagingServer={true}
      />

      <Modal_Location
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>
  );
}

const Modal_Location = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
     
    setInfo(data);
  }, [data]);

  const handleSave = () => {
    //post data len server xu ly save
    return api_post("LocationApi/add-update-location", info).then((res) => {
      //reload table
      refreshTable();
 
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
                  id="location_name"
                  label="Location name"
                  onChange={(e) =>
                    setInfo({ ...info, location_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.location_name}
                />
                <TextField
                  margin="dense"
                  required
                  id="location_code"
                  label="Location code"
                  onChange={(e) =>
                    setInfo({ ...info, location_code: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.location_code}
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

                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Select type"
                    url="LocationApi/get-all-types"
                    defaultValue={{ title: data.type_name, value: data.type_id }}
                    onChange={(item) => {
                      console.log(item);
                      setInfo({ ...info, type_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
                <ButtonAsync onClick={handleSave} icon="save" text="Save" />
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
