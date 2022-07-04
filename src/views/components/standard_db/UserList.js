import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { api_get, api_post, AlertSuccess, ErrorAlert } from "@utils";
import { Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, FormControlLabel, Checkbox } from "@mui/material";
import { useModal, SelectBox, ButtonAsync, DataTable } from "@basesShared";

export default function UserList() {
  const [mode, setMode] = useState("add");
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");
  const gridRef = useRef();

  const columns = [
    { field: "userid", headerName: "ID", width: 150 },
    { field: "username", headerName: "User Name", width: 250, },
    { field: "staffname", headerName: "Staff", width: 250, editable: false, },
    { field: "active", headerName: "Use", width: 250, editable: false, renderCell: (params) => (params.row.active ? <Checkbox disabled checked /> : <Checkbox disabled />), },
    {
      field: "edit",
      headerName: "Edit",
      width: 150,
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
            onClick={() => deleterow(params)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

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
      api_post("UserAccountApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const refreshTable = () => {
    gridRef.current.refreshGrid().then(() => AlertSuccess("save success"));
  };

  const search = () => {
    gridRef.current.search({ search_name: searchName });
  };

  return (
    <Box sx={{ pb: 5, height: "500px", width: "100%" }}>
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

      <DataTable
        ref={gridRef}
        url="UserAccountApi"
        columns={columns}
        getRowId={(rows) => rows.userid}
      />

      <Modal_UserAccount
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>
  );
}

const Modal_UserAccount = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleSave = () => {
    return api_post("UserAccountApi/add-update", info).then((res) => {
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
                required={true}
                margin="dense"
                id="username"
                label="User Name"
                onChange={(e) =>
                  setInfo({ ...info, username: e.target.value })
                }
                fullWidth
                defaultValue={data.username}
              />

              <FormControl margin="dense" fullWidth>
                <SelectBox
                  placeholder="Staff"
                  url="UserAccountApi/get-staff"
                  defaultValue={{ title: data.staffname, value: data.staffid }}
                  onChange={(item) => {
                    setInfo({ ...info, staffid: item.value });
                  }}
                >
                </SelectBox>
              </FormControl>

            </DialogContent>
            <DialogActions sx={{ display: "block" }}>
              <FormControlLabel sx={{ margin: "0 0 0 4px" }}
                label="Use"
                control={
                  <Checkbox
                    defaultChecked={mode == "add" ? true : data.active}
                    onChange={(e) => {
                      setInfo({ ...info, active: e.target.checked });
                    }} />} />
              <div style={{ float: "right" }}>
                <Button onClick={hide}>Cancel</Button>
                <ButtonAsync sx={{ marginLeft: "8px", marginRight: "15px" }} onClick={handleSave} icon="save" text="Save" />
              </div>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment >,
      document.body
    )
    : null;
};
