import React, { useState, useEffect, useRef } from "react";
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
import { useModal, SelectBox, ButtonAsync, DataTable } from "@basesShared";
import Grid from "@mui/material/Grid";
export default function Unit() {
  const [mode, setMode] = useState("add");
  const [rowdata, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [searchName, setSearchName] = useState("");

  const gridRef = useRef();

  const columns = [
    { field: "unit_id", headerName: "ID", width: 90 },
    {
      field: "unit_name",
      headerName: "Unit Name",
      width: 150,
    },
    {
      field: "unit_remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },
    {
      field: "manufacturer_name",
      headerName: "Manufacturer Name",
      width: 150,
      editable: false,
    },
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
            // style={{ marginLeft: 16 }}
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
      api_post("UnitApi/delete-unit", params.row).then(() => {
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

      <DataTable
        ref={gridRef}
        url="UnitApi"
        columns={columns}
        getRowId={(rows) => rows.unit_id}
      />

      <Modal_Unit
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowdata}
        refreshTable={refreshTable}
      />
    </Box>
  );
}

const Modal_Unit = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });

  useEffect(() => {
    setInfo(data);
  }, [data]);
  const handleSave = () => {
    //post data len server xu ly save
    return api_post("UnitApi/add-update-unit", info).then((res) => {
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
                  id="unit_name"
                  label="Unit Name"
                  onChange={(e) =>
                    setInfo({ ...info, unit_name: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.unit_name}
                />
                <TextField
                  margin="dense"
                  id="unit_remark"
                  label="Unit Remark"
                  onChange={(e) =>
                    setInfo({ ...info, unit_remark: e.target.value })
                  }
                  fullWidth
                  defaultValue={info.unit_remark}
                  // variant="standard"
                />
                <FormControl margin="dense" fullWidth>
                  <SelectBox
                    placeholder="Manufacturer"
                    url="EquipmentApi/get-manufacturer"
                    defaultValue={{
                      title: data.manufacturer_name,
                      value: data.manufacturer_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, manufacturer_id: item.value });
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
