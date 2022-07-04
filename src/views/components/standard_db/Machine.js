import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import { api_post, AlertSuccess } from "@utils";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { useModal, SelectBox, ButtonAsync, DataTable, useModal2, DateField } from "@basesShared";
import Grid from "@mui/material/Grid";
import QRCode from "react-qr-code";
export default function Machine() {
  const [mode, setMode] = useState("add");
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [search, setSearch] = useState("");
  const { isShowing2, toggle2 } = useModal2();
  const gridRef = useRef();
  const columns = [
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => editRow(params)}
          >
            Edit
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            size="small"
            // style={{ marginLeft: 16 }}
            onClick={() => deleteRow(params)}
          >
            Delete
          </Button>
        );
      },
    },
    {
      field: "qr_code",
      headerName: "QR Code",
      width: 80,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => QrCode(params)}
          >
            QrCode
          </Button>
        );
      },
    },
    { field: "machine_id", headerName: "ID", width: 10 },
    {
      field: "machine_name",
      headerName: "Machine Name",
      width: 100,
    },
    {
      field: "machine_code",
      headerName: "Machine Code",
      width: 100,
    },
    {
      field: "area_name",
      headerName: "Area Name",
      width: 150,
      editable: false,
    },
    {
      field: "status_name",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "supplier_name",
      headerName: "Supplier Name",
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
      field: "serial_number",
      headerName: "Serial Number",
      width: 150,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      editable: false,
    },
    {
      field: "made_date",
      headerName: "Made Date",
      width: 150,
      editable: false,
    },
    {
      field: "install_date",
      headerName: "Install Date",
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
      field: "type_name",
      headerName: "Type Name",
      width: 150,
      editable: false,
    },
    {
      field: "unit_name",
      headerName: "Unit",
      width: 150,
      editable: false,
    },
    {
      field: "location_name",
      headerName: "Location",
      width: 150,
      editable: false,
    },
  ];

  const addNew = () => {
    setMode("add");
    setRowData({});
    toggle();
  };

  const editRow = (params) => {
    var row_data = params.row;
    setMode("edit");
    setRowData(row_data);
    toggle();
  };
  const QrCode = (params) => {
    var row_data = params.row;
    setRowData(row_data);
    toggle2();
  };
  const deleteRow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("MachineApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const searchMachine = () => {
    gridRef.current.search({ Machine_code: search });
  };

  const refreshTable = () => {
    gridRef.current.refreshGrid().then(() => 
    {
      AlertSuccess("save success")
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
            onClick={addNew}
          >
            Add new
          </Button>
        </Grid>
        <Grid item>
          <TextField
            label="Search Equipment #"
            variant="standard"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ borderRadius: 2, mb: 1 }}
          />
          <ButtonAsync
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            onClick={searchMachine}
            icon ="search"
            text = "Search"
          />
        </Grid>
      </Grid>
      <DataTable
        ref={gridRef}
        url="MachineApi"
        columns={columns}
        getRowId={(rows) => rows.machine_id}
      />
      <Modal_Machine
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowData}
        refreshTable={refreshTable}
      />
      <Modal_Qr_Code
        isShowing={isShowing2}
        hide={toggle2}
        data={rowData}
        refreshTable={refreshTable}
      />
    </Box>
  );
}
const Modal_Qr_Code = ({ isShowing, hide, data }) => {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div>
            <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
              <DialogTitle>QrCode</DialogTitle>
              <DialogContent>
                  <QRCode size={550} value={`Machine code: ${data.machine_code} Type: ${data.type_name} Create: ${data.made_date_format}`} />
              </DialogContent>
              <DialogActions>
                <Button onClick={hide}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
const Modal_Machine = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleSave = () => {
    return api_post("MachineApi/add-update", info).then((res) => {
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
                  required
                  margin="dense"
                  id="machine_name"
                  label="Machine Name"
                  onChange={(e) =>
                    setInfo({ ...info, machine_name: e.target.value })
                  }
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.machine_name}
                />
                <TextField
                  margin="dense"
                  id="serial_number"
                  type="number"
                  label="Serial Number"
                  onChange={(e) =>
                    setInfo({ ...info, serial_number: e.target.value })
                  }
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.serial_number}
                />
                <TextField
                  margin="dense"
                  id="price"
                  type="number"
                  label="Price"
                  onChange={(e) => setInfo({ ...info, price: e.target.value })}
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.price}
                />
                <DateField
                  label="Install Date"
                  value={info.install_date}
                  onChange={(newValueDueDate) => {
                    setInfo({ ...info, install_date: newValueDueDate });
                  }}
                  margin="dense"
                  sx={{ width: 260, marginLeft: 0.5 }}
                />
                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  onChange={(e) => setInfo({ ...info, remark: e.target.value })}
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.remark}
                />
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Location"
                    url="ShippingOrder/get-location"
                    defaultValue={{
                      title: data.location_name,
                      value: data.location_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, location_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
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
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Supplier"
                    url="EquipmentApi/get-supplier"
                    defaultValue={{
                      title: data.supplier_name,
                      value: data.supplier_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, supplier_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Type"
                    url="EquipmentApi/get-type"
                    defaultValue={{
                      title: data.type_name,
                      value: data.type_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, type_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl
                  margin="dense"
                  style={{ width: 260, marginLeft: 5 }}
                >
                  <SelectBox
                    placeholder="Status"
                    url="WorkingOrderApi/get-status"
                    defaultValue={{
                      title: data.status_name,
                      value: data.status_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, status_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>

                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Unit"
                    url="MachineApi/get-unit"
                    defaultValue={{
                      title: data.unit_name,
                      value: data.unit_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, unit_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>

                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Area"
                    url="MachineApi/get-area"
                    defaultValue={{
                      title: data.area_name,
                      value: data.area_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, area_id: item.value });
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
