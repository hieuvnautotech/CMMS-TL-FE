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
import FormControl from "@mui/material/FormControl";
import { useModal, SelectBox, ButtonAsync } from "@basesShared";
import Grid from "@mui/material/Grid";
export default function Staff() {
  const [tableData, setTableData] = useState([]);
  const [mode, setMode] = useState("add");
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");
  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
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

      width: 100,
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
    { field: "staff_id", headerName: "ID", width: 90, editable: false,},
    {
      field: "staff_name",
      headerName: "Staff Name",
      editable: false,
      width: 150,
    },
    {
      field: "department_name",
      headerName: "Department",
      width: 150,
      editable: false,
    },
    {
      field: "call",
      headerName: "Call",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      editable: false,
    },
  ];

  useEffect(() => {
    api_get("StaffApi").then((data) => setTableData(data));
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
      api_post("StaffApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const refreshTable = () => {
    //reload table
    api_get("StaffApi").then((data) => {
      setTableData(data);
      AlertSuccess("save success");
    });
  };

  const search = () => {
    //reload table
    api_get("StaffApi", { search_name: searchName }).then((data) =>
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
        getRowId={(rows) => rows.staff_id}
      />

      <Modal_Staff
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>
  );
}

const Modal_Staff = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });

  useEffect(() => {
    setInfo(data);
  }, [data]);
  const handleSave = () => {
    return api_post("StaffApi/add-update", info).then((res) => {
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
                  id="staff_name"
                  label="Staff Name"
                  onChange={(e) =>
                    setInfo({ ...info, staff_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.staff_name}
                />
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Department"
                    url="StaffApi/get-department"
                    defaultValue={{title: data.use,value: data.use}}
                    onChange={(item) => {
                      setInfo({ ...info, use: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  margin="dense"
                  id="call"
                  label="Call"
                  onChange={(e) =>
                    setInfo({ ...info, call: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.call}
                />
                   <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  onChange={(e) =>
                    setInfo({ ...info, email: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.email}
                />
                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  onChange={(e) =>
                    setInfo({ ...info, remark: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.remark}
                />           
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
