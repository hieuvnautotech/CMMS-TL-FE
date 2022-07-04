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
import { useModal, SelectBox, ButtonAsync, DataTable, SelectMultiple } from "@basesShared";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { api_get } from "@utils";
export default function Equipment() {
  const [mode, setMode] = useState("add");
  const [rowData, setRowData] = useState({});
  const { isShowing, toggle } = useModal();
  const [search, setSearch] = useState("");
  const [parts, setParts] = useState([]);
  const gridRef = useRef();
  useEffect(() => {
    api_get("EquipmentApi/get-part-collection").then((data) => {
      setParts(data);
    });
  }, []);
  const findParts = (params) => {
    let title = "";
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].equipment_id == params.row.equipment_id) {
        parts[i].part_name != null ? (title += parts[i].part_name + ", ") : "";
      } else {
      }
    }
    return title.slice(0, title.length - 2);
  };
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
    { field: "equipment_id", headerName: "ID", width: 10 },
    {
      field: "equipment_code",
      headerName: "Equipment #",
      width: 100,
    },
    {
      field: "equipment_name",
      headerName: "Equipment Name",
      width: 150,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "equipment_value",
      headerName: "Equipment Value",
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
      field: "part",
      headerName: "Parts",
      width: 150,
      editable: false,
      valueGetter: findParts,
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
      field: "created_at",
      headerName: "Created At",
      width: 150,
      editable: false,
    },
    {
      field: "use",
      headerName: "Use",
      width: 150,
      editable: false,
      renderCell: (params) => (params.row.use ? "Not Use" : "Use"),
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 150,
      editable: false,
    },
    {
      field: "created_by",
      headerName: "Created By",
      width: 150,
      editable: false,
    },
    {
      field: "level",
      headerName: "Level",
      width: 150,
      editable: false,
    },
    {
      field: "supplier",
      headerName: "Supplier",
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
      field: "location",
      headerName: "Location",
      width: 150,
      editable: false,
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      width: 150,
      editable: false,
    }
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
  const deleteRow = (params) => {
    if (window.confirm("Delete the item?")) {
      api_post("EquipmentApi/delete", params.row).then(() => {
        refreshTable();
      });
    }
  };

  const searchEquipment = () => {
    gridRef.current.search({ equipment_code: search });
  };

  const refreshTable = () => {
    gridRef.current.refreshGrid().then(() => 
    {api_get("EquipmentApi/get-part-collection").then((data) => {
      setParts(data);
      AlertSuccess("save success")});
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
            onClick={searchEquipment}
            icon ="search"
            text = "Search"
          />
        </Grid>
      </Grid>

      <DataTable
        ref={gridRef}
        url="EquipmentApi"
        columns={columns}
        getRowId={(rows) => rows.equipment_id}
      />

      <Modal_Equipment
        isShowing={isShowing}
        hide={toggle}
        mode={mode}
        data={rowData}
        refreshTable={refreshTable}
      />
    </Box>
  );
}
const Modal_Equipment = ({ isShowing, hide, mode, data, refreshTable }) => {
  const [info, setInfo] = useState({ h: 0 });
  //const [parts, setParts] = useState([]);
  const [partCollection, setPartCollection] = useState([]);
  useEffect(() => {
    // api_get("EquipmentApi/get-part").then((data) => {
    //   setParts(data);
    // });
    api_post("EquipmentApi/get-part-id", data).then((data) => {
      setPartCollection(data);
    });
    setInfo(data);
  }, [data]);

  const handleSave = () => {
   var newInfo={...info, partCollection}
    return api_post("EquipmentApi/add-update", info).then((res) => {
      api_post("EquipmentApi/change-part", newInfo).then((res) => {
        refreshTable();
        hide();
      });
    });
  };
  // const handleChange = (event, value) => {
  //   setPartCollection(value);
  // };
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
                  id="equipment_name"
                  label="Equipment Name"
                  onChange={(e) =>
                    setInfo({ ...info, equipment_name: e.target.value })
                  }
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.equipment_name}
                />
                <TextField
                  margin="dense"
                  id="equipment_value"
                  label="Equipment Value"
                  onChange={(e) =>
                    setInfo({ ...info, equipment_value: e.target.value })
                  }
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.equipment_value}
                />
                <TextField
                  margin="dense"
                  id="serial_number"
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
                  label="Price"
                  onChange={(e) => setInfo({ ...info, price: e.target.value })}
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.price}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Made Date"
                    value={info.made_date ? info.made_date : null}
                    onChange={(newValueMadeDate) => {
                      setInfo({ ...info, made_date: newValueMadeDate });
                    }}
                    renderInput={(params) => (
                      <TextField margin="dense" style = {{width: 260, marginLeft: 5}} {...params} />
                    )}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Install Date"
                    value={info.install_date ? info.install_date : null}
                    onChange={(newValue) => {
                      setInfo({ ...info, install_date: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField margin="dense" style = {{width: 260, marginLeft: 5}} {...params} />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  margin="dense"
                  id="remark"
                  label="Remark"
                  onChange={(e) => setInfo({ ...info, remark: e.target.value })}
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.remark}
                />
                <TextField
                  margin="dense"
                  id="level"
                  label="Level"
                  onChange={(e) => setInfo({ ...info, level: e.target.value })}
                  style = {{width: 260, marginLeft: 5}}
                  defaultValue={info.level}
                />
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
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
                <FormControl margin="dense" style = {{width: 260, marginLeft: 5}}>
                  <SelectBox
                    placeholder="Manufacturer"
                    url="EquipmentApi/get-manufacturer"
                    defaultValue={{
                      title: data.manufacturer,
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
                      title: data.supplier,
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
                      title: data.type,
                      value: data.type_id,
                    }}
                    onChange={(item) => {
                      setInfo({ ...info, type_id: item.value });
                    }}
                  ></SelectBox>
                </FormControl>
                <FormControl margin="dense" style = {{width: 525, marginLeft: 5}}>
                  <SelectMultiple
                    placeholder="Part"
                    urlOptions="EquipmentApi/get-part"
                    value={partCollection}
                    onChange={(item) => {
                      setPartCollection(item);
                    }}
                  ></SelectMultiple>
                </FormControl>
                {/* <Autocomplete
                  multiple
                  id="part"
                  options={parts}
                  value={partCollection}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.value}>
                      {option.title}
                    </Box>
                  )}
                  filterSelectedOptions
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" label="Part" style = {{width: 525, marginLeft: 5}}/>
                  )}
                /> */}
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
