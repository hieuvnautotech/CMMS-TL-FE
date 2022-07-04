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
import {
  useModal,
  SelectBox,
  ButtonAsync,
  DataTable,
  useModal2,
  DateField,
} from "@basesShared";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { api_get } from "@utils";
export default function WorkingOrder() {
  const [mode, setMode] = useState("add");
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const { isShowing2, toggle2 } = useModal2();
  const [searchWorkOrder, setSearchWorkOrder] = useState("");
  const [searchEquipmentCode, setSearchEquipmentCode] = useState("");
  const [searchStartDate, setSearchStartDate] = useState(null);
  const [searchEndDate, setSearchEndDate] = useState(null);

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
            onClick={() => deleteRow(params)}
          >
            Delete
          </Button>
        );
      },
    },
    { field: "working_order_id", headerName: "ID", width: 90 },
    {
      field: "status_name",
      headerName: "Status",
      width: 150,
    },
    {
      field: "priority_name",
      headerName: "Priority",
      width: 150,
      editable: false,
    },
    {
      field: "work_order",
      headerName: "Work Order",
      width: 150,
      editable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => readRow(params)}
          >
            {params.row.work_order}
          </Button>
        );
      },
    },
    {
      field: "equipment_name",
      headerName: "Equipment Name",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: false,
    },
    {
      field: "requestor",
      headerName: "Requestor",
      width: 150,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "due_date",
      headerName: "Due Date",
      width: 150,
      editable: false,
    },
    {
      field: "working_date",
      headerName: "Working Date",
      width: 150,
      editable: false,
    },
    {
      field: "location",
      headerName: "Location",
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
      field: "file",
      headerName: "File",
      width: 150,
      editable: false,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      editable: false,
    },
    {
      field: "worker",
      headerName: "Worker",
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
  const readRow = (params) => {
    var row_data = params.row;
    setRowData(row_data);
    toggle2();
  };
  const deleteRow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("WorkingOrderApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const searchWorkingOrder = () => {
    var date = JSON.stringify(searchStartDate);
    var dateEnd = JSON.stringify(searchEndDate);
    gridRef.current.search({
      work_order: searchWorkOrder,
      equipment_name: searchEquipmentCode,
      start_date: date != "null" ? date.slice(1, 11) : "",
      end_date: dateEnd != "null" ? dateEnd.slice(1, 11) : "",
    });
  };

  const refreshTable = () => {
    gridRef.current.refreshGrid().then(() => AlertSuccess("save success"));
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
            label="Search Equipment"
            variant="standard"
            onChange={(e) => setSearchEquipmentCode(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <TextField
            label="Search Work Order"
            variant="standard"
            onChange={(e) => setSearchWorkOrder(e.target.value)}
            sx={{ borderRadius: 2, mb: 1, mr: 3 }}
          />
          <DateField
            label="Start Date"
            value={searchStartDate}
            onChange={(newValue) => {
              setSearchStartDate(newValue);
            }}
            sx={{ borderRadius: 2, mr: 3 }}
            variant="standard"
          />
          <DateField
            label="End Date"
            value={searchEndDate}
            onChange={(newValue) => {
              setSearchEndDate(newValue);
            }}
            sx={{ borderRadius: 2, mr: 3 }}
            variant="standard"
          />
          <ButtonAsync
            variant="contained"
            color="primary"
            sx={{ mx: 3, boxShadow: 1, mb: -4 }}
            onClick={searchWorkingOrder}
            icon="search"
            text="Search"
          />
        </Grid>
      </Grid>
      <DataTable
        ref={gridRef}
        url="WorkingOrderApi"
        columns={columns}
        getRowId={(rows) => rows.working_order_id}
      />
      <Modal_Working_Order
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowData}
        refreshTable={refreshTable}
      />
      <Modal_Working_Order_Read
        isShowing={isShowing2}
        hide={toggle2}
        data={rowData}
        refreshTable={refreshTable}
      />
    </Box>
  );
}
const Modal_Working_Order = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  useEffect(() => {
    setInfo(data);
  }, [data]);

  const handleSave = () => {
    return api_post("WorkingOrderApi/add-update", info).then((res) => {
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

                <FormControl
                  margin="dense"
                  style={{ width: 260, marginLeft: 5 }}
                >
                  <SelectBox
                    placeholder="Priority"
                    url="WorkingOrderApi/get-priority"
                    defaultValue={{
                      title: data.priority_name,
                      value: data.priority_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, priority_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  required
                  margin="dense"
                  id="work_order"
                  label="Work Order"
                  onChange={(e) =>
                    setInfo({ ...info, work_order: e.target.value })
                  }
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.work_order}
                />
                <FormControl
                  margin="dense"
                  style={{ width: 260, marginLeft: 5 }}
                >
                  <SelectBox
                    placeholder="Equipment Name"
                    url="ShippingOrder/get-equipment"
                    defaultValue={{
                      title: data.equipment_name,
                      value: data.equipment_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, equipment_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  margin="dense"
                  id="description"
                  label="Description"
                  onChange={(e) =>
                    setInfo({ ...info, description: e.target.value })
                  }
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.description}
                />
                <TextField
                  margin="dense"
                  id="requestor"
                  label="Requestor"
                  onChange={(e) =>
                    setInfo({ ...info, requestor: e.target.value })
                  }
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.requestor}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Name"
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.name}
                />
                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  onChange={(e) => setInfo({ ...info, remark: e.target.value })}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.remark}
                />
                <DateField
                  label="Due Date"
                  value={info.due_date}
                  onChange={(newValueDueDate) => {
                    setInfo({ ...info, due_date: newValueDueDate });
                  }}
                  margin="dense"
                  sx={{ width: 260, marginLeft: 0.5 }}
                />
                <FormControl
                  margin="dense"
                  style={{ width: 260, marginLeft: 5 }}
                >
                  <SelectBox
                    placeholder="Location"
                    url="ShippingOrder/get-location"
                    defaultValue={{
                      title: data.location,
                      value: data.location_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, location_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  margin="dense"
                  id="file"
                  label="File"
                  onChange={(e) => setInfo({ ...info, file: e.target.value })}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.file}
                />
                <FormControl
                  margin="dense"
                  style={{ width: 260, marginLeft: 5 }}
                >
                  <SelectBox
                    placeholder="Type"
                    url="EquipmentApi/get-type"
                    defaultValue={{
                      title: data.type,
                      value: data.type_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, type_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <TextField
                  margin="dense"
                  id="worker"
                  label="Worker"
                  onChange={(e) => setInfo({ ...info, worker: e.target.value })}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.worker}
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

const Modal_Working_Order_Read = ({ isShowing, hide, data }) => {
  const [info, setInfo] = useState({ h: 0 });
  const [parts, setParts] = useState([]);
  const [repair, setRepair] = useState([]);
  const columnsParts = [
    { field: "part_id", headerName: "ID", width: 50 },
    {
      field: "part_code",
      headerName: "Part Code",
      width: 100,
      editable: false,
    },
    {
      field: "part_name",
      headerName: "Part Name",
      width: 100,
      editable: false,
    },
    {
      field: "appropriate_qty",
      headerName: "Qty",
      width: 100,
      editable: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 100,
      editable: false,
    },
  ];
  const columnsRepair = [
    { field: "part_id", headerName: "ID", width: 50 },
    {
      field: "repair",
      headerName: "Repair Content",
      width: 500,
      editable: false,
    },
  ];
  useEffect(() => {
    // if (data.equipment_id) {
    //   api_get("WorkingOrderApi/get-parts", {
    //     equipment_id: data.equipment_id,
    //   }).then((data) => {
    //     setParts(data);
    //   });
    // }
    setInfo(data);
  }, [data]);
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div>
            <Dialog open={true} maxWidth={"sm"} fullWidth={true}>
              <DialogTitle>Work Order</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="work_order"
                  label="Work Order"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.work_order}
                />
                <TextField
                  margin="dense"
                  id="priority"
                  label="Priority"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.priority_name}
                />
                <TextField
                  margin="dense"
                  id="equipment_name"
                  label="Equipment Name"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.equipment_name}
                />
                <TextField
                  margin="dense"
                  id="description"
                  label="Description"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.description}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Name"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.name}
                />
                <TextField
                  margin="dense"
                  id="file"
                  label="File"
                  inputProps={{ readOnly: true }}
                  style={{ width: 260, marginLeft: 5 }}
                  defaultValue={info.file}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="status"
                  label="Status"
                  style={{ width: 260, marginLeft: 5 }}
                  inputProps={{ readOnly: true }}
                  defaultValue={info.status_name}
                />
                <DialogTitle>Part List</DialogTitle>
                {parts && (
                  <div style={{ height: 200, width: 525, marginLeft: 5 }}>
                    <DataGrid
                      rows={parts}
                      columns={columnsParts}
                      getRowId={(rows) =>
                        rows.part_id ? rows.part_id : rows.equipment_id
                      }
                    />
                  </div>
                )}
                <div style={{ height: 200, width: 525, marginLeft: 5, marginTop: 15 }}>
                    <DataGrid
                      rows={repair}
                      columns={columnsRepair}
                      getRowId={(rows) =>
                        rows.part_id ? rows.part_id : rows.equipment_id
                      }
                    />
                  </div>
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
